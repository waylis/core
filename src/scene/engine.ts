import { Message, MessageManager } from "../message/message";
import { MessageBodyMap, SystemMessageBody, UserMessageBodyType } from "../message/types";
import { Command, createCommand } from "./command";
import { Scene, SceneResponsesMap } from "./scene";
import { SceneStep, StepManager } from "./step";
import { Database } from "../database/database";
import { EventBus } from "../events/bus";

export class SceneEngine {
    commands: Map<string, Command> = new Map();
    scenes: Map<string, Scene<any>> = new Map();

    constructor(
        private db: Database,
        protected eventBus: EventBus,
        protected messageManager: MessageManager,
        protected stepManager: StepManager
    ) {}

    addScene<Steps extends readonly SceneStep<any, any>[]>(
        command: Command,
        scene: {
            steps: [...Steps];
            handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody | SystemMessageBody[]>;
        }
    ) {
        const cmd = createCommand(command);
        this.commands.set(cmd.value, cmd);
        this.scenes.set(cmd.value, scene);
    }

    listenMessages() {
        const handler = async (msg: Message) => {
            try {
                const response = await this.handleMessage(msg);
                this.eventBus.emit("newSystemResponse", { userID: msg.senderID, response: response });
            } catch (error) {
                console.error("Handle message failed", error);
            }
        };

        this.eventBus.on("newUserMessage", handler);
        return () => this.eventBus.off("newUserMessage", handler);
    }

    async handleMessage(msg: Message): Promise<Message | Message[]> {
        await this.saveMessageToDatabase(msg);

        if (msg.body.type === "command") return this.handleCommand(msg);

        try {
            if (msg.scene && msg.step) return this.handleSceneStep(msg);
        } catch (error) {
            console.error("Internal scene error", error);
            return this.createErrorMessage(msg, "Internal error. Please, try again later.");
        }

        return this.createErrorMessage(msg, "Unknown command.");
    }

    private async handleCommand(msg: Message): Promise<Message | Message[]> {
        const scene = this.scenes.get(msg.body.content.toString());
        if (!scene) return this.createErrorMessage(msg, "Unknown command.");

        if (scene.steps.length > 0) {
            const step = scene.steps[0];
            return this.createStepPromptMessage(msg, step, msg.body.content.toString());
        }

        const body = await scene.handler({});
        const bodies = Array.isArray(body) ? body : [body];
        const results = await Promise.all(
            bodies.map((b) => this.createSceneResponseMessage(msg, b, msg.body.content.toString()))
        );

        return bodies.length > 1 ? results : results[0];
    }

    private async handleSceneStep(msg: Message): Promise<Message | Message[]> {
        const scene = this.scenes.get(msg.scene || "");
        if (!scene) return this.createErrorMessage(msg, "Unknown scene.");

        const stepIndex = scene.steps.findIndex((s: SceneStep) => s.key === msg.step);
        if (stepIndex === -1) return this.createErrorMessage(msg, "Unknown step.");

        const step = scene.steps[stepIndex];
        const isLastStep = stepIndex === scene.steps.length - 1;

        if (step.handler) {
            return isLastStep
                ? this.handleLastStepWithHandler(msg, scene, step)
                : this.handleIntermediateStepWithHandler(msg, scene, step, stepIndex);
        }

        return isLastStep
            ? this.handleLastStepWithoutHandler(msg, scene)
            : this.handleIntermediateStepWithoutHandler(msg, scene, stepIndex);
    }

    private async handleIntermediateStepWithHandler(
        msg: Message,
        scene: Scene<any>,
        step: SceneStep,
        stepIndex: number
    ): Promise<Message> {
        const body = await step.handler!(msg.body.content as MessageBodyMap[UserMessageBodyType]);
        if (!body) {
            await this.confirmStep(msg);
            const nextStep = scene.steps[stepIndex + 1];
            return this.createStepPromptMessage(msg, nextStep, msg.scene!);
        }

        return this.createStepReplyMessage(msg, body);
    }

    private async handleLastStepWithHandler(
        msg: Message,
        scene: Scene<any>,
        step: SceneStep
    ): Promise<Message | Message[]> {
        const body = await step.handler!(msg.body.content as MessageBodyMap[UserMessageBodyType]);
        if (!body) {
            await this.confirmStep(msg);
            const responses = await this.collectStepResponses(msg);
            const finalBody = await scene.handler(responses);

            const bodies = Array.isArray(finalBody) ? finalBody : [finalBody];
            const results = await Promise.all(bodies.map((b) => this.createSceneResponseMessage(msg, b, msg.scene!)));
            return results.length > 1 ? results : results[0];
        }

        return this.createStepReplyMessage(msg, body);
    }

    private async handleLastStepWithoutHandler(msg: Message, scene: Scene<any>): Promise<Message | Message[]> {
        await this.confirmStep(msg);
        const stepResponses = await this.collectStepResponses(msg);
        const body = await scene.handler(stepResponses);

        const bodies = Array.isArray(body) ? body : [body];
        const results = await Promise.all(bodies.map((b) => this.createSceneResponseMessage(msg, b, msg.scene!)));
        return results.length > 1 ? results : results[0];
    }

    private async handleIntermediateStepWithoutHandler(
        msg: Message,
        scene: Scene<any>,
        stepIndex: number
    ): Promise<Message> {
        await this.confirmStep(msg);
        const nextStep = scene.steps[stepIndex + 1];
        return this.createStepPromptMessage(msg, nextStep, msg.scene!);
    }

    private async createErrorMessage(msg: Message, content: string): Promise<Message> {
        const errMsg = this.messageManager.createSystemMessage(
            { chatID: msg.chatID, body: { type: "text", content } },
            msg
        );
        await this.saveMessageToDatabase(errMsg);
        return errMsg;
    }

    private async createStepPromptMessage(msg: Message, step: SceneStep, sceneKey: string): Promise<Message> {
        const promptMsg = this.messageManager.createSystemMessage(
            { body: step.prompt, replyRestriction: step.replyRestriction, scene: sceneKey, step: step.key },
            msg
        );

        await this.saveMessageToDatabase(promptMsg);
        return promptMsg;
    }

    private async createSceneResponseMessage(
        msg: Message,
        body: SystemMessageBody,
        sceneKey: string
    ): Promise<Message> {
        const respMsg = this.messageManager.createSystemMessage({ body, scene: sceneKey }, msg);
        await this.saveMessageToDatabase(respMsg);
        return respMsg;
    }

    private async createStepReplyMessage(msg: Message, body: SystemMessageBody): Promise<Message> {
        const initial = await this.db.getMessageByID(msg.replyTo!);
        const replyMsg = this.messageManager.createSystemMessage(
            { body, replyRestriction: initial?.replyRestriction, scene: msg.scene!, step: msg.step! },
            msg
        );

        await this.saveMessageToDatabase(replyMsg);
        return replyMsg;
    }

    private async confirmStep(msg: Message): Promise<void> {
        const scene = msg.scene || "__unknown";
        const step = msg.step || "__unknown";
        const confirmed = this.stepManager.createConfirmedStep({
            messageID: msg.id,
            threadID: msg.threadID,
            scene,
            step,
        });

        await this.db.addConfirmedStep(confirmed);
    }

    private async collectStepResponses(msg: Message): Promise<SceneResponsesMap<any>> {
        const confirmedSteps = await this.db.getConfirmedStepsByThreadID(msg.threadID);
        const confirmedMessages = await this.db.getMessagesByIDs(confirmedSteps.map((c) => c.messageID));

        return confirmedMessages.reduce((acc: Record<string, MessageBodyMap[UserMessageBodyType]>, cm) => {
            if (!cm.step) return acc;
            acc[cm.step] = cm.body.content as MessageBodyMap[UserMessageBodyType];
            return acc;
        }, {});
    }

    private async saveMessageToDatabase(msg: Message) {
        await this.db.addMessage(msg);
    }
}

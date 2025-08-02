import { createMessage, Message, SYSTEM_SENDER_ID } from "../message/message";
import { MessageBody, SystemMessageBody } from "../message/types";
import { Command, createCommand } from "../scene/command";
import { Scene, SceneResponsesMap } from "../scene/scene";
import { createConfirmedStep, SceneStep } from "../scene/step";
import { Database } from "../database/database";

export interface EngineConfig {}

export class Engine {
    commands: Map<string, Command> = new Map();
    scenes: Map<string, Scene<any>> = new Map();

    constructor(private db: Database, private readonly config?: EngineConfig) {}

    addScene<Steps extends readonly SceneStep<any, any>[]>(
        command: Command,
        scene: {
            steps: [...Steps];
            handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody>;
        }
    ) {
        const cmd = createCommand(command);
        this.commands.set(cmd.value, cmd);
        this.scenes.set(cmd.value, scene);
    }

    async handleMessage(msg: Message): Promise<Message> {
        if (msg.body.type === "command") return this.handleCommand(msg);
        if (msg.scene && msg.step) return this.handleSceneStep(msg);

        return this.createErrorMessage(msg, "Unknown command.");
    }

    private async handleCommand(msg: Message): Promise<Message> {
        const scene = this.scenes.get(msg.body.content.toString());
        if (!scene) return this.createErrorMessage(msg, "Unknown command.");

        if (scene.steps.length > 0) {
            const step = scene.steps[0];
            return this.createStepPromptMessage(msg, step, msg.body.content.toString());
        }

        const body = await scene.handler({});
        return this.createSceneResponseMessage(msg, body, msg.body.content.toString());
    }

    private async handleSceneStep(msg: Message): Promise<Message> {
        const scene = this.scenes.get(msg.scene || "");
        if (!scene) return this.createErrorMessage(msg, "Unknown scene.");

        const stepIndex = scene.steps.findIndex((s) => s.key === msg.step);
        if (stepIndex === -1) return this.createErrorMessage(msg, "Unknown step.");

        const step = scene.steps[stepIndex];
        const isLastStep = stepIndex === scene.steps.length - 1;

        if (step.handler) {
            return isLastStep
                ? this.handleLastStepWithHandler(msg, scene, step)
                : this.handleIntermediateStepWithHandler(msg, scene, step, stepIndex);
        }

        return isLastStep
            ? this.handleLastStepWithoutHandler(msg, scene, step)
            : this.handleIntermediateStepWithoutHandler(msg, scene, stepIndex);
    }

    private createErrorMessage(msg: Message, content: string): Message {
        return createMessage({
            chatID: msg.chatID,
            senderID: SYSTEM_SENDER_ID,
            threadID: msg.threadID,
            body: { type: "text", content },
        });
    }

    private createStepPromptMessage(msg: Message, step: SceneStep, sceneKey: string): Message {
        return createMessage({
            body: step.prompt,
            chatID: msg.chatID,
            threadID: msg.threadID,
            senderID: SYSTEM_SENDER_ID,
            replyTo: msg.id,
            replyRestriction: step.replyRestriction,
            scene: sceneKey,
            step: step.key,
        });
    }

    private createSceneResponseMessage(msg: Message, body: MessageBody, sceneKey: string): Message {
        return createMessage({
            body,
            chatID: msg.chatID,
            threadID: msg.threadID,
            senderID: SYSTEM_SENDER_ID,
            replyTo: msg.id,
            scene: sceneKey,
        });
    }

    private async handleIntermediateStepWithHandler(
        msg: Message,
        scene: Scene<any>,
        step: SceneStep,
        stepIndex: number
    ): Promise<Message> {
        const body = await step.handler!(msg.body.content);
        if (!body) {
            await this.confirmStep(msg);
            const nextStep = scene.steps[stepIndex + 1];
            return this.createStepPromptMessage(msg, nextStep, msg.scene!);
        }

        return this.createStepReplyMessage(msg, body);
    }

    private async handleLastStepWithHandler(msg: Message, scene: Scene<any>, step: SceneStep): Promise<Message> {
        const body = await step.handler!(msg.body.content);
        if (!body) {
            const responses = await this.collectPreviousResponses(msg);
            const finalBody = await scene.handler(responses);
            return this.createSceneResponseMessage(msg, finalBody, msg.scene!);
        }

        return this.createStepReplyMessage(msg, body);
    }

    private async handleLastStepWithoutHandler(msg: Message, scene: Scene<any>, step: SceneStep): Promise<Message> {
        const responses = await this.collectPreviousResponses(msg);
        responses[step.key] = msg.body.content;

        const body = await scene.handler(responses);
        return this.createSceneResponseMessage(msg, body, msg.scene!);
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

    private async confirmStep(msg: Message): Promise<void> {
        const scene = msg.scene || "__unknown";
        const step = msg.step || "__unknown";
        await this.db.addConfirmedStep(createConfirmedStep({ messageID: msg.id, threadID: msg.threadID, scene, step }));
    }

    private createStepReplyMessage(msg: Message, body: MessageBody): Message {
        return createMessage({
            body,
            chatID: msg.chatID,
            threadID: msg.threadID,
            senderID: SYSTEM_SENDER_ID,
            replyTo: msg.id,
            replyRestriction: msg.replyRestriction,
            scene: msg.scene!,
            step: msg.step!,
        });
    }

    private async collectPreviousResponses(msg: Message): Promise<SceneResponsesMap<any>> {
        const confirmedSteps = await this.db.getConfirmedStepsByThreadID(msg.threadID);
        const confirmedMessages = await this.db.getMessagesByIDs(confirmedSteps.map((c) => c.messageID));

        return confirmedMessages.reduce((acc, cm) => {
            acc[cm.step as string] = cm.body.content;
            return acc;
        }, {});
    }
}

import { createMessage, Message, SYSTEM_SENDER_ID } from "../message/message";
import { SystemMessageBody } from "../message/types";
import { Command, createCommand } from "../scene/command";
import { Scene, SceneResponsesMap } from "../scene/scene";
import { SceneStep } from "../scene/step";

export interface EngineConfig {
    serverPort?: number;
}

export class Engine {
    commands: Map<string, Command> = new Map();
    scenes: Map<string, Scene<any>> = new Map();

    constructor(private readonly config?: EngineConfig) {}

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
        if (msg.body.type === "command") {
            const scene = this.scenes.get(msg.body.content);
            if (!scene)
                return createMessage({
                    chatID: msg.chatID,
                    senderID: SYSTEM_SENDER_ID,
                    threadID: msg.threadID,
                    body: {
                        type: "text",
                        content: "Unknown command.",
                    },
                });

            if (scene.steps.length > 0) {
                const step: SceneStep = scene.steps[0];
                return createMessage({
                    body: step.prompt,
                    chatID: msg.chatID,
                    threadID: msg.threadID,
                    senderID: SYSTEM_SENDER_ID,
                    replyRestriction: step.replyRestriction,
                    replyTo: msg.id,
                    scene: msg.body.content,
                    step: step.key,
                });
            }

            const body = await scene.handler({});
            return createMessage({
                body,
                chatID: msg.chatID,
                threadID: msg.threadID,
                senderID: SYSTEM_SENDER_ID,
                replyTo: msg.id,
                scene: msg.body.content,
            });
        }

        if (msg.scene && msg.step) {
            const scene = this.scenes.get(msg.scene);
            if (!scene)
                return createMessage({
                    chatID: msg.chatID,
                    senderID: SYSTEM_SENDER_ID,
                    threadID: msg.threadID,
                    body: {
                        type: "text",
                        content: "Unknown scene.",
                    },
                });

            const stepIndex: number = scene.steps.findIndex((s: SceneStep) => s.key === msg.step);
            const step: SceneStep = scene.steps[stepIndex];
            const isLastStep = stepIndex === scene.steps.length - 1;

            if (!step.handler && isLastStep) {
                const body = await scene.handler();
                return createMessage({
                    body,
                    chatID: msg.chatID,
                    threadID: msg.threadID,
                    senderID: SYSTEM_SENDER_ID,
                    replyTo: msg.id,
                    scene: msg.scene,
                });
            }
        }

        return createMessage({
            chatID: msg.chatID,
            senderID: SYSTEM_SENDER_ID,
            threadID: msg.threadID,
            body: {
                type: "text",
                content: "Unknown command.",
            },
        });
    }
}

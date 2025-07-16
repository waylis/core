import { Command, MessageBodyType, Scene, SceneResponsesMap, SceneStep, SystemMessageBody } from "./main.ts";

class App<Cmds extends readonly Command[]> {
    private commands: Cmds;
    private scenes: Scene[];

    constructor(commands: Cmds) {
        this.commands = commands;
    }

    addScene(scene: Scene) {
        this.scenes.push(scene);
        console.log(`Scene added for trigger: ${scene.trigger}`);
    }
}

type ToLiteralTuple<T extends readonly Command[]> = {
    [K in keyof T]: T[K] extends { value: infer V extends string; label: string } ? { value: V; label: string } : never;
};

function createApp<const T extends readonly Command[]>(cmds: T): App<ToLiteralTuple<T>> {
    return new App(cmds as ToLiteralTuple<T>);
}

export function createScene<Cmds extends readonly Command[], Steps extends readonly SceneStep[]>(config: {
    key: string;
    trigger: Cmds[number]["value"];
    steps: Steps;
    handler: (responses: SceneResponsesMap<Steps>) => SystemMessageBody;
}) {
    return config;
}

const app = createApp([
    { value: "start", label: "Start a new dialog" },
    { value: "ping", label: "Play ping pong" },
    { value: "health", label: "Health check" },
    // cmd- = not found
    // cmd+ scene- = not implemented
]);

const scene = createScene({
    key: "intro",
    trigger: "start",
    steps: [
        {
            key: "name",
            prompt: { type: MessageBodyType.text, content: "What's your name?" },
            replyRestriction: { bodyType: MessageBodyType.text },
            handler: (body) => ({
                type: MessageBodyType.markdown,
                content: `Hello, ${body}`,
            }),
        },
        {
            key: "age",
            prompt: { type: MessageBodyType.text, content: "Your age?" },
            replyRestriction: { bodyType: MessageBodyType.number },
            handler: (body) => ({
                type: MessageBodyType.text,
                content: `Got it, ${body} years.`,
            }),
        },
    ],
    handler: (responses) => {
        return {
            type: MessageBodyType.text,
            content: `Hi ${responses.name}, you're ${responses.age}`,
        };
    },
});

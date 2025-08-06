import { createCommand } from "./scene/command";
import { createScene } from "./scene/scene";
import { createStep } from "./scene/step";
import { HTTPServer } from "./server/server";

const stepName = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    replyRestriction: { bodyType: "text" },
});

const sceneHello = createScene({
    steps: [stepName],
    handler: async (answers) => {
        const content = `Hello ${answers.name}!`;
        return { type: "text", content };
    },
});

const startCmd = createCommand({ value: "start", label: "Start a new scene" });

const server = new HTTPServer();
server.start();

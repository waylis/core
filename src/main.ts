import { createCommand } from "./scene/command";
import { createScene } from "./scene/scene";
import { createStep } from "./scene/step";
import { HTTPServer } from "./server/server";

const app = new HTTPServer();

const command = createCommand({
    value: "hello",
    label: "Start a new scene",
});

const step = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    replyRestriction: { bodyType: "text" },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Hello ${answers.name}!` };
    },
});

app.addScene(command, scene);
app.start();

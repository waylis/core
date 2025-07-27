import { Engine } from "./engine/engine";
import { createCommand } from "./scene/command";
import { createScene } from "./scene/scene";
import { createStep } from "./scene/step";
import { MemoryStorage } from "./storage/memory/memory";

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

const memoryDB = new MemoryStorage();
const app = new Engine(memoryDB);
app.addScene(startCmd, sceneHello);

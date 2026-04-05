import { AppServer, createCommand, createScene, createStep } from "@waylis/core";

const command = createCommand({ value: "hello", label: "Hello World" });

const step = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    reply: { bodyType: "text" },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Hello, ${answers.name}!` };
    },
});

const app = new AppServer({ config: { port: 7771 } });
app.addScene(command, scene);

await app.start();
console.log("test app started");
process.exit(0);

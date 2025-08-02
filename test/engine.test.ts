import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Engine } from "../src/scene/engine";
import { createMessage } from "../src/message/message";
import { randomString } from "../src/utils/random";
import { createCommand } from "../src/scene/command";
import { createScene } from "../src/scene/scene";
import { MessageBody, SystemMessageBody } from "../src/message/types";
import { MemoryDatabase } from "../src/database/memory/memory";
import { createStep } from "../src/scene/step";

describe("engine > handleMessage", async () => {
    let engine: Engine;
    const db = new MemoryDatabase();

    const mockMessage = (body: MessageBody) =>
        createMessage({
            chatID: randomString(),
            senderID: randomString(),
            threadID: randomString(),
            body: body,
        });

    const mockSimpleScene = (response: SystemMessageBody) => {
        return createScene({ steps: [], handler: async () => response });
    };

    beforeEach(async () => {
        engine = new Engine(db);
        await engine.run();
    });

    it("should respond with unknown command for non-existent command", async () => {
        const msg = mockMessage({ type: "command", content: randomString() });
        const got = await engine.handleMessage(msg);

        assert.equal(got.body.type, "text");
        assert.equal(got.body.content, "Unknown command.");
    });

    it("should properly handle existing command", async () => {
        const cmd = createCommand({ value: "test" });
        const response: SystemMessageBody = { type: "text", content: "OK" };
        engine.addScene(cmd, mockSimpleScene(response));

        const msg = mockMessage({ type: "command", content: cmd.value });
        const got = await engine.handleMessage(msg);

        assert.equal(engine.commands.size, 1);
        assert.equal(engine.scenes.size, 1);
        assert.equal(got.body.type, response.type);
        assert.equal(got.body.content, response.content);
    });

    it("should handle empty command value", async () => {
        const msg = mockMessage({ type: "command", content: "" });
        const got = await engine.handleMessage(msg);

        assert.equal(got.body.type, "text");
    });

    it("should handle helloworld scene", async () => {
        const step = createStep({
            key: "name",
            prompt: { type: "text", content: "What is your name?" },
            replyRestriction: { bodyType: "text" },
        });

        const scene = createScene({
            steps: [step],
            handler: async (answers) => ({ type: "text", content: `Hello ${answers.name}!` }),
        });

        const cmd = createCommand({ value: "start" });
        engine.addScene(cmd, scene);

        const msg1 = mockMessage({ type: "command", content: cmd.value });
        const resp1 = await engine.handleMessage(msg1);
        const msg2 = createMessage({
            body: { type: "text", content: "Node.js" },
            chatID: resp1.chatID,
            senderID: msg1.senderID,
            threadID: resp1.threadID,
            replyTo: resp1.id,
            scene: resp1.scene,
            step: resp1.step,
        });
        const resp2 = await engine.handleMessage(msg2);

        assert.equal(resp1.body.content, step.prompt.content);
        assert.equal(resp2.body.content, "Hello Node.js!");
    });

    it("should handle calculator scene", async () => {
        const step1 = createStep({
            key: "num1",
            prompt: { type: "text", content: "Enter first number" },
            replyRestriction: { bodyType: "number" },
        });

        const step2 = createStep({
            key: "num2",
            prompt: { type: "text", content: "Enter second number" },
            replyRestriction: { bodyType: "number" },
        });

        const scene = createScene({
            steps: [step1, step2],
            handler: async (answers) => {
                return { type: "text", content: `The sum is ${answers.num1 + answers.num2}` };
            },
        });

        const cmd = createCommand({ value: "start" });
        engine.addScene(cmd, scene);

        const msg1 = mockMessage({ type: "command", content: cmd.value });
        const resp1 = await engine.handleMessage(msg1);
        const msg2 = createMessage({
            body: { type: "number", content: 3 },
            chatID: resp1.chatID,
            senderID: msg1.senderID,
            threadID: resp1.threadID,
            replyTo: resp1.id,
            scene: resp1.scene,
            step: resp1.step,
        });
        const resp2 = await engine.handleMessage(msg2);
        const msg3 = createMessage({
            body: { type: "number", content: 7 },
            chatID: resp2.chatID,
            senderID: msg2.senderID,
            threadID: resp2.threadID,
            replyTo: resp2.id,
            scene: resp2.scene,
            step: resp2.step,
        });
        const resp3 = await engine.handleMessage(msg3);

        assert.equal(resp1.body.content, step1.prompt.content);
        assert.equal(resp2.body.content, step2.prompt.content);
        assert.equal(resp3.body.content, "The sum is 10");
    });
});

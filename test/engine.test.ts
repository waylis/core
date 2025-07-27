import { describe, it, beforeEach } from "node:test";
import { Engine } from "../src/engine/engine";
import { createMessage } from "../src/message/message";
import { randomString } from "../src/utils/random";
import assert from "node:assert/strict";
import { createCommand } from "../src/scene/command";
import { createScene } from "../src/scene/scene";
import { MessageBody, SystemMessageBody } from "../src/message/types";
import { MemoryStorage } from "../src/storage/memory/memory";
import { createStep } from "../src/scene/step";

describe("Check handleMessage", async () => {
    let engine: Engine;
    const storage = new MemoryStorage();
    await storage.open();

    // Helper functions
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

    beforeEach(() => {
        engine = new Engine(storage);
    });

    it("should respond with unknown command for non-existent command", async () => {
        const testMsg = mockMessage({ type: "command", content: randomString() });
        const got = await engine.handleMessage(testMsg);

        assert.equal(got.body.type, "text");
        assert.equal(got.body.content, "Unknown command.");
    });

    it("should properly handle existing command", async () => {
        const cmd = createCommand({ value: "test" });
        const response: SystemMessageBody = { type: "text", content: "OK" };
        engine.addScene(cmd, mockSimpleScene(response));

        const testMsg = mockMessage({ type: "command", content: cmd.value });
        const got = await engine.handleMessage(testMsg);

        assert.equal(engine.commands.size, 1);
        assert.equal(engine.scenes.size, 1);
        assert.equal(got.body.type, response.type);
        assert.equal(got.body.content, response.content);
    });

    it("should handle empty command value", async () => {
        const testMsg = mockMessage({ type: "command", content: "" });
        const got = await engine.handleMessage(testMsg);

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
});

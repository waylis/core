import { MemoryDatabase } from "./../src/database/memory/memory";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { SceneEngine } from "../src/scene/engine";
import { Message, MessageManager } from "../src/message/message";
import { createSortableIdGenerator, randomString } from "../src/utils/random";
import { createCommand } from "../src/scene/command";
import { createScene } from "../src/scene/scene";
import { SystemMessageBody, UserMessageBody } from "../src/message/types";
import { createStep, StepManager } from "../src/scene/step";
import { eventBus } from "../src/events/bus";

describe("SceneEngine > handleMessage", async () => {
    let engine: SceneEngine;
    const db = new MemoryDatabase();
    const messageManager = new MessageManager(createSortableIdGenerator());
    const stepManager = new StepManager();

    const mockMessage = (
        body: UserMessageBody,
        chatID = randomString(),
        senderID = randomString(),
        replyMsg?: Message
    ) => messageManager.createUserMessage({ chatID, senderID, body: body }, replyMsg);

    const mockSimpleScene = (response: SystemMessageBody) => {
        return createScene({ steps: [], handler: async () => response });
    };

    beforeEach(async () => {
        await db.open();
        engine = new SceneEngine(db, eventBus, messageManager, stepManager);
    });

    it("should respond with unknown command for non-existent command", async () => {
        const msg = mockMessage({ type: "command", content: randomString() });
        const got = (await engine.handleMessage(msg)) as Message;

        assert.strictEqual(Array.isArray(got), false);
        assert.strictEqual(got.body.type, "text");
        assert.strictEqual(got.body.content, "Unknown command.");
    });

    it("should properly handle existing command", async () => {
        const cmd = createCommand({ value: "test" });
        const response: SystemMessageBody = { type: "text", content: "OK" };
        engine.addScene(cmd, mockSimpleScene(response));

        const msg = mockMessage({ type: "command", content: cmd.value });
        const got = (await engine.handleMessage(msg)) as Message;

        assert.strictEqual(engine.commands.size, 1);
        assert.strictEqual(engine.scenes.size, 1);

        assert.strictEqual(Array.isArray(got), false);
        assert.strictEqual(got.body.type, response.type);
        assert.strictEqual(got.body.content, response.content);
    });

    it("should handle empty command value", async () => {
        const msg = mockMessage({ type: "command", content: "" });
        const got = (await engine.handleMessage(msg)) as Message;

        assert.strictEqual(Array.isArray(got), false);
        assert.strictEqual(got.body.type, "text");
    });

    it("should handle helloworld scene", async () => {
        const step = createStep({
            key: "name",
            prompt: { type: "text", content: "What is your name?" },
            reply: { bodyType: "text" },
        });

        const scene = createScene({
            steps: [step],
            handler: async (answers) => ({ type: "text", content: `Hello ${answers.name}!` }),
        });

        const cmd = createCommand({ value: "start" });
        engine.addScene(cmd, scene);

        const msg1 = mockMessage({ type: "command", content: cmd.value });
        const resp1 = (await engine.handleMessage(msg1)) as Message;
        const msg2 = mockMessage({ type: "text", content: "Node.js" }, resp1.chatID, msg1.senderID, resp1);
        const resp2 = (await engine.handleMessage(msg2)) as Message;

        assert.strictEqual(Array.isArray(resp1), false);
        assert.strictEqual(resp1.body.content, step.prompt.content);
        assert.strictEqual(Array.isArray(resp2), false);
        assert.strictEqual(resp2.body.content, "Hello Node.js!");
    });

    it("should handle calculator scene", async () => {
        const step1 = createStep({
            key: "num1",
            prompt: { type: "text", content: "Enter first number" },
            reply: { bodyType: "number" },
        });

        const step2 = createStep({
            key: "num2",
            prompt: { type: "text", content: "Enter second number" },
            reply: { bodyType: "number" },
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
        const resp1 = (await engine.handleMessage(msg1)) as Message;
        const msg2 = mockMessage({ type: "number", content: 3 }, resp1.chatID, msg1.senderID, resp1);
        const resp2 = (await engine.handleMessage(msg2)) as Message;
        const msg3 = mockMessage({ type: "number", content: 7 }, resp2.chatID, msg2.senderID, resp2);
        const resp3 = (await engine.handleMessage(msg3)) as Message;

        assert.strictEqual(Array.isArray(resp1), false);
        assert.strictEqual(resp1.body.content, step1.prompt.content);
        assert.strictEqual(Array.isArray(resp2), false);
        assert.strictEqual(resp2.body.content, step2.prompt.content);
        assert.strictEqual(Array.isArray(resp3), false);
        assert.strictEqual(resp3.body.content, "The sum is 10");
    });

    it("should reject message with exceeded limit", async () => {
        const step = createStep({
            key: "name",
            prompt: { type: "text", content: "What is your name?" },
            reply: { bodyType: "text", bodyLimits: { minLength: 3 } },
        });

        const scene = createScene({
            steps: [step],
            handler: async (answers) => ({ type: "text", content: `Hello ${answers.name}!` }),
        });

        const cmd = createCommand({ value: "start" });
        engine.addScene(cmd, scene);

        const msg1 = mockMessage({ type: "command", content: cmd.value });
        const resp1 = (await engine.handleMessage(msg1)) as Message;

        assert.strictEqual(Array.isArray(resp1), false);
        assert.strictEqual(resp1.body.content, step.prompt.content);
        assert.throws(
            () => {
                mockMessage({ type: "text", content: "X" }, resp1.chatID, msg1.senderID, resp1);
            },
            { name: "Error" }
        );
    });
});

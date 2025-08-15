import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { SceneEngine } from "../src/scene/engine";
import { createUserMessage, Message } from "../src/message/message";
import { randomString } from "../src/utils/random";
import { createCommand } from "../src/scene/command";
import { createScene } from "../src/scene/scene";
import { SystemMessageBody, UserMessageBody } from "../src/message/types";
import { createStep } from "../src/scene/step";
import { eventBus } from "../src/events/bus";
import { JSONDatabase } from "../src/database/json/json";

describe("SceneEngine > handleMessage", async () => {
    let engine: SceneEngine;
    const db = new JSONDatabase();

    const mockMessage = (
        body: UserMessageBody,
        chatID = randomString(),
        senderID = randomString(),
        replyMsg?: Message
    ) => createUserMessage({ chatID, senderID, body: body }, replyMsg);

    const mockSimpleScene = (response: SystemMessageBody) => {
        return createScene({ steps: [], handler: async () => response });
    };

    beforeEach(async () => {
        await db.open();
        engine = new SceneEngine(db, eventBus);
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
        const msg2 = mockMessage({ type: "text", content: "Node.js" }, resp1.chatID, msg1.senderID, resp1);
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
        const msg2 = mockMessage({ type: "number", content: 3 }, resp1.chatID, msg1.senderID, resp1);
        const resp2 = await engine.handleMessage(msg2);
        const msg3 = mockMessage({ type: "number", content: 7 }, resp2.chatID, msg2.senderID, resp2);
        const resp3 = await engine.handleMessage(msg3);

        assert.equal(resp1.body.content, step1.prompt.content);
        assert.equal(resp2.body.content, step2.prompt.content);
        assert.equal(resp3.body.content, "The sum is 10");
    });

    it("should reject message with exceeded limit", async () => {
        const step = createStep({
            key: "name",
            prompt: { type: "text", content: "What is your name?" },
            replyRestriction: { bodyType: "text", bodyLimits: { minLength: 3 } },
        });

        const scene = createScene({
            steps: [step],
            handler: async (answers) => ({ type: "text", content: `Hello ${answers.name}!` }),
        });

        const cmd = createCommand({ value: "start" });
        engine.addScene(cmd, scene);

        const msg1 = mockMessage({ type: "command", content: cmd.value });
        const resp1 = await engine.handleMessage(msg1);

        assert.equal(resp1.body.content, step.prompt.content);
        assert.throws(
            () => {
                mockMessage({ type: "text", content: "X" }, resp1.chatID, msg1.senderID, resp1);
            },
            { name: "Error" }
        );
    });
});

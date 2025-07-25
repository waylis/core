import { describe, it, beforeEach } from "node:test";
import { Engine } from "../src/engine/engine";
import { createMessage } from "../src/message/message";
import { randomString } from "../src/utils/random";
import assert from "node:assert/strict";
import { createCommand } from "../src/scene/command";
import { createScene } from "../src/scene/scene";
import { MessageBody, SystemMessageBody } from "../src/message/types";

describe("Check handleMessage", () => {
    let engine: Engine;

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
        engine = new Engine();
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

        assert.equal(got.body.type, response.type);
        assert.equal(got.body.content, response.content);
    });

    it("should handle empty command value", async () => {
        const testMsg = mockMessage({ type: "command", content: "" });
        const got = await engine.handleMessage(testMsg);

        assert.equal(got.body.type, "text");
    });
});

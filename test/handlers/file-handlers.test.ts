import assert from "node:assert";
import { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getTestHost, TEST, testAppServerSetup, testCommand, testUserMessageBody } from "./config";
import { Chat } from "../../src/chat/chat";
import { FileMeta } from "../../src/file/file";
import { eventBus } from "../../src/events/bus";
import { createStep } from "../../src/scene/step";
import { AppServer } from "../../src/server/server";
import { createScene } from "../../src/scene/scene";
import { Message } from "../../src/message/message";

const fileScene = createScene({
    steps: [
        createStep({
            key: "file",
            prompt: { type: "text", content: "Send a file" },
            reply: { bodyType: "file" },
        }),
    ],
    handler: async (r) => {
        const file = r.file as FileMeta;
        return { type: "text", content: file.name };
    },
});

describe("File handlers", () => {
    let app: AppServer;
    let server: Server | null = null;
    let testChat: Chat;
    let testSystemMsg: Message;
    eventBus.setMaxListeners(99); // need to prevent MaxListenersExceededWarning

    beforeEach(async () => {
        app = new AppServer(testAppServerSetup());
        app.addScene(testCommand, fileScene);
        server = await app.start();

        const chatRes = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        testChat = await chatRes.json();

        await fetch(`${getTestHost(server!)}/api/message`, {
            method: "POST",
            body: JSON.stringify({
                chatID: testChat.id,
                body: testUserMessageBody,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const res1 = await fetch(`${getTestHost(server)}/api/messages?chat_id=${testChat.id}`);
        const msgs: Message[] = await res1.json();
        testSystemMsg = msgs[0] as Message; // latest message should be from system
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    describe("Get files", () => {
        it("should return an error if ID not specified", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.deepStrictEqual(got.message, "id query parameter is required");
        });

        it("should return an error if ID not found", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file?id=test`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 404);
            assert.deepStrictEqual(got.message, "File not found");
        });
    });

    describe("Upload files", () => {
        const testFileName = "test.txt";
        const testFile = new File([TEST], testFileName);

        it("should return an error if replyTo not specified", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file`, {
                method: "POST",
                body: testFile,
                headers: { "Content-Type": "text/plain" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.deepStrictEqual(got.message, "reply_to query parameter is required");
        });

        it("should return an error if reply message not exists", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file?reply_to=test`, {
                method: "POST",
                body: testFile,
                headers: { "Content-Type": "text/plain" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 404);
            assert.deepStrictEqual(got.message, "Invalid replyTo: message not found");
        });

        it("should return an error if content type is not specified", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file?reply_to=${testSystemMsg.id}`, {
                method: "POST",
                body: testFile,
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.deepStrictEqual(got.message, "Content-Type header required");
        });

        it("should return an error if content type is invalid", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file?reply_to=${testSystemMsg.id}`, {
                method: "POST",
                body: testFile,
                headers: { "Content-Type": "test" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.deepStrictEqual(got.message, "Couldn't define file extension");
        });

        it("should return an uploaded file metadata", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/file?reply_to=${testSystemMsg.id}`, {
                method: "POST",
                body: testFile,
                headers: { "Content-Type": "text/plain", "x-filename": testFileName },
            });

            const got: FileMeta = await res.json();
            assert.deepStrictEqual(res.status, 200);
            assert.deepStrictEqual(got.name, testFileName);
            assert.deepStrictEqual(got.mimeType, "text/plain");
            assert.deepStrictEqual(got.size, testFile.size);
            assert.ok(got.id.length > 0);
        });
    });
});

import assert from "node:assert";
import { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getTestHost, testAppServerSetup, testCommand, testScene, testUserMessageBody } from "./config";
import { eventBus } from "../../src/events/bus";
import { AppServer } from "../../src/server/server";
import { Message } from "../../src/message/message";
import { defaultConfig } from "../../src/server/config";

describe("Message handlers", () => {
    let app: AppServer;
    let server: Server | null = null;
    let testChatID: string;
    eventBus.setMaxListeners(99); // need to prevent MaxListenersExceededWarning

    beforeEach(async () => {
        app = new AppServer(testAppServerSetup());
        app.addScene(testCommand, testScene);
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    describe("Get messages", () => {
        it("should return empty array for chat with no messages", async () => {
            server = await app.start();

            const chatRes = await fetch(`${getTestHost(server)}/api/chat`, {
                method: "POST",
                body: JSON.stringify({}),
                headers: { "Content-Type": "application/json" },
            });

            const chat = await chatRes.json();
            testChatID = chat.id;

            const res = await fetch(`${getTestHost(server)}/api/messages?chat_id=${testChatID}`);
            const got = await res.json();
            const expected: Message[] = [];

            assert.deepStrictEqual(res.status, 200);
            assert.deepStrictEqual(got, expected);
        });

        it("should return an error when chat_id parameter is missing", async () => {
            server = await app.start();

            const res = await fetch(`${getTestHost(server)}/api/messages`);
            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.ok(got.message.length > 0);
            assert.deepStrictEqual(got.message, "chat_id query parameter is required");
        });

        it("should return an error when chat is not found", async () => {
            server = await app.start();

            const res = await fetch(`${getTestHost(server)}/api/messages?chat_id=non-existent-chat`);
            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 404);
            assert.ok(got.message.length > 0);
        });

        it("should use default limit when not specified", async () => {
            server = await app.start();

            const chatRes = await fetch(`${getTestHost(server)}/api/chat`, {
                method: "POST",
                body: JSON.stringify({}),
                headers: { "Content-Type": "application/json" },
            });
            const chat = await chatRes.json();
            testChatID = chat.id;

            const messagesToCreate = defaultConfig.defaultPageLimit;
            const createdMessages: Message[] = [];

            for (let i = 0; i < messagesToCreate; i++) {
                const msgRes = await fetch(`${getTestHost(server)}/api/message`, {
                    method: "POST",
                    body: JSON.stringify({
                        chatID: testChatID,
                        body: testUserMessageBody,
                    }),
                    headers: { "Content-Type": "application/json" },
                });
                const msg = await msgRes.json();
                createdMessages.push(msg);
            }

            const res1 = await fetch(`${getTestHost(server)}/api/messages?chat_id=${testChatID}`);
            const got1: Message[] = await res1.json();
            assert.deepStrictEqual(res1.status, 200);
            assert.ok(got1.length === defaultConfig.defaultPageLimit);

            const res2 = await fetch(`${getTestHost(server)}/api/messages?chat_id=${testChatID}&limit=${999}`);
            const got2: Message[] = await res2.json();
            assert.deepStrictEqual(res2.status, 200);
            assert.ok(got2.length === messagesToCreate * 2); // user messages + system messages
        });
    });

    describe("Create messages", () => {
        beforeEach(async () => {
            server = await app.start();

            // Create a chat for message tests
            const chatRes = await fetch(`${getTestHost(server)}/api/chat`, {
                method: "POST",
                body: JSON.stringify({}),
                headers: { "Content-Type": "application/json" },
            });
            const chat = await chatRes.json();
            testChatID = chat.id;
        });

        it("should create a user message", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    chatID: testChatID,
                    body: testUserMessageBody,
                }),
                headers: { "Content-Type": "application/json" },
            });

            const got: Message = await res.json();

            assert.deepStrictEqual(res.status, 201);
            assert.deepStrictEqual(got.body.type, testUserMessageBody.type);
            assert.deepStrictEqual(got.body.content, testUserMessageBody.content);
            assert.deepStrictEqual(got.chatID, testChatID);
            assert.ok(got.id.length > 0);
            assert.ok(got.senderID.length > 0);
            assert.ok(got.createdAt);
        });

        it("should return an error when reply message is not found", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    chatID: testChatID,
                    body: testUserMessageBody,
                    replyTo: "non-existent-message",
                }),
                headers: { "Content-Type": "application/json" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 404);
            assert.ok(got.message.length > 0);
        });

        it("should return an error when body is missing", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    chatID: testChatID,
                    // Missing body
                }),
                headers: { "Content-Type": "application/json" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.ok(got.message.length > 0);
        });

        it("should return an error when chatID is missing", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    body: testUserMessageBody,
                    // Missing chatID
                }),
                headers: { "Content-Type": "application/json" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.ok(got.message.length > 0);
        });

        it("should reject file message creation (if file not exists)", async () => {
            const testFileID = "test-file-id";

            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    chatID: testChatID,
                    body: {
                        type: "file",
                        content: { id: testFileID },
                    },
                }),
                headers: { "Content-Type": "application/json" },
            });

            assert.equal(404, res.status);
        });

        it("should reject files message creation (if files not exists)", async () => {
            const testFiles = [{ id: "file1-id" }, { id: "file2-id" }];

            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    chatID: testChatID,
                    body: {
                        type: "files",
                        content: testFiles,
                    },
                }),
                headers: { "Content-Type": "application/json" },
            });

            assert.equal(404, res.status);
        });

        it("should return 400 for invalid message body type", async () => {
            const res = await fetch(`${getTestHost(server!)}/api/message`, {
                method: "POST",
                body: JSON.stringify({
                    chatID: testChatID,
                    body: {
                        type: "invalid-type",
                        content: "some content",
                    },
                }),
                headers: { "Content-Type": "application/json" },
            });

            const got: { message: string } = await res.json();

            assert.deepStrictEqual(res.status, 400);
            assert.ok(got.message.length > 0);
        });
    });
});

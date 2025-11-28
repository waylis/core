import assert from "node:assert";
import { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getTestHost, TEST, testAppServerSetup } from "./config";
import { AppServer } from "../../src/server/server";
import { Chat } from "../../src/chat/chat";

describe("Chat handlers", () => {
    let app: AppServer;
    let server: Server | null = null;

    beforeEach(async () => {
        app = new AppServer(testAppServerSetup());
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    it("should return empty array", async () => {
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/chats`);

        const got = await res.json();
        const expected: Chat[] = [];

        assert.deepStrictEqual(res.status, 200);
        assert.deepStrictEqual(got, expected);
    });

    it("should create a chat with provided name", async () => {
        server = await app.start();
        const expected: Chat = { name: TEST, creatorID: TEST, createdAt: new Date(), id: "" };

        const res = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({ name: expected.name }),
            headers: { "Content-Type": "application/json" },
        });

        const got: Chat = await res.json();

        assert.deepStrictEqual(res.status, 201);
        assert.deepStrictEqual(got.name, expected.name);
        assert.deepStrictEqual(got.creatorID, expected.creatorID);
        assert.ok(new Date(got.createdAt).getTime() >= expected.createdAt!.getTime());
        assert.ok(got.id.length > 0);
    });

    it("should create a chat without provided name", async () => {
        server = await app.start();

        const res = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });

        const got: Chat = await res.json();

        assert.ok(got.name.length > 0);
    });

    it("should return list with new chat", async () => {
        server = await app.start();

        const res1 = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const newChat: Chat = await res1.json();

        const res2 = await fetch(`${getTestHost(server)}/api/chats`);
        const got: Chat[] = await res2.json();

        assert.deepStrictEqual(got.length, 1);
        assert.deepStrictEqual(got[0], newChat);
    });

    it("should update chat name", async () => {
        server = await app.start();

        const res1 = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const newChat: Chat = await res1.json();

        assert.notDeepStrictEqual(newChat.name, TEST);

        const res2 = await fetch(`${getTestHost(server)}/api/chat?id=${newChat.id}`, {
            method: "PUT",
            body: JSON.stringify({ name: TEST }),
            headers: { "Content-Type": "application/json" },
        });
        const got: Chat = await res2.json();

        assert.deepStrictEqual(got.name, TEST);
        assert.deepStrictEqual(got.id, newChat.id);
    });

    it("should do nothing if updating chat with empty request body", async () => {
        server = await app.start();

        const res1 = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const newChat: Chat = await res1.json();

        assert.notDeepStrictEqual(newChat.name, TEST);

        const res2 = await fetch(`${getTestHost(server)}/api/chat?id=${newChat.id}`, {
            method: "PUT",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const got: Chat = await res2.json();

        assert.deepStrictEqual(got, newChat);
    });

    it("should return an error when attempting to update a chat without specifying the ID", async () => {
        server = await app.start();

        const res = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "PUT",
            body: JSON.stringify({ name: TEST }),
            headers: { "Content-Type": "application/json" },
        });
        const got: { message: string } = await res.json();

        assert.deepStrictEqual(res.status, 400);
        assert.ok(got.message.length > 0);
    });

    it("should return an error when updating a non-existent chat", async () => {
        server = await app.start();

        const res = await fetch(`${getTestHost(server)}/api/chat?id=test`, {
            method: "PUT",
            body: JSON.stringify({ name: TEST }),
            headers: { "Content-Type": "application/json" },
        });
        const got: { message: string } = await res.json();

        assert.deepStrictEqual(res.status, 404);
        assert.ok(got.message.length > 0);
    });

    it("should delete chat", async () => {
        server = await app.start();

        const res1 = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const newChat: Chat = await res1.json();

        const res2 = await fetch(`${getTestHost(server)}/api/chat?id=${newChat.id}`, {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const deletedChat: Chat = await res2.json();

        assert.deepStrictEqual(deletedChat, newChat);

        const res3 = await fetch(`${getTestHost(server)}/api/chats`);
        const got = await res3.json();
        const expected: Chat[] = [];

        assert.deepStrictEqual(got, expected);
    });

    it("should return an error when attempting to delete a chat without specifying the ID", async () => {
        server = await app.start();

        const res = await fetch(`${getTestHost(server)}/api/chat`, {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const got: { message: string } = await res.json();

        assert.deepStrictEqual(res.status, 400);
        assert.ok(got.message.length > 0);
    });

    it("should return an error when deleting a non-existent chat", async () => {
        server = await app.start();

        const res = await fetch(`${getTestHost(server)}/api/chat?id=test`, {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
        });
        const got: { message: string } = await res.json();

        assert.deepStrictEqual(res.status, 404);
        assert.ok(got.message.length > 0);
    });
});

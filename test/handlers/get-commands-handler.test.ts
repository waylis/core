import assert from "node:assert";
import { Server } from "node:http";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getTestHost, testAppServerSetup, testCommand, testScene } from "./config";
import { Command } from "../../src/scene/command";
import { AppServer } from "../../src/server/server";

describe("getCommandsHandler", () => {
    let app: AppServer;
    let server: Server | null = null;

    beforeEach(async () => {
        app = new AppServer(testAppServerSetup);
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    it("should return empty array", async () => {
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/commands`);

        const got = await res.json();
        const expected: Command[] = [];

        assert.deepStrictEqual(got, expected);
    });

    it("should return one command", async () => {
        app.addScene(testCommand, testScene);
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/commands`);

        const got = await res.json();
        const expected = [testCommand];

        assert.deepStrictEqual(got, expected);
    });

    it("should return multiple commands", async () => {
        const command1: Command = { value: "test1", description: "test command 1", label: "Test 1" };
        const command2: Command = { value: "test2", description: "test command 2", label: "Test 2" };
        app.addScene(command1, testScene);
        app.addScene(command2, testScene);
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/commands`);

        const got = await res.json();
        const expected = [command1, command2];

        assert.deepStrictEqual(got, expected);
    });
});

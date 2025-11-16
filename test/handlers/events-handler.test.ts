import assert from "node:assert";
import { Server } from "node:http";
import { describe, beforeEach, afterEach, it } from "node:test";
import { getTestHost, testAppServerSetup } from "./config";
import { AppServer } from "./../../src/server/server";

describe("eventsHandler", () => {
    let app: AppServer;
    let server: Server | null = null;
    const reqTimeout = AbortSignal.timeout(100); // need to close connection manually

    beforeEach(async () => {
        app = new AppServer(testAppServerSetup);
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    it("should establish SSE connection with correct headers", async () => {
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/events`, { signal: reqTimeout });

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers.get("content-type"), "text/event-stream");
        assert.strictEqual(res.headers.get("cache-control"), "no-cache");
        assert.strictEqual(res.headers.get("connection"), "keep-alive");
    });
});

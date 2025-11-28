import assert from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";
import { Server } from "node:http";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { AppServer } from "../../src/server/server";
import { testAppServerSetup, getTestHost } from "./config";

describe("staticHandler", () => {
    let app: AppServer;
    let server: Server | null = null;
    const publicRoot = resolve(process.cwd(), "test", "handlers", "public");

    beforeEach(() => {
        app = new AppServer({ ...testAppServerSetup(), config: { publicRoot, port: 0 } });
    });

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    it("should serve index.html for /", async () => {
        server = await app.start();
        const host = getTestHost(server);

        const res = await fetch(`${host}`);
        const text = await res.text();
        const expected = await readFile(resolve(publicRoot, "index.html"), "utf8");

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers.get("content-type"), "text/html");
        assert.strictEqual(text.trim(), expected.trim());
    });

    it("should serve index.html for /index.html", async () => {
        server = await app.start();
        const host = getTestHost(server);

        const res = await fetch(`${host}/index.html`);
        const text = await res.text();
        const expected = await readFile(resolve(publicRoot, "index.html"), "utf8");

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers.get("content-type"), "text/html");
        assert.strictEqual(text.trim(), expected.trim());
    });

    it("should serve a static text file", async () => {
        server = await app.start();
        const host = getTestHost(server);

        const res = await fetch(`${host}/test/test.txt`);
        const text = await res.text();
        const expected = await readFile(resolve(publicRoot, "test", "test.txt"), "utf8");

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers.get("content-type"), "text/plain");
        assert.strictEqual(text.trim(), expected.trim());
    });

    it("should return 404 for missing file", async () => {
        server = await app.start();
        const host = getTestHost(server);

        const res = await fetch(`${host}/no-such-file.xyz`);

        assert.strictEqual(res.status, 404);
    });

    it("should prevent path traversal attempts", async () => {
        server = await app.start();
        const host = getTestHost(server);

        const res = await fetch(`${host}/../../package.json`);

        assert.strictEqual(res.status, 404);
    });

    it("should return 403 when accessing existing directory", async () => {
        server = await app.start();
        const host = getTestHost(server);

        const res = await fetch(`${host}/folder`);

        assert.strictEqual(res.status, 403);
    });
});

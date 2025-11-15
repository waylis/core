import assert from "node:assert";
import { Server } from "node:http";
import { afterEach, describe, it } from "node:test";
import { getTestHost, testAppServerSetup } from "./config";
import { defaultConfig, ServerConfig } from "../../src/server/config";
import { AppServer } from "../../src/server/server";
import { DeepPartial } from "../../src/utils/types";

describe("getConfigHandler", () => {
    let app: AppServer;
    let server: Server | null = null;

    afterEach(async () => {
        if (server) {
            await new Promise((resolve) => server!.close(resolve));
            server = null;
        }
    });

    it("should return default config", async () => {
        app = new AppServer(testAppServerSetup);
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/config`);

        const got = await res.json();
        const expected = { app: defaultConfig.app, defaultPageLimit: defaultConfig.defaultPageLimit };

        assert.deepStrictEqual(got, expected);
    });

    it("should return custom config", async () => {
        const expected: DeepPartial<ServerConfig> = {
            app: { name: "Test", description: "Test Description" },
            defaultPageLimit: 5,
        };

        app = new AppServer({ ...testAppServerSetup, config: expected });
        server = await app.start();
        const res = await fetch(`${getTestHost(server)}/api/config`);

        const got = await res.json();

        assert.deepStrictEqual(got, expected);
    });
});

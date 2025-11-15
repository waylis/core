import { Server } from "node:http";
import { AddressInfo } from "node:net";
import { createStep } from "../../src/scene/step";
import { createScene } from "../../src/scene/scene";
import { SimpleLogger } from "../../src/logger/logger";
import { createCommand } from "../../src/scene/command";
import { MemoryDatabase } from "../../src/database/memory/memory";

export const testAppServerSetup = {
    logger: new SimpleLogger({ levels: [] }),
    db: new MemoryDatabase(),
    config: { port: 0 }, // random free port
};

const TEST = "test";

export const getTestHost = (s: Server) => `http://localhost:${(s.address() as AddressInfo).port}`;

export const testCommand = createCommand({ value: TEST, description: TEST, label: TEST });

export const testStep = createStep({
    key: TEST,
    prompt: { type: "text", content: TEST },
    reply: { bodyType: "text" },
});

export const testScene = createScene({
    steps: [],
    handler: async () => ({ type: "text", content: TEST }),
});

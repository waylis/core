import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { Engine } from "../scene/engine";
import { Database } from "../database/database";
import { MemoryDatabase } from "../database/memory/memory";
import { getMessagesHandler } from "./handlers";
import { jsonMessage } from "../utils/http";

export interface ServerConfig {
    port: number;
}

const defaultConfig: ServerConfig = {
    port: 7331,
};

export class HTTPServer {
    private config: ServerConfig;
    protected database: Database;
    protected engine: Engine;

    constructor(params?: { db?: Database; config?: Partial<ServerConfig> }) {
        this.config = { ...defaultConfig, ...params?.config };
        this.database = params?.db ?? new MemoryDatabase();
        this.engine = new Engine(this.database);
    }

    private routes = {
        "GET /api/messages": getMessagesHandler.bind(this),
    };

    private router = (req: IncomingMessage, res: ServerResponse) => {
        const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);
        const key = `${req.method} ${url.pathname}`;
        const route = this.routes?.[key];

        if (!route) {
            jsonMessage(res, { status: 404, msg: "Not found" });
            return;
        }

        route(req, res);
    };

    async start() {
        await this.database.open();
        const server = createServer(this.router);
        const port = this.config.port || 7331;
        server.listen(port, () => {
            console.info("Server is running on http://localhost:" + port);
        });
    }
}

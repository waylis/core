import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { Engine } from "../scene/engine";
import { Database } from "../database/database";
import { MemoryDatabase } from "../database/memory/memory";
import { authHandler, createChatHandler, getChatsHandler, getMessagesHandler } from "./handlers";
import { HTTPError, jsonMessage, parseURL } from "../utils/http";
import { SystemMessageBody } from "../message/types";
import { Command } from "../scene/command";
import { SceneResponsesMap } from "../scene/scene";
import { SceneStep } from "../scene/step";

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

    private handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
        "GET /api/messages": getMessagesHandler.bind(this),
        "GET /api/chats": getChatsHandler.bind(this),

        "POST /api/auth": authHandler.bind(this),
        "POST /api/chat": createChatHandler.bind(this),
    };

    private router = async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const url = parseURL(req);
            const key = `${req.method} ${url.pathname}`;
            const handler = this.handlers?.[key];

            if (!handler) throw new HTTPError(404, "Not found");
            await handler(req, res);
        } catch (error) {
            if (error instanceof HTTPError) {
                jsonMessage(res, { status: error.status, msg: error.message });
                return;
            }

            jsonMessage(res, { status: 500, msg: "Internal Server Error" });
            console.error(error);
        }
    };

    async start() {
        await this.database.open();
        const server = createServer(this.router);
        const port = this.config.port || 7331;
        server.listen(port, () => {
            console.info("Server is running on http://localhost:" + port);
        });
    }

    addScene<Steps extends readonly SceneStep<any, any>[]>(
        command: Command,
        scene: {
            steps: [...Steps];
            handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody>;
        }
    ) {
        return this.engine.addScene(command, scene);
    }
}

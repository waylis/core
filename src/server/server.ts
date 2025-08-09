import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { Engine } from "../scene/engine";
import { Database } from "../database/database";
import {
    authHandler,
    createChatHandler,
    getChatsHandler,
    getFileHandler,
    getMessagesHandler,
    uploadFileHandler,
} from "./handlers";
import { HTTPError, jsonMessage, parseURL } from "../utils/http";
import { SystemMessageBody } from "../message/types";
import { Command } from "../scene/command";
import { SceneResponsesMap } from "../scene/scene";
import { SceneStep } from "../scene/step";
import { FileStorage } from "../file/file";
import { DiskFileStorage } from "../file/storage/disk";
import { JSONDatabase } from "../database/json/json";

export interface ServerConfig {
    port: number;
}

const defaultConfig: ServerConfig = {
    port: 7331,
};

export class HTTPServer {
    private config: ServerConfig;
    protected database: Database;
    protected fileStorage: FileStorage;
    protected engine: Engine;

    constructor(params?: { db?: Database; fs?: FileStorage; config?: Partial<ServerConfig> }) {
        this.config = { ...defaultConfig, ...params?.config };
        this.database = params?.db ?? new JSONDatabase();
        this.fileStorage = params?.fs ?? new DiskFileStorage();
        this.engine = new Engine(this.database);
    }

    private handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
        "GET /api/chats": getChatsHandler.bind(this),
        "GET /api/messages": getMessagesHandler.bind(this),
        "GET /api/file": getFileHandler.bind(this),
        // "GET /api/events": eventsHandler.bind(this),

        "POST /api/auth": authHandler.bind(this),
        "POST /api/chat": createChatHandler.bind(this),
        // "POST /api/message": sendMessageHandler.bind(this),
        "POST /api/file": uploadFileHandler.bind(this),
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

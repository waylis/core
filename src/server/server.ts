import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { SceneEngine } from "../scene/engine";
import { Database } from "../database/database";
import {
    authHandler,
    createChatHandler,
    getChatsHandler,
    getFileHandler,
    getMessagesHandler,
    sendMessageHandler,
    uploadFileHandler,
} from "./handlers";
import { SystemMessageBody } from "../message/types";
import { Command } from "../scene/command";
import { SceneResponsesMap } from "../scene/scene";
import { SceneStep } from "../scene/step";
import { FileStorage } from "../file/file";
import { DiskFileStorage } from "../file/storage/disk";
import { JSONDatabase } from "../database/json/json";
import { EventBus, eventBus } from "../events/bus";
import { parseURL, HTTPError, jsonMessage } from "./helpers";
import { EventsHandler, SSEMessage } from "./sse";
import { Message } from "../message/message";

export interface ServerConfig {
    port: number;
}

const defaultConfig: ServerConfig = {
    port: 7331,
};

export class HTTPServer {
    private config: ServerConfig;
    protected eventBus: EventBus;
    protected database: Database;
    protected fileStorage: FileStorage;
    protected engine: SceneEngine;
    protected connections: Map<string, ServerResponse> = new Map();

    constructor(params?: { db?: Database; fileStorage?: FileStorage; config?: Partial<ServerConfig> }) {
        this.config = { ...defaultConfig, ...params?.config };
        this.database = params?.db ?? new JSONDatabase();
        this.fileStorage = params?.fileStorage ?? new DiskFileStorage();
        this.eventBus = eventBus;
        this.engine = new SceneEngine(this.database, this.eventBus);
    }

    private handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
        "GET /api/chats": getChatsHandler.bind(this),
        "GET /api/messages": getMessagesHandler.bind(this),
        "GET /api/file": getFileHandler.bind(this),
        "GET /api/events": EventsHandler.bind(this),

        "POST /api/auth": authHandler.bind(this),
        "POST /api/chat": createChatHandler.bind(this),
        "POST /api/message": sendMessageHandler.bind(this),
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
            this.serveConnections();
        });
    }

    private serveConnections() {
        const newSystemMessageHandler = async (payload: { userID: string; msg: Message }) => {
            const conn = this.connections.get(payload.userID);
            if (conn) conn.write(SSEMessage("new_message", JSON.stringify(payload.msg)));
        };

        const heartbeatHandler = setInterval(() => {
            for (const [_, conn] of this.connections) {
                conn.write(SSEMessage("heartbeat", "\n"));
            }
        }, 5000);

        this.eventBus.on("newSystemMessage", newSystemMessageHandler);

        return () => {
            this.eventBus.off("newSystemMessage", newSystemMessageHandler);
            clearInterval(heartbeatHandler);
        };
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

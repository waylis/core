import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { SceneEngine } from "../scene/engine";
import { Database } from "../database/database";
import {
    createChatHandler,
    deleteChatHandler,
    EventsHandler,
    getAppInfoHandler,
    getChatsHandler,
    getCommandsHandler,
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
import { parseURL, HTTPError, jsonMessage, SSEMessage } from "./helpers";
import { Message } from "../message/message";
import { ServerConfig, defaultConfig } from "./config";
import { AppLogger, Logger } from "../logger/logger";

export interface AppServerParams {
    db?: Database;
    fileStorage?: FileStorage;
    config?: Partial<ServerConfig>;
    logger?: Logger;
}

export class AppServer {
    protected config: ServerConfig = defaultConfig;
    protected database: Database;
    protected fileStorage: FileStorage;
    protected logger: Logger;

    protected engine: SceneEngine;
    protected eventBus: EventBus;
    protected connections: Map<string, ServerResponse> = new Map();

    constructor(params?: AppServerParams) {
        this.config = { ...this.config, ...params?.config };
        this.database = params?.db ?? new JSONDatabase();
        this.fileStorage = params?.fileStorage ?? new DiskFileStorage();
        this.eventBus = eventBus;
        this.engine = new SceneEngine(this.database, this.eventBus);
        this.logger = params?.logger ?? new AppLogger({ writeToFile: true });
    }

    private handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
        "GET /api/info": getAppInfoHandler.bind(this),
        "GET /api/commands": getCommandsHandler.bind(this),
        "GET /api/events": EventsHandler.bind(this),
        "GET /api/chats": getChatsHandler.bind(this),
        "GET /api/messages": getMessagesHandler.bind(this),
        "GET /api/file": getFileHandler.bind(this),

        "POST /api/auth": this.config.authHandler,
        "POST /api/chat": createChatHandler.bind(this),
        "POST /api/message": sendMessageHandler.bind(this),
        "POST /api/file": uploadFileHandler.bind(this),

        "DELETE /api/chat": deleteChatHandler.bind(this),
    };

    private router = async (req: IncomingMessage, res: ServerResponse) => {
        const url = parseURL(req);
        const key = `${req.method} ${url.pathname}`;

        try {
            const handler = this.handlers[key];
            if (!handler) throw new HTTPError(404, "Not found");
            await handler(req, res);
        } catch (error) {
            if (!(error instanceof HTTPError)) {
                jsonMessage(res, { status: 500, message: "Internal Server Error" });
                this.logger.error("Uncaught server error:", `${req.method} ${url}`, error);
                return;
            }

            jsonMessage(res, { status: error.status, message: error.message });
        }
    };

    private serveConnections() {
        const newSystemMessageHandler = async (payload: { userID: string; msg: Message }) => {
            const conn = this.connections.get(payload.userID);
            if (conn) conn.write(SSEMessage("new_message", JSON.stringify(payload.msg)));
        };

        const heartbeatHandler = setInterval(() => {
            for (const [_, conn] of this.connections) conn.write(SSEMessage("heartbeat", "\n"));
        }, this.config.sseHeartbeatInterval);

        this.eventBus.on("newSystemMessage", newSystemMessageHandler);
        return () => {
            this.eventBus.off("newSystemMessage", newSystemMessageHandler);
            clearInterval(heartbeatHandler);
        };
    }

    protected async checkFileByID(id: string) {
        const filemeta = await this.database.getFileByID(id);
        if (!filemeta) throw new HTTPError(404, "File not found");
        return filemeta;
    }

    async start() {
        await this.database.open();
        this.engine.listenMessages();
        const server = createServer(this.router);
        const port = this.config.port || 7331;

        server.listen(port, () => {
            this.logger.info("Server is running on http://localhost:" + port);
            this.serveConnections();
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

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { SceneEngine } from "../scene/engine";
import { Database } from "../database/database";
import {
    createChatHandler,
    deleteChatHandler,
    eventsHandler,
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
import { FileManager, FileStorage } from "../file/file";
import { DiskFileStorage } from "../file/storage/disk";
import { JSONDatabase } from "../database/json/json";
import { EventBus, eventBus } from "../events/bus";
import { parseURL, HTTPError, jsonMessage, SSEMessage } from "./helpers";
import { Message } from "../message/message";
import { ServerConfig, defaultConfig } from "./config";
import { AppLogger, Logger } from "../logger/logger";
import { cleanupFiles, cleanupMessages } from "./tasks";
import { FileManagerClass } from "../file/manager";

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
    protected fileManager: FileManager;
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
        this.fileManager = new FileManagerClass(this.fileStorage, this.database, this.logger);
    }

    private handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
        "GET /api/info": getAppInfoHandler.bind(this),
        "GET /api/commands": getCommandsHandler.bind(this),
        "GET /api/events": eventsHandler.bind(this),
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
        const handleNewSystemMessages = async (payload: { userID: string; msg: Message }) => {
            const conn = this.connections.get(payload.userID);
            if (conn) conn.write(SSEMessage("newSystemMessage", JSON.stringify(payload.msg)));
        };

        const handleHeartbeat = setInterval(() => {
            for (const [_, conn] of this.connections) conn.write(SSEMessage("heartbeat", "\n"));
        }, this.config.sseHeartbeatInterval);

        this.eventBus.on("newSystemMessage", handleNewSystemMessages);

        return () => {
            this.eventBus.off("newSystemMessage", handleNewSystemMessages);
            clearInterval(handleHeartbeat);
        };
    }

    private serveTasks() {
        const cleanupMessagesID = setInterval(() => {
            cleanupMessages.bind(this)();
        }, this.config.cleanupInterval * 1000);

        const cleanupFilesID = setInterval(() => {
            cleanupFiles.bind(this)();
        }, this.config.cleanupInterval * 1000);

        return () => {
            clearInterval(cleanupMessagesID);
            clearInterval(cleanupFilesID);
        };
    }

    async start() {
        if (!this.database.isOpen) await this.database.open();
        if (!this.fileStorage.isOpen) await this.fileStorage.open();

        this.engine.listenMessages();
        const server = createServer(this.router);
        const port = this.config.port;
        const stopEvents = this.serveConnections();
        const stopTasks = this.serveTasks();

        server.listen(port, () => {
            this.logger.info("Server is running on http://localhost:" + port);
        });

        server.on("close", async () => {
            stopEvents();
            stopTasks();
            await this.database.close();
            await this.fileStorage.close();
            this.logger.info("Server is closed");
        });

        server.on("error", (err) => {
            this.logger.error("Server is dropped by error", err);
        });

        return server.close;
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

    async getFileManager(): Promise<FileManager> {
        if (!this.database.isOpen) await this.database.open();
        if (!this.fileStorage.isOpen) await this.fileStorage.open();

        return this.fileManager;
    }
}

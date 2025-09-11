import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { SceneEngine } from "../scene/engine";
import { Database } from "../database/database";
import {
    createChatHandler,
    deleteChatHandler,
    editChatHandler,
    eventsHandler,
    getAppInfoHandler,
    getChatsHandler,
    getCommandsHandler,
    getFileHandler,
    getMessagesHandler,
    sendMessageHandler,
    staticHandler,
    uploadFileHandler,
} from "./handlers";
import { SystemMessageBody } from "../message/types";
import { Command } from "../scene/command";
import { SceneResponsesMap } from "../scene/scene";
import { SceneStep, StepManager } from "../scene/step";
import { FileManager, FileStorage } from "../file/file";
import { DiskFileStorage } from "../file/storage/disk";
import { JSONDatabase } from "../database/json/json";
import { EventBus, eventBus } from "../events/bus";
import { parseURL, HTTPError, jsonMessage, SSEMessage } from "./helpers";
import { Message, MessageManager } from "../message/message";
import { ServerConfig, defaultConfig } from "./config";
import { DefaultLogger, Logger } from "../logger/logger";
import { cleanupFiles, cleanupMessages } from "./tasks";
import { FileManagerClass } from "../file/manager";
import { ChatManager } from "../chat/chat";

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
    protected chatManager: ChatManager;
    protected messageManager: MessageManager;
    protected stepManager: StepManager;
    protected logger: Logger;

    protected engine: SceneEngine;
    protected eventBus: EventBus;
    protected connections: Map<string, ServerResponse> = new Map();

    constructor(params?: AppServerParams) {
        this.config = { ...this.config, ...params?.config };
        this.logger = params?.logger ?? new DefaultLogger();
        this.eventBus = eventBus;

        this.database = params?.db ?? new JSONDatabase();
        this.fileStorage = params?.fileStorage ?? new DiskFileStorage();

        this.fileManager = new FileManagerClass(this.fileStorage, this.database, this.config.idGenerator, this.logger);
        this.chatManager = new ChatManager(this.config.idGenerator);
        this.messageManager = new MessageManager(this.config.idGenerator);
        this.stepManager = new StepManager(this.config.idGenerator);

        this.engine = new SceneEngine(this.database, this.eventBus, this.messageManager, this.stepManager);
    }

    private handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
        "GET /api/info": getAppInfoHandler.bind(this),
        "GET /api/commands": getCommandsHandler.bind(this),
        "GET /api/events": eventsHandler.bind(this),
        "GET /api/chats": getChatsHandler.bind(this),
        "GET /api/messages": getMessagesHandler.bind(this),
        "GET /api/file": getFileHandler.bind(this),

        "POST /api/auth": this.config.auth.handler,
        "POST /api/logout": this.config.auth.handler,
        "POST /api/chat": createChatHandler.bind(this),
        "POST /api/message": sendMessageHandler.bind(this),
        "POST /api/file": uploadFileHandler.bind(this),

        "PUT /api/chat": editChatHandler.bind(this),

        "DELETE /api/chat": deleteChatHandler.bind(this),
    };

    private router = async (req: IncomingMessage, res: ServerResponse) => {
        const url = parseURL(req);
        const key = `${req.method} ${url.pathname}`;

        try {
            let handler = this.handlers[key];
            if (!handler) {
                if (req.method !== "GET") throw new HTTPError(404, "Not found");
                handler = staticHandler;
            }

            this.logger.debug(req.method, url.href);

            await handler(req, res);
        } catch (error) {
            if (!(error instanceof HTTPError)) {
                jsonMessage(res, { status: 500, message: "Internal Server Error" });
                this.logger.error("Internal error:", `${req.method} ${url}`, error);
                return;
            }

            jsonMessage(res, { status: error.status, message: error.message });
        }
    };

    private serveConnections() {
        const handleNewSystemResponse = async (payload: { userID: string; response: Message | Message[] }) => {
            const conn = this.connections.get(payload.userID);
            if (!conn) return;

            const messages = Array.isArray(payload.response) ? payload.response : [payload.response];
            const json = JSON.stringify(messages);

            conn.write(SSEMessage("newSystemResponse", json));
            this.logger.debug("New system response:", json);
        };

        const handleHeartbeat = setInterval(() => {
            for (const [_, conn] of this.connections) conn.write(SSEMessage("heartbeat", "\n"));
        }, this.config.sse.heartbeatInterval * 1000);

        this.eventBus.on("newSystemResponse", handleNewSystemResponse);

        return () => {
            this.eventBus.off("newSystemResponse", handleNewSystemResponse);
            clearInterval(handleHeartbeat);
        };
    }

    private serveTasks() {
        const cleanupID = setInterval(() => {
            cleanupMessages.bind(this)();
            cleanupFiles.bind(this)();

            this.logger.debug("Cleanup cycle has been completed");
        }, this.config.cleanup.interval * 1000);

        return () => {
            clearInterval(cleanupID);
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
            handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody | SystemMessageBody[]>;
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

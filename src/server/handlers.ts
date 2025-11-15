import { IncomingMessage, ServerResponse } from "node:http";
import { basename, join, normalize, resolve } from "node:path";
import { realpath, stat, readFile } from "node:fs/promises";
import { Transform } from "node:stream";
import { HTTPError, jsonData, jsonMessage, parseJSONBody, parseURL, sseMessage } from "./helpers";
import { AppServer } from "./server";
import { defineFileExtension } from "../utils/mime";
import { randomUUID } from "../utils/random";
import { Message } from "../message/message";
import { defineMimeType } from "./../utils/mime";
import { getDirname } from "../utils/fs";

const PUBLIC_ROOT = resolve(getDirname(), "public");

export async function staticHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    try {
        const url = parseURL(req);
        const root = this.config.publicRoot ?? PUBLIC_ROOT;

        let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
        filePath = normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, ""); // sanitize
        filePath = join(root, filePath);

        let staticPath = await realpath(filePath);
        if (!staticPath.startsWith(root)) throw new HTTPError(403, "Forbidden");

        let stats = await stat(staticPath);
        if (stats.isDirectory()) throw new HTTPError(403, "Forbidden");

        const contentType = defineMimeType(filePath) || "text/plain";
        const content = await readFile(staticPath);

        res.writeHead(200, {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
        });
        res.end(content);
    } catch (err) {
        if (err instanceof Error && "code" in err && err.code === "ENOENT") {
            throw new HTTPError(404, "Not found");
        }
        throw err;
    }
}

export async function getConfigHandler(this: AppServer, _req: IncomingMessage, res: ServerResponse) {
    jsonData(res, {
        app: this.config.app,
        defaultPageLimit: this.config.defaultPageLimit,
    });
}

export async function getCommandsHandler(this: AppServer, _req: IncomingMessage, res: ServerResponse) {
    const commands = [...this.engine.commands.values()];
    jsonData(res, commands);
}

export async function getMessagesHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.auth.middleware(req);
    const url = parseURL(req);
    const chatID = url.searchParams.get("chat_id");
    if (!chatID) throw new HTTPError(400, "chat_id query parameter is required");

    const chat = await this.database.getChatByID(chatID);
    if (!chat) throw new HTTPError(404, "Chat not found");
    if (chat.creatorID !== userID) throw new HTTPError(403, "Forbidden");

    const offset = Number(url.searchParams.get("offset")) ?? 0;
    const limit = Number(url.searchParams.get("limit")) || this.config.defaultPageLimit;
    const messages = await this.database.getMessagesByChatID(chatID, offset, limit);

    jsonData(res, messages);
}

export async function getChatsHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.auth.middleware(req);
    const url = parseURL(req);
    const offset = Number(url.searchParams.get("offset")) ?? 0;
    const limit = Number(url.searchParams.get("limit")) || this.config.defaultPageLimit;

    const chats = await this.database.getChatsByCreatorID(userID, offset, limit);
    jsonData(res, chats);
}

export async function createChatHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.auth.middleware(req);
    const body = await parseJSONBody<{ name?: string }>(req);
    const chatName = body?.name ?? this.config.chatNameGenerator();

    const count = await this.database.countChatsByCreatorID(userID);
    if (count >= this.config.limits.maxChatsPerUser) {
        throw new HTTPError(400, "Too many chats.");
    }

    const chat = this.chatManager.createChat(chatName, userID);
    await this.database.addChat(chat);

    this.logger.debug("Chat created:", JSON.stringify(chat));
    jsonData(res, chat, 201);
}

export async function sendMessageHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    try {
        const senderID = await this.config.auth.middleware(req);
        const body = await parseJSONBody(req);

        let msgParams = this.messageManager.validateUserMessageParams(body, senderID);
        let replyMsg: Message | undefined;

        const chat = await this.database.getChatByID(msgParams.chatID);
        if (!chat) throw new HTTPError(404, "Chat not found");

        if (msgParams.replyTo) {
            const candidate = await this.database.getMessageByID(msgParams.replyTo);
            if (!candidate) throw new HTTPError(404, "No reply message found");
            replyMsg = candidate;
        }

        const fileNotFoundErr = new HTTPError(404, "File not found");
        if (msgParams.body.type === "file") {
            const filemeta = await this.fileManager.getFileMeta(msgParams.body.content.id);
            if (!filemeta) throw fileNotFoundErr;
            msgParams.body.content = filemeta;
        }
        if (msgParams.body.type === "files") {
            msgParams.body.content = await Promise.all(
                msgParams.body.content.map(async (file) => {
                    const filemeta = await this.fileManager.getFileMeta(file.id);
                    if (!filemeta) throw fileNotFoundErr;
                    return { ...file, ...filemeta };
                })
            );
        }

        let msg = this.messageManager.createUserMessage({ ...msgParams, senderID }, replyMsg);
        this.eventBus.emit("newUserMessage", msg);
        this.logger.debug("New user message:", JSON.stringify(msg));

        jsonData(res, msg, 201);
    } catch (error) {
        if (error instanceof HTTPError) throw error;
        const textErr = error instanceof Error ? error.message : "Bad request";
        throw new HTTPError(400, textErr);
    }
}

export async function getFileHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    await this.config.auth.middleware(req);
    const url = parseURL(req);
    const fileID = url.searchParams.get("id");
    if (!fileID) throw new HTTPError(400, "id query parameter is required");

    const filemeta = await this.database.getFileByID(fileID);
    if (!filemeta) throw new HTTPError(404, "File not found");

    try {
        const stream = await this.fileStorage.download(filemeta);
        res.writeHead(200, {
            "Content-Type": filemeta.mimeType,
            "Content-Disposition": `attachment; filename="${filemeta.name}"`,
        });

        stream.pipe(res);
    } catch (error) {
        throw new HTTPError(500, "Unable to retrieve file from storage.");
    }
}

export async function uploadFileHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    await this.config.auth.middleware(req);

    const url = parseURL(req);
    const replyTo = url.searchParams.get("reply_to");
    if (!replyTo) throw new HTTPError(400, "reply_to query parameter is required");

    const systemMsg = await this.database.getMessageByID(replyTo);
    if (!systemMsg) throw new HTTPError(404, "Invalid replyTo: message not found");

    const contentType = req.headers["content-type"];
    if (!contentType) throw new HTTPError(400, "Content-Type header required");

    let filename = req.headers["x-filename"]?.toString();
    const fileExtension = defineFileExtension(contentType);

    if (!fileExtension && !filename) throw new HTTPError(400, "Couldn't define file extension");
    if (filename) filename = basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_"); // sanitizing
    if (!filename) filename = `file.${fileExtension}`;

    const declaredBytes = Number(req.headers["content-length"] || 0);
    let actualBytes = 0;

    const counterStream = new Transform({
        transform(chunk: Buffer, _, callback) {
            actualBytes += chunk.length;
            this.push(chunk);
            callback();
        },
    });
    const fileStream = req.pipe(counterStream);
    const filemeta = this.fileManager.generateFileMeta({ name: filename, size: declaredBytes, mimeType: contentType });
    const ok = await this.fileStorage.upload(fileStream, filemeta);

    if (!ok) throw new HTTPError(500, "File upload failed");
    await this.database.addFile({ ...filemeta, size: actualBytes });

    this.logger.debug("File uploaded:", JSON.stringify(filemeta));

    jsonData(res, filemeta);
}

export async function editChatHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.auth.middleware(req);
    const url = parseURL(req);
    const chatID = url.searchParams.get("id");
    if (!chatID) throw new HTTPError(400, "id query parameter is required");

    const chat = await this.database.getChatByID(chatID);
    if (!chat) throw new HTTPError(404, "Chat not found");
    if (chat.creatorID !== userID) throw new HTTPError(403, "Forbidden");

    const body = await parseJSONBody<{ name?: string }>(req);
    const newName = body?.name ?? chat.name;
    const updated = await this.database.editChatByID(chatID, { name: newName });

    this.logger.debug("Chat edited:", JSON.stringify(updated));

    jsonData(res, updated);
}

export async function deleteChatHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.auth.middleware(req);
    const url = parseURL(req);
    const chatID = url.searchParams.get("id");
    if (!chatID) throw new HTTPError(400, "id query parameter is required");

    const chat = await this.database.getChatByID(chatID);
    if (!chat) throw new HTTPError(404, "Chat not found");
    if (chat.creatorID !== userID) throw new HTTPError(403, "Forbidden");

    await this.database.deleteChatByID(chatID);
    await this.database.deleteMessagesByChatID(chatID);

    this.logger.debug("Chat deleted:", JSON.stringify(chat));

    jsonData(res, chat);
}

export async function eventsHandler(this: AppServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.auth.middleware(req);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    res.write(sseMessage("connection", "OK"));
    this.connections.set(userID, res);
    this.logger.debug("Connection opened:", userID);

    req.on("close", () => {
        this.connections.delete(userID);
        this.logger.debug("Connection closed:", userID);
    });

    return;
}

export async function simpleAuthHandler(req: IncomingMessage, res: ServerResponse) {
    const url = parseURL(req);
    const customID = url.searchParams.get("id");
    const userID = customID || randomUUID();
    res.setHeader("Set-Cookie", `user_id=${userID}; HttpOnly; SameSite=Strict; Path=/`);
    jsonMessage(res, { message: "OK" });
}

export async function simpleLogoutHandler(_req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Set-Cookie", `user_id=; HttpOnly; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    return jsonMessage(res, { message: "OK" });
}

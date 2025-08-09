import { IncomingMessage, ServerResponse } from "node:http";
import { Transform } from "node:stream";
import { basename } from "node:path";
import { HTTPServer } from "./server";
import { createChat } from "../chat/chat";
import { createFileMeta } from "../file/file";
import { randomUUID } from "../utils/random";
import { defineFileExtension } from "../utils/mime";
import { HTTPError, jsonData, jsonMessage, parseCookies, parseJSONBody, parseURL } from "../utils/http";

export async function getMessagesHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const url = parseURL(req);
    const userID = getUserID(req);
    const chatID = url.searchParams.get("chat_id");
    if (!chatID) throw new HTTPError(400, "chat_id query parameter is required");

    const chat = await this.database.getChatByID(chatID);
    if (!chat) throw new HTTPError(404, "Chat not found");
    if (chat.creatorID !== userID) throw new HTTPError(403, "Forbidden");

    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    const messages = await this.database.getMessagesByChatID(chatID, page, limit);

    jsonData(res, messages);
}

export async function getChatsHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const userID = getUserID(req);
    const chats = await this.database.getChatsByCreatorID(userID);
    jsonData(res, chats);
}

export async function createChatHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const userID = getUserID(req);
    const body = await parseJSONBody<{ name?: string }>(req);
    const chatName = body?.name ?? "";

    const chat = createChat(chatName, userID);
    await this.database.addChat(chat);
    jsonData(res, chat, 201);
}

export async function getFileHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    getUserID(req);
    const url = parseURL(req);
    const fileID = url.searchParams.get("id");
    if (!fileID) throw new HTTPError(400, "id query parameter is required");

    const filemeta = await this.database.getFileByID(fileID);
    if (!filemeta) throw new HTTPError(404, "File not found");

    const stream = await this.fileStorage.download(filemeta);
    res.writeHead(200, {
        "Content-Type": filemeta.mimeType,
        "Content-Disposition": `attachment; filename="${filemeta.name}"`,
    });

    stream.pipe(res);
}

export async function uploadFileHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    getUserID(req);
    const contentType = req.headers["content-type"];
    if (!contentType) throw new HTTPError(400, "Content-Type header required");

    let filename = req.headers["x-filename"]?.toString();
    const fileExtension = defineFileExtension(contentType);

    if (!fileExtension && !filename) throw new HTTPError(400, "Couldn't define file extension");
    if (filename) filename = basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
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

    const filemeta = createFileMeta({ name: filename, size: declaredBytes, mimeType: contentType });
    const ok = await this.fileStorage.upload(fileStream, filemeta);
    if (!ok) throw new HTTPError(500, "File upload failed");
    await this.database.addFile({ ...filemeta, size: actualBytes });

    jsonData(res, filemeta);
}

export async function authHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const userID = randomUUID();
    res.setHeader("Set-Cookie", `user_id=${userID}; HttpOnly; SameSite=Strict; Path=/`);
    jsonMessage(res, { msg: "OK" });
}

function getUserID(req: IncomingMessage) {
    const cookies = parseCookies(req.headers.cookie ?? "");
    const userID = cookies.user_id ?? "";

    if (!userID) throw new HTTPError(401, "Unauthorized");
    return userID;
}

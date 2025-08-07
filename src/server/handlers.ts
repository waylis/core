import { IncomingMessage, ServerResponse } from "node:http";
import { HTTPError, jsonData, jsonMessage, parseCookies, parseJSONBody, parseURL } from "../utils/http";
import { HTTPServer } from "./server";
import { randomUUID } from "node:crypto";
import { createChat } from "../chat/chat";

export async function getMessagesHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const url = parseURL(req);
    const chatID = url.searchParams.get("chat_id");
    if (!chatID) throw new HTTPError(400, "chat_id query parameter is required");

    const page = Number(url.searchParams.get("page")) ?? 1;
    const limit = Number(url.searchParams.get("limit")) ?? 20;
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

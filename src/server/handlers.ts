import { IncomingMessage, ServerResponse } from "node:http";
import { jsonData, jsonMessage } from "../utils/http";
import { HTTPServer } from "./server";

export async function getMessagesHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const url = new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);
    const chatID = url.searchParams.get("chat_id");

    if (!chatID) {
        jsonMessage(res, { status: 400, msg: "chat_id query parameter is required" });
        return;
    }

    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 20;
    const messages = await this.database.getMessagesByChatID(chatID, page, limit);

    jsonData(res, messages);
}

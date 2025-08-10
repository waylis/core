import { IncomingMessage, ServerResponse } from "http";
import { HTTPServer } from "./server";

export async function EventsHandler(this: HTTPServer, req: IncomingMessage, res: ServerResponse) {
    const userID = await this.config.authMiddleware(req);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    res.write(SSEMessage("connection", "OK"));
    this.connections.set(userID, res);

    req.on("close", () => {
        this.connections.delete(userID);
    });

    return;
}

export const SSEMessage = (event: string, data: string) => {
    const payload = `event: ${event}\ndata: ${data}\n\n`;
    return payload;
};

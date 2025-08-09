import { IncomingMessage, ServerResponse } from "http";

export const jsonData = (res: ServerResponse, data: unknown, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
};

export const jsonMessage = (res: ServerResponse, options: { status?: number; msg?: string }) => {
    jsonData(res, { message: options.msg ?? "" }, options.status);
};

export const parseURL = (req: IncomingMessage) => {
    return new URL(`http://${process.env.HOST ?? "localhost"}${req.url}`);
};

export const parseCookies = (cookieHeader: string) => {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;
    const cookiePairs = cookieHeader.split(";");
    for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split("=");
        cookies[key] = decodeURIComponent(value);
    }
    return cookies;
};

export const parseJSONBody = <T>(req: IncomingMessage): Promise<T> => {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const json = JSON.parse(body);
                resolve(json);
            } catch (err) {
                reject(new HTTPError(400, "Invalid JSON body"));
            }
        });

        req.on("error", (err) => {
            reject(err);
        });
    });
};

export class HTTPError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export function getUserID(req: IncomingMessage) {
    const cookies = parseCookies(req.headers.cookie ?? "");
    const userID = cookies.user_id ?? "";

    if (!userID) throw new HTTPError(401, "Unauthorized");
    return userID;
}

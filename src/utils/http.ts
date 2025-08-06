import { ServerResponse } from "node:http";

export const jsonData = (res: ServerResponse, data: unknown, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
};

export const jsonMessage = (res: ServerResponse, options: { status?: number; msg?: string }) => {
    jsonData(res, { message: options.msg ?? "" }, options.status);
};

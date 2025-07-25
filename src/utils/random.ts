import crypto from "node:crypto";

export const randomUUID = () => crypto.randomUUID();

export const randomString = (length = 10) => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};

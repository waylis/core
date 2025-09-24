import crypto from "node:crypto";

export const randomUUID = () => crypto.randomUUID();

export const randomString = (length = 10) => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};

const BASE36_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export function randomStringBase36(length: number): string {
    const bytes = crypto.randomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        const val = bytes[i] % 36;
        result += BASE36_ALPHABET[val];
    }
    return result;
}

export const createSortableIdGenerator = () => {
    let counter = 0;
    let latestTime = 0;

    return function () {
        const currentTime = Date.now();
        if (currentTime === latestTime) {
            counter++;
        } else {
            counter = 0;
            latestTime = currentTime;
        }

        const timePart = currentTime.toString(36).padStart(9, "0").slice(-9);
        const counterPart = counter.toString(36).padStart(3, "0").slice(-3);
        const randomPart = randomStringBase36(6);

        return `${timePart}${counterPart}${randomPart}`;
    };
};

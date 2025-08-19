export const isValidDate = (value: string) => {
    if (typeof value !== "string") return false;

    const parsedTimestamp = Date.parse(value);
    if (isNaN(parsedTimestamp)) return false;
    return true;
};

export function jsonDateReviver(_key: unknown, value: unknown) {
    if (typeof value === "string") {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) return date;
        }
    }
    return value;
}

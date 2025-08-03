export const isValidDate = (value: string) => {
    if (typeof value !== "string") return false;

    const parsedTimestamp = Date.parse(value);
    if (isNaN(parsedTimestamp)) return false;
};

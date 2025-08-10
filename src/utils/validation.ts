export const isPlainObject = (obj: any) => {
    return typeof obj === "object" && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
};

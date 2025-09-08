import { dirname } from "path";
import { fileURLToPath } from "url";

export const getDirname = () => {
    try {
        // CJS
        if (typeof __dirname !== "undefined") {
            return __dirname;
        }
    } catch {}

    // ESM
    const url = import.meta.url;
    return dirname(fileURLToPath(url));
};

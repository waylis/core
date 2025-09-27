import { DeepPartial } from "./types";

export const mergeDeep = <T>(target: T, source?: DeepPartial<T>): T => {
    const output = { ...target };

    if (!source) return output;

    for (const key in source) {
        const sourceVal = source[key];
        const targetVal = target[key];

        if (typeof sourceVal === "object" && sourceVal !== null && !Array.isArray(sourceVal)) {
            output[key] = mergeDeep(targetVal, sourceVal);
        } else if (sourceVal !== undefined) {
            output[key] = sourceVal as any;
        }
    }

    return output;
};

export const isFloat = (n: number) => {
    return Number(n) === n && n % 1 !== 0;
};

export const bytesToMB = (bytes: number) => {
    return +(bytes / (1024 * 1024)).toFixed(2);
};

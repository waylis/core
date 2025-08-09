import mime from "mime";

export const defineMimeType = (str: string) => {
    return mime.getType(str);
};

export const defineFileExtension = (contentType: string) => {
    return mime.getExtension(contentType);
};

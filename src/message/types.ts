import { FileData } from "../file/file";

export interface Option {
    value: string;
    label?: string;
}

export interface TextLimits {
    minLength?: number;
    maxLength?: number;
}

export interface NumberLimits {
    min?: number;
    max?: number;
    integerOnly?: boolean;
}

export interface FileLimits {
    mimeTypes?: string[];
    maxSize?: number;
}

export type FilesLimits = FileLimits & { maxAmount?: number };

export interface OptionLimits {
    options: Option[];
}

export interface OptionsLimits {
    options: Option[];
    maxAmount?: number;
}

export interface DatetimeLimits {
    min?: Date;
    max?: Date;
}

export type MessageBodyMap = {
    command: string;
    text: string;
    number: number;
    boolean: boolean;
    file: FileData;
    files: FileData[];
    option: Option;
    options: Option[];
    datetime: Date;
    markdown: string;
};

export type MessageBodyType = keyof MessageBodyMap;

export type MessageBody = {
    [K in keyof MessageBodyMap]: { type: K; content: MessageBodyMap[K] };
}[keyof MessageBodyMap];

export type SystemMessageBody = Extract<
    MessageBody,
    { type: "text" } | { type: "markdown" } | { type: "file" } | { type: "files" }
>;

export type UserMessageBody = Exclude<MessageBody, { type: "markdown" }>;

export type UserMessageBodyType = Exclude<MessageBodyType, "command" | "markdown">;

type LimitsMap = {
    text: TextLimits;
    number: NumberLimits;
    file: FileLimits;
    files: FilesLimits;
    option: OptionLimits;
    options: OptionsLimits;
    datetime: DatetimeLimits;
};

export type ReplyRestriction<T extends UserMessageBodyType = UserMessageBodyType> = {
    bodyType: T;
    bodyLimits?: T extends keyof LimitsMap ? LimitsMap[T] : never;
};

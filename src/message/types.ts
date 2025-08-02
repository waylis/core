export interface FileData {
    id: string;
    path: string;
    name: string;
    size: number;
    mimeType: string;
}

export interface SelectedValue {
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

export interface SelectedValueLimits {
    options: SelectedValue[];
}

export interface SelectedValuesLimits {
    options: SelectedValue[];
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
    selection: SelectedValue;
    selections: SelectedValue[];
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
    selection: SelectedValueLimits;
    selections: SelectedValuesLimits;
    datetime: DatetimeLimits;
};

export type ReplyRestriction<T extends MessageBodyType = MessageBodyType> = {
    bodyType: T;
    bodyLimits?: T extends keyof LimitsMap ? LimitsMap[T] : never;
};

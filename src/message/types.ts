import { FileMeta } from "../file/file";

export interface Option {
    value: string;
    label?: string;
}

/**
 * More info: https://mantine.dev/charts/line-chart/
 */
export interface LineChart {
    data: Record<string, any>[];
    dataKey: string;
    series: { name: string; color?: string; label?: string; yAxisId?: string }[];
    curveType?: "bump" | "linear" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter";
    height?: number | string;
    xAxisProps?: Record<string, any>;
    yAxisProps?: Record<string, any>;
}

export interface Table {
    head: string[];
    body: (string | number)[][];
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
    file: FileMeta;
    files: FileMeta[];
    option: string;
    options: string[];
    datetime: Date;
    markdown: string;
    linechart: LineChart;
    table: Table;
};

export type MessageBodyType = keyof MessageBodyMap;

export type MessageBody = {
    [K in keyof MessageBodyMap]: { type: K; content: MessageBodyMap[K] };
}[keyof MessageBodyMap];

export type SystemMessageBody = Extract<
    MessageBody,
    | { type: "text" }
    | { type: "markdown" }
    | { type: "file" }
    | { type: "files" }
    | { type: "linechart" }
    | { type: "table" }
>;

export type UserMessageBody = Exclude<MessageBody, { type: "markdown" } | { type: "linechart" } | { type: "table" }>;

export type UserMessageBodyType = Exclude<MessageBodyType, "markdown" | "linechart" | "table">;

export type MessageBodyLimitsMap = {
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
    bodyLimits?: T extends keyof MessageBodyLimitsMap ? MessageBodyLimitsMap[T] : never;
};

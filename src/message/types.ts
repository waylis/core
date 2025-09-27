import { FileMeta } from "../file/file";

/**
 * Selectable option with a value and optional label.
 */
export interface Option {
    value: string;
    label?: string;
}

/**
 * Configuration for rendering a line chart.
 *
 * More info: https://mantine.dev/charts/line-chart/
 */
export interface LineChart {
    /** Data points for the chart. */
    data: Record<string, any>[];
    /** Key in each data object used for the X-axis. */
    dataKey: string;
    /** Series definitions (e.g. lines). */
    series: { name: string; color?: string; label?: string; yAxisId?: string }[];
    /** Curve interpolation type. */
    curveType?: "bump" | "linear" | "natural" | "monotone" | "step" | "stepBefore" | "stepAfter";
    /** Any other parameters. */
    extra?: Record<string, any>;
}

/**
 * Simple tabular data structure.
 */
export interface Table {
    /** Column headers. */
    head: string[];
    /** Table rows (values per column). */
    body: (string | number)[][];
}

/** Limits for text content. */
export interface TextLimits {
    minLength?: number;
    maxLength?: number;
}

/** Limits for numeric input. */
export interface NumberLimits {
    min?: number;
    max?: number;
    integerOnly?: boolean;
}

/** Limits for a single file. */
export interface FileLimits {
    /** Allowed MIME types. */
    mimeTypes?: string[];
    /** Maximum size in bytes. */
    maxSize?: number;
}

/** Limits for multiple files. */
export type FilesLimits = FileLimits & { maxAmount?: number };

/** Limits for selecting a single option. */
export interface OptionLimits {
    options: Option[];
}

/** Limits for selecting multiple options. */
export interface OptionsLimits {
    options: Option[];
    maxAmount?: number;
}

/** Limits for datetime selection. */
export interface DatetimeLimits {
    min?: Date;
    max?: Date;
}

/**
 * Maps each message body type to its corresponding content shape.
 */
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

/** All possible message body types. */
export type MessageBodyType = keyof MessageBodyMap;

/**
 * A message body, discriminated by `type`.
 */
export type MessageBody = {
    [K in keyof MessageBodyMap]: { type: K; content: MessageBodyMap[K] };
}[keyof MessageBodyMap];

/** Message bodies generated only by the system. */
export type SystemMessageBody = Extract<
    MessageBody,
    | { type: "text" }
    | { type: "markdown" }
    | { type: "file" }
    | { type: "files" }
    | { type: "linechart" }
    | { type: "table" }
>;

/** Message bodies created by users. */
export type UserMessageBody = Exclude<MessageBody, { type: "markdown" } | { type: "linechart" } | { type: "table" }>;

/** Types allowed for user-created messages. */
export type UserMessageBodyType = Exclude<MessageBodyType, "markdown" | "linechart" | "table">;

/**
 * Maps message body types to their validation limits.
 */
export type MessageBodyLimitsMap = {
    text: TextLimits;
    number: NumberLimits;
    file: FileLimits;
    files: FilesLimits;
    option: OptionLimits;
    options: OptionsLimits;
    datetime: DatetimeLimits;
};

/**
 * Defines the expected shape and constraints of a reply.
 */
export type ExpectedReply<T extends UserMessageBodyType = UserMessageBodyType> = {
    /** Required body type for the reply. */
    bodyType: T;
    /** Optional limits for that body type. */
    bodyLimits?: T extends keyof MessageBodyLimitsMap ? MessageBodyLimitsMap[T] : never;
};

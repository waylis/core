import path from "node:path";
import fs from "node:fs";

/**
 * Represents the available logging levels.
 */
export type LogLevel = "error" | "warn" | "info" | "debug";

/**
 * A logging interface defining standard log methods.
 */
export interface Logger {
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    debug(...args: unknown[]): void;
}

/**
 * A simple logger implementation with configurable log levels and optional file output.
 */
export class SimpleLogger implements Logger {
    private levels: LogLevel[];
    private logsDir: string;
    private writeToFile: boolean;

    /**
     * Creates a new SimpleLogger instance.
     * @param options Configuration options.
     * @param options.levels Logging levels to enable. Defaults to all levels.
     * @param options.logsDir Directory where log files will be stored. Defaults to `"logs"`.
     * @param options.writeToFile Whether to write logs to files in addition to console. Defaults to `true`.
     */
    constructor({
        levels = ["error", "warn", "info", "debug"],
        logsDir = "logs",
        writeToFile = true,
    }: {
        levels?: LogLevel[];
        logsDir?: string;
        writeToFile?: boolean;
    } = {}) {
        this.levels = levels;
        this.logsDir = logsDir;
        this.writeToFile = writeToFile;

        if (!fs.existsSync(this.logsDir)) fs.mkdirSync(this.logsDir, { recursive: true });
    }

    private shouldLog(level: LogLevel): boolean {
        return this.levels.includes(level);
    }

    private log(level: LogLevel, ...args: unknown[]) {
        if (!this.shouldLog(level)) return;

        const timestamp = new Date().toLocaleString();
        const prefix = `${timestamp} [${level.toUpperCase()}]`;

        console[level](prefix, ...args);
        if (this.writeToFile) logToFile(this.logsDir, prefix, ...args);
    }

    info(...args: unknown[]): void {
        this.log("info", ...args);
    }

    warn(...args: unknown[]): void {
        this.log("warn", ...args);
    }

    error(...args: unknown[]): void {
        this.log("error", ...args);
    }

    debug(...args: unknown[]): void {
        this.log("debug", ...args);
    }
}

const padZero = (value: number) => String(value).padStart(2, "0");

function getLogFilePath(logsDir: string) {
    const now = new Date();
    const mm = padZero(now.getMonth() + 1); // Month (01-12)
    const dd = padZero(now.getDate()); // Day (01-31)
    const filename = `${mm}-${dd}.log`;
    return path.join(logsDir, filename);
}

function logToFile(logsDir: string, prefix: string, ...args: unknown[]) {
    fs.appendFile(getLogFilePath(logsDir), `${prefix} ${args.join(" ")}\n`, (err) => {
        if (err) console.error(err);
    });
}

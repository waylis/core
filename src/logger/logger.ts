import path from "node:path";
import fs from "node:fs";

export interface Logger {
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    debug(...args: unknown[]): void;
}

export class SimpleLogger implements Logger {
    private levels: string[];
    private logsDir: string;
    private writeToFile: boolean;

    constructor({
        levels = ["error", "warn", "info", "debug"],
        logsDir = "logs",
        writeToFile = true,
    }: {
        levels?: string[];
        logsDir?: string;
        writeToFile?: boolean;
    } = {}) {
        this.levels = levels;
        this.logsDir = logsDir;
        this.writeToFile = writeToFile;

        if (!fs.existsSync(this.logsDir)) fs.mkdirSync(this.logsDir, { recursive: true });
    }

    private shouldLog(level: string): boolean {
        return this.levels.includes(level);
    }

    private log(level: string, ...args: unknown[]) {
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

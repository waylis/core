import { join } from "node:path";
import { promises, createWriteStream, createReadStream, existsSync, mkdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { FileStorage, FileMeta } from "../file";

export class DiskFileStorage implements FileStorage {
    isOpen: boolean = false;
    private storagePath: string;

    constructor(storagePath?: string) {
        this.storagePath = storagePath || "files";
        this.ensureDirectoryExists();
    }

    private ensureDirectoryExists(): void {
        if (!existsSync(this.storagePath)) {
            mkdirSync(this.storagePath, { recursive: true });
        }
    }

    private getFilePath(id: string): string {
        return join(this.storagePath, id);
    }

    async open(): Promise<void> {
        this.isOpen = true;
    }

    async close(): Promise<void> {
        this.isOpen = false;
    }

    async upload(bytes: NodeJS.ReadableStream | Buffer, metadata: FileMeta): Promise<boolean> {
        const filePath = this.getFilePath(metadata.id);
        try {
            // Ensure directory exists
            await promises.mkdir(this.storagePath, { recursive: true });

            if (Buffer.isBuffer(bytes)) {
                await promises.writeFile(filePath, bytes);
            } else {
                const writeStream = createWriteStream(filePath);
                await pipeline(bytes, writeStream);
            }

            return true;
        } catch (error) {
            console.error("Upload failed:", error);
            return false;
        }
    }

    async download(metadata: FileMeta): Promise<NodeJS.ReadableStream> {
        const filePath = this.getFilePath(metadata.id);

        try {
            await promises.access(filePath); // Throws if file doesn't exist
            return createReadStream(filePath);
        } catch (error) {
            console.error("Download failed:", error);
            throw new Error("File not found");
        }
    }

    async deleteByID(id: string): Promise<boolean> {
        const filePath = this.getFilePath(id);
        try {
            await promises.rm(filePath);
            return true;
        } catch (error) {
            if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") {
                return false;
            }
            console.error("Delete failed:", error);
            return false;
        }
    }
}

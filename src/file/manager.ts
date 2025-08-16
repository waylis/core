import { Database } from "../database/database";
import { Logger } from "../logger/logger";
import { CreateFileDataParams, createFileMeta, FileManager, FileMeta, FileStorage } from "./file";

export class FileManagerClass implements FileManager {
    constructor(private storage: FileStorage, private db: Database, private logger: Logger) {}

    async getFileMeta(id: string) {
        const filemeta = await this.db.getFileByID(id);
        return filemeta;
    }

    async uploadFile(bytes: NodeJS.ReadableStream | Buffer, meta: CreateFileDataParams): Promise<FileMeta> {
        const filemeta = createFileMeta(meta);
        if (Buffer.isBuffer(bytes)) filemeta.size = bytes.length;

        const ok = await this.storage.upload(bytes, filemeta);
        if (!ok) throw new Error("File upload to storage not succeed");

        try {
            await this.db.addFile(filemeta);
            return filemeta;
        } catch (dbErr) {
            try {
                await this.storage.deleteByID(filemeta.id);
            } catch (delErr) {
                this.logger.warn(`File rollback failed: ${(delErr as Error).message}`);
            }
            throw new Error(`File upload failed: ${(dbErr as Error).message}`);
        }
    }

    async downloadFile(id: string): Promise<NodeJS.ReadableStream> {
        const meta = await this.db.getFileByID(id);
        if (!meta) throw new Error("file not found");
        return this.storage.download(meta);
    }

    async deleteFile(id: string): Promise<FileMeta | null> {
        const deleted = await this.db.deleteFileByID(id);
        if (!deleted) return null;

        const ok = await this.storage.deleteByID(id);
        if (!ok) this.logger.warn("File deletion from storage not succeed", JSON.stringify(deleted));

        return deleted;
    }
}

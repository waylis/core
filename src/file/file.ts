import mime from "mime";
import { randomUUID } from "../utils/random";

export interface FileMeta {
    id: string;
    name: string;
    size: number;
    mimeType: string;
    createdAt: Date;
}

export interface FileStorage {
    upload(bytes: NodeJS.ReadableStream | Buffer, metadata: FileMeta): Promise<boolean>;
    download(metadata: FileMeta): Promise<NodeJS.ReadableStream>;
    deleteByID(id: string): Promise<boolean>;
}

export interface FileDatabase {
    addFile(data: FileMeta): Promise<void>;
    getFileByID(id: string): Promise<FileMeta | null>;
    getFilesByIDs(ids: string[]): Promise<FileMeta[]>;
    deleteByIDs(ids: string[]): Promise<number>;
}

export type CreateFileDataParams = Omit<FileMeta, "id" | "mimeType" | "createdAt"> & { mimeType?: string };

export const createFileMeta = (meta: CreateFileDataParams): FileMeta => {
    const id = randomUUID();
    const mimeType = meta.mimeType || mime.getType(meta.name);
    if (!mimeType) throw Error(`Unable to identify the MIME type of the file - "${meta.name}".`);
    return { id, ...meta, mimeType, createdAt: new Date() };
};

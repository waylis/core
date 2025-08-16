import { defineMimeType } from "../utils/mime";
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

    isOpen: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
}

export interface FileDatabase {
    addFile(data: FileMeta): Promise<void>;
    getFileByID(id: string): Promise<FileMeta | null>;
    getFilesByIDs(ids: string[]): Promise<FileMeta[]>;
    deleteFileByID(id: string): Promise<FileMeta | null>;
    deleteOldFiles(maxDate: Date): Promise<string[]>;
}

export type CreateFileDataParams = Omit<FileMeta, "id" | "mimeType" | "createdAt"> & { mimeType?: string };

export interface FileManager {
    getFileMeta(id: string): Promise<FileMeta | null>;
    uploadFile(bytes: NodeJS.ReadableStream | Buffer, meta: CreateFileDataParams): Promise<FileMeta>;
    downloadFile(id: string): Promise<NodeJS.ReadableStream>;
    deleteFile(id: string): Promise<FileMeta | null>;
}

export const createFileMeta = (meta: CreateFileDataParams): FileMeta => {
    const id = randomUUID();
    const mimeType = meta.mimeType || defineMimeType(meta.name);
    if (!mimeType) throw Error(`Unable to identify the MIME type of the file - "${meta.name}".`);
    return { id, ...meta, mimeType, createdAt: new Date() };
};

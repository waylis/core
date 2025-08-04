import { randomUUID } from "../utils/random";

export interface FileData {
    id: string;
    name: string;
    size: number;
    mimeType: string;
}

export interface FileStorage {
    upload(bytes: NodeJS.ReadableStream | Buffer, metadata: FileData): Promise<boolean>;
    download(metadata: FileData): Promise<NodeJS.ReadableStream>;
    deleteByID(id: string): Promise<boolean>;
}

export interface FileDatabase {
    addFile(data: FileData): Promise<void>;
    getFileByID(id: string): Promise<FileData | null>;
    getFilesByIDs(ids: string[]): Promise<FileData[]>;
    deleteByIDs(ids: string[]): Promise<number>;
}

export const createFileData = (data: Omit<FileData, "id">): FileData => {
    return { id: randomUUID(), ...data };
};

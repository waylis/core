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

export type CreateFileMetaParams = Omit<FileMeta, "id" | "mimeType" | "createdAt"> & { mimeType?: string };

export interface FileManager {
    getFileMeta(id: string): Promise<FileMeta | null>;
    uploadFile(bytes: NodeJS.ReadableStream | Buffer, meta: CreateFileMetaParams): Promise<FileMeta>;
    downloadFile(id: string): Promise<NodeJS.ReadableStream>;
    deleteFile(id: string): Promise<FileMeta | null>;
    generateFileMeta(meta: CreateFileMetaParams): FileMeta;
}

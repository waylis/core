/**
 * Represents file metadata stored in the system.
 */
export interface FileMeta {
    /** Unique identifier of the file. */
    id: string;
    /** Original file name. */
    name: string;
    /** File size in bytes. */
    size: number;
    /** MIME type of the file. */
    mimeType: string;
    /** Timestamp when the file was created. */
    createdAt: Date;
}

/**
 * Abstraction for file storage operations.
 */
export interface FileStorage {
    /**
     * Upload a file into storage.
     * @param bytes File content as a stream or buffer.
     * @param metadata Associated file metadata.
     * @returns True if upload succeeded.
     */
    upload(bytes: NodeJS.ReadableStream | Buffer, metadata: FileMeta): Promise<boolean>;

    /**
     * Download a file from storage.
     * @param metadata File metadata.
     * @returns File content as a readable stream.
     */
    download(metadata: FileMeta): Promise<NodeJS.ReadableStream>;

    /**
     * Delete a file from storage by its ID.
     * @param id File identifier.
     * @returns True if deletion succeeded.
     */
    deleteByID(id: string): Promise<boolean>;

    /** Indicates whether the storage connection is open. */
    isOpen: boolean;

    /** Open the storage connection. */
    open(): Promise<void>;

    /** Close the storage connection. */
    close(): Promise<void>;
}

/**
 * Abstraction for file metadata persistence.
 */
export interface FileDatabase {
    /**
     * Add file metadata to the database.
     * @param data File metadata to store.
     */
    addFile(data: FileMeta): Promise<void>;

    /**
     * Retrieve file metadata by ID.
     * @param id File identifier.
     * @returns Metadata if found, otherwise null.
     */
    getFileByID(id: string): Promise<FileMeta | null>;

    /**
     * Retrieve multiple files by IDs.
     * @param ids List of file identifiers.
     */
    getFilesByIDs(ids: string[]): Promise<FileMeta[]>;

    /**
     * Delete file metadata by ID.
     * @param id File identifier.
     * @returns Deleted metadata or null if not found.
     */
    deleteFileByID(id: string): Promise<FileMeta | null>;

    /**
     * Delete all files created before a given date.
     * @param maxDate Cutoff date.
     * @returns List of deleted file IDs.
     */
    deleteOldFiles(maxDate: Date): Promise<string[]>;
}

/**
 * Parameters required to create a new file metadata object.
 * ID, MIME type, and creation date will be generated automatically.
 */
export type CreateFileMetaParams = Omit<FileMeta, "id" | "mimeType" | "createdAt"> & { mimeType?: string };

/**
 * High-level interface for managing files and metadata.
 */
export interface FileManager {
    /**
     * Retrieve metadata of a file by ID.
     * @param id File identifier.
     * @returns File metadata if found, otherwise null.
     */
    getFileMeta(id: string): Promise<FileMeta | null>;

    /**
     * Upload a new file with metadata.
     * @param bytes File content as a stream or buffer.
     * @param meta File metadata parameters.
     * @returns Stored file metadata.
     */
    uploadFile(bytes: NodeJS.ReadableStream | Buffer, meta: CreateFileMetaParams): Promise<FileMeta>;

    /**
     * Download a file by ID.
     * @param id File identifier.
     * @returns File content as a readable stream.
     */
    downloadFile(id: string): Promise<NodeJS.ReadableStream>;

    /**
     * Delete a file by ID.
     * @param id File identifier.
     * @returns Deleted metadata or null if not found.
     */
    deleteFile(id: string): Promise<FileMeta | null>;

    /**
     * Generate metadata for a file.
     * @param meta File metadata parameters.
     * @returns Complete file metadata object.
     */
    generateFileMeta(meta: CreateFileMetaParams): FileMeta;
}

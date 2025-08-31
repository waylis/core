import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import { Readable } from "node:stream";
import { MemoryDatabase } from "./../src/database/memory/memory";
import { AppServer } from "./../src/server/server";
import { CreateFileMetaParams, FileManager, FileMeta } from "../src/file/file";

describe("FileManager", () => {
    let fileManager: FileManager;
    const app = new AppServer({ db: new MemoryDatabase() });
    const testFileIDs: string[] = []; // need to cleanup after tests

    before(async () => {
        fileManager = await app.getFileManager();
    });

    test("getFileMeta returns null for non-existent file", async () => {
        const result = await fileManager.getFileMeta("non-existent-id");
        assert.strictEqual(result, null);
    });

    test("uploadFile and getFileMeta work correctly", async () => {
        const testData = Buffer.from("test content");
        const meta = {
            name: "test.txt",
            size: testData.length,
            mimeType: "text/plain",
        };

        const uploaded = await fileManager.uploadFile(testData, meta);
        testFileIDs.push(uploaded.id);

        assert.ok(uploaded.id);
        assert.strictEqual(uploaded.name, meta.name);
        assert.strictEqual(uploaded.size, meta.size);
        assert.strictEqual(uploaded.mimeType, meta.mimeType);
        assert.ok(uploaded.createdAt instanceof Date);

        const retrieved = await fileManager.getFileMeta(uploaded.id);
        assert.deepStrictEqual(retrieved, uploaded);
    });

    test("uploadFile with stream and downloadFile work correctly", async () => {
        const testData = "stream content";
        const meta = {
            name: "stream.txt",
            size: testData.length,
            mimeType: "text/plain",
        };

        const readable = Readable.from([testData]);
        const uploaded = await fileManager.uploadFile(readable, meta);
        testFileIDs.push(uploaded.id);

        const downloadStream = await fileManager.downloadFile(uploaded.id);
        const chunks: Buffer<ArrayBuffer>[] = [];

        for await (const chunk of downloadStream) {
            const bufferChunk = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
            chunks.push(bufferChunk);
        }
        const downloadedContent = Buffer.concat(chunks).toString();

        assert.strictEqual(downloadedContent, testData);
    });

    test("deleteFile removes file and returns metadata", async () => {
        const testData = Buffer.from("to delete");
        const meta = {
            name: "delete.txt",
            size: testData.length,
            mimeType: "text/plain",
        };

        const uploaded = await fileManager.uploadFile(testData, meta);
        const deleted = await fileManager.deleteFile(uploaded.id);

        assert.deepStrictEqual(deleted, uploaded);

        const shouldBeNull = await fileManager.getFileMeta(uploaded.id);
        assert.strictEqual(shouldBeNull, null);
    });

    test("deleteFile returns null for non-existent file", async () => {
        const result = await fileManager.deleteFile("non-existent-id");
        assert.strictEqual(result, null);
    });

    test("downloadFile throws error for non-existent file", async () => {
        await assert.rejects(() => fileManager.downloadFile("non-existent-id"), /File not found|does not exist/i);
    });

    test("uploadFile with Buffer and download as stream", async () => {
        const testData = Buffer.from("buffer content");
        const meta = {
            name: "buffer.txt",
            size: testData.length,
            mimeType: "application/octet-stream",
        };

        const uploaded = await fileManager.uploadFile(testData, meta);
        testFileIDs.push(uploaded.id);

        const downloadStream = await fileManager.downloadFile(uploaded.id);

        const chunks: Buffer<ArrayBufferLike>[] = [];
        for await (const chunk of downloadStream) {
            const bufferChunk = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
            chunks.push(bufferChunk);
        }
        const downloadedContent = Buffer.concat(chunks);

        assert.deepStrictEqual(downloadedContent, testData);
    });

    test("uploadFile with optional mimeType defaults correctly", async () => {
        const testData = Buffer.from("content");
        const meta = {
            name: "no-mime.txt",
            size: testData.length,
            // mimeType omitted
        };

        const uploaded = await fileManager.uploadFile(testData, meta);
        testFileIDs.push(uploaded.id);

        assert.ok(uploaded.mimeType); // Should have some default value
    });

    test("generateFileMeta with generated id and detected mimeType", () => {
        const params: CreateFileMetaParams = {
            name: "document.pdf",
            size: 1024,
        };

        const result = fileManager.generateFileMeta(params);

        assert.deepStrictEqual(result, {
            id: result.id,
            name: "document.pdf",
            size: 1024,
            mimeType: "application/pdf",
            createdAt: result.createdAt,
        } satisfies FileMeta);
    });

    test("generateFileMeta should use provided mimeType when given", () => {
        const params: CreateFileMetaParams = {
            name: "document.unknown",
            size: 2048,
            mimeType: "application/octet-stream",
        };

        const result = fileManager.generateFileMeta(params);

        assert.strictEqual(result.mimeType, "application/octet-stream");
    });

    test("generateFileMeta should throw when mimeType cannot be determined", () => {
        const params: CreateFileMetaParams = {
            name: "file.unknown",
            size: 512,
        };

        assert.throws(() => fileManager.generateFileMeta(params), {
            name: "Error",
            message: 'Unable to identify the MIME type of the file - "file.unknown".',
        });
    });

    test("generateFileMeta should require name and size parameters", () => {
        assert.throws(() => fileManager.generateFileMeta({} as FileMeta), { name: "Error" });
    });

    test("generateFileMeta should handle different file types correctly", () => {
        const testCases = [
            {
                input: { name: "image.png", size: 1024 },
                expectedMime: "image/png",
            },
            {
                input: { name: "report.pdf", size: 2048, mimeType: "application/pdf" },
                expectedMime: "application/pdf",
            },
        ];

        for (const { input, expectedMime } of testCases) {
            const result = fileManager.generateFileMeta(input);
            assert.strictEqual(result.mimeType, expectedMime);
        }
    });

    // Cleanup
    after(async () => {
        for (const id of testFileIDs) {
            await fileManager.deleteFile(id);
        }
    });
});

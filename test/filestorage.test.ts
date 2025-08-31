import { before, after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createWriteStream, promises } from "node:fs";
import { pipeline } from "node:stream/promises";
import * as path from "path";
import { FileMeta } from "../src/file/file";
import { DiskFileStorage } from "../src/file/storage/disk";
import { randomString } from "../src/utils/random";

const uploadDir = path.resolve(__dirname, "test_uploads");
let storage: DiskFileStorage;
let metadata: FileMeta;
let downloadedPath: string;

describe("DiskFileStorage", () => {
    before(async () => {
        await promises.mkdir(uploadDir, { recursive: true });
        storage = new DiskFileStorage(uploadDir);

        const content = `This is a test file.\nGenerated: ${new Date().toISOString()}`;
        const buffer = Buffer.from(content, "utf-8");

        metadata = {
            id: randomString(),
            name: "test.txt",
            size: buffer.length,
            mimeType: "text/plain",
            createdAt: new Date(),
        };

        const uploaded = await storage.upload(buffer, metadata);
        assert.ok(uploaded, "File should upload successfully");
    });

    it("should download uploaded file and match content", async () => {
        const stream = await storage.download(metadata);

        downloadedPath = path.resolve(__dirname, "downloaded_test.txt");
        const writeStream = createWriteStream(downloadedPath);
        await pipeline(stream, writeStream);

        const downloaded = await promises.readFile(downloadedPath, "utf-8");
        assert.match(downloaded, /This is a test file/);
    });

    it("should delete uploaded file by ID", async () => {
        const deleted = await storage.deleteByID(metadata.id);
        assert.equal(deleted, true, "File should be deleted");
    });

    after(async () => {
        try {
            await promises.unlink(downloadedPath);
        } catch {}
        try {
            await promises.rm(uploadDir, { recursive: true, force: true });
        } catch {}
    });
});

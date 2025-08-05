import { describe, it } from "node:test";
import assert from "node:assert";
import { CreateFileDataParams, createFileMeta, FileMeta } from "../src/file/file";

describe("createFileMeta", () => {
    it("should create FileMeta with generated id and detected mimeType", () => {
        const params: CreateFileDataParams = {
            name: "document.pdf",
            size: 1024,
        };

        const result = createFileMeta(params);

        assert.deepStrictEqual(result, {
            id: result.id,
            name: "document.pdf",
            size: 1024,
            mimeType: "application/pdf",
            createdAt: result.createdAt,
        } satisfies FileMeta);
    });

    it("should use provided mimeType when given", () => {
        const params: CreateFileDataParams = {
            name: "document.unknown",
            size: 2048,
            mimeType: "application/octet-stream",
        };

        const result = createFileMeta(params);

        assert.strictEqual(result.mimeType, "application/octet-stream");
    });

    it("should throw when mimeType cannot be determined", () => {
        const params: CreateFileDataParams = {
            name: "file.unknown",
            size: 512,
        };

        assert.throws(() => createFileMeta(params), {
            name: "Error",
            message: 'Unable to identify the MIME type of the file - "file.unknown".',
        });
    });

    it("should require name and size parameters", () => {
        assert.throws(
            // @ts-expect-error - Testing invalid input
            () => createFileMeta({}),
            { name: "Error" }
        );
    });

    it("should handle different file types correctly", () => {
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
            const result = createFileMeta(input);
            assert.strictEqual(result.mimeType, expectedMime);
        }
    });
});

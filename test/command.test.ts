import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createCommand } from "../src/scene/command";

describe("createCommand", () => {
    it("should create a basic command with only value", () => {
        const cmd = createCommand({ value: "test" });
        assert.deepStrictEqual(cmd, {
            value: "test",
            label: undefined,
            description: undefined,
        });
    });

    it("should create a full command with all fields", () => {
        const cmd = createCommand({
            value: "run",
            label: "Execute command",
            description: "Runs the specified operation",
        });
        assert.deepStrictEqual(cmd, {
            value: "run",
            label: "Execute command",
            description: "Runs the specified operation",
        });
    });

    it("should throw when value is too short", () => {
        assert.throws(() => createCommand({ value: "" }), Error);
    });

    it("should throw when value is too long", () => {
        assert.throws(() => createCommand({ value: "this-is-way-too-long-value" }), Error);
    });

    it("should throw when label is too long", () => {
        const longLabel = "a".repeat(65); // MAX_LABEL_LEN + 1
        assert.throws(() => createCommand({ value: "cmd", label: longLabel }), Error);
    });

    it("should throw when description is too long", () => {
        const longDesc = "a".repeat(513); // MAX_DESCR_LEN + 1
        assert.throws(() => createCommand({ value: "cmd", description: longDesc }), Error);
    });

    it("should accept maximum length values", () => {
        const maxValue = "a".repeat(16);
        const maxLabel = "b".repeat(64);
        const maxDesc = "c".repeat(512);

        const cmd = createCommand({
            value: maxValue,
            label: maxLabel,
            description: maxDesc,
        });

        assert.deepStrictEqual(cmd, {
            value: maxValue,
            label: maxLabel,
            description: maxDesc,
        });
    });

    it("should accept minimum length value", () => {
        const cmd = createCommand({ value: "a" });
        assert.strictEqual(cmd.value.length, 1);
    });
});

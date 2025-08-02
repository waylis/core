import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    COMMAND_DESCR_MAX_LEN,
    COMMAND_LABEL_MAX_LEN,
    COMMAND_VALUE_MAX_LEN,
    createCommand,
} from "../src/scene/command";

describe("createCommand", () => {
    const validCases = [
        {
            descr: "should create a basic command with only value",
            input: { value: "test" },
            expected: { value: "test", label: undefined, description: undefined },
        },
        {
            descr: "should create a basic command with all allowed symbols",
            input: { value: "command_123" },
            expected: { value: "command_123", label: undefined, description: undefined },
        },
        {
            descr: "should create a full command with all fields",
            input: { value: "run", label: "Label", description: "Descr" },
            expected: { value: "run", label: "Label", description: "Descr" },
        },
        {
            descr: "should accept maximum length values",
            input: {
                value: "a".repeat(COMMAND_VALUE_MAX_LEN),
                label: "b".repeat(COMMAND_LABEL_MAX_LEN),
                description: "c".repeat(COMMAND_DESCR_MAX_LEN),
            },
            expected: {
                value: "a".repeat(COMMAND_VALUE_MAX_LEN),
                label: "b".repeat(COMMAND_LABEL_MAX_LEN),
                description: "c".repeat(COMMAND_DESCR_MAX_LEN),
            },
        },
        {
            descr: "should accept minimum length values",
            input: { value: "a", label: "", description: "" },
            expected: { value: "a", label: "", description: "" },
        },
    ];

    validCases.forEach(({ descr, input, expected }) => {
        it(descr, () => {
            const cmd = createCommand(input);
            assert.deepStrictEqual(cmd, expected);
        });
    });

    const invalidCases = [
        {
            descr: "should reject when value is too short",
            input: { value: "" },
        },
        {
            descr: "should reject when value is too long",
            input: { value: "this_is_tooooo_long_command_value" },
        },
        {
            descr: "should reject when value contain uppercase symbols",
            input: { value: "VaLuE" },
        },
        {
            descr: "should reject when label is too long",
            input: { value: "cmd", label: "a".repeat(65) },
        },
        {
            descr: "should reject when description is too long",
            input: { value: "cmd", description: "a".repeat(513) },
        },
    ];

    invalidCases.forEach(({ descr, input }) => {
        it(descr, () => {
            assert.throws(() => createCommand(input), Error);
        });
    });
});

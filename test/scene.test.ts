import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SceneStep, createStep } from "../src/scene/step";

describe("createStep", () => {
    const mockSceneStep = (key: string): SceneStep => {
        return {
            key,
            prompt: { type: "text", content: "test" },
            replyRestriction: { bodyType: "text" },
        };
    };

    // Test valid step creation
    it("should accept a valid step with minimum key length", () => {
        const step = mockSceneStep("a");
        const result = createStep(step);
        assert.deepStrictEqual(result, step);
    });

    it("should accept a valid step with maximum key length", () => {
        const maxKey = "a".repeat(32); // MAX_STEP_KEY_LEN
        const step = mockSceneStep(maxKey);
        const result = createStep(step);
        assert.deepStrictEqual(result, step);
    });

    it("should accept a valid step with average key length", () => {
        const key = "a".repeat(16);
        const step = mockSceneStep(key);
        const result = createStep(step);
        assert.deepStrictEqual(result, step);
    });

    // Test invalid key lengths
    it("should throw when key is too short (empty)", () => {
        const invalidStep = mockSceneStep("");
        assert.throws(() => createStep(invalidStep), {
            name: "Error",
            message: "Wrong step key length, must be from 1 to 32 characters.",
        });
    });

    it("should throw when key is too long", () => {
        const longKey = "a".repeat(33); // > MAX_STEP_KEY_LEN
        const invalidStep = mockSceneStep(longKey);
        assert.throws(() => createStep(invalidStep), {
            name: "Error",
            message: "Wrong step key length, must be from 1 to 32 characters.",
        });
    });
});

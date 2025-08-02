import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SCENE_STEP_KEY_MAX_LEN, SceneStep, createStep } from "../src/scene/step";

describe("createStep", () => {
    const createMockStep = (key: string): SceneStep => ({
        key,
        prompt: { type: "text", content: "test" },
        replyRestriction: { bodyType: "text" },
    });

    const validCases = [
        { descr: "minimum length", key: "a" },
        { descr: "maximum length", key: "a".repeat(SCENE_STEP_KEY_MAX_LEN) },
        { descr: "average length", key: "a".repeat(SCENE_STEP_KEY_MAX_LEN / 2) },
        { descr: "allowed symbols", key: "abcdz1234_567890" },
    ];

    validCases.forEach(({ descr, key }) => {
        it(descr, () => {
            const step = createMockStep(key);
            const result = createStep(step);
            assert.deepStrictEqual(result, step);
        });
    });

    const invalidCases = [
        { descr: "empty key", key: "" },
        { descr: "too long key", key: "a".repeat(SCENE_STEP_KEY_MAX_LEN + 1) },
        { descr: "uppercase letters", key: "ABC" },
        { descr: "special symbols", key: "^$!)#" },
    ];

    invalidCases.forEach(({ descr, key }) => {
        it(descr, () => {
            const invalidStep = createMockStep(key);
            assert.throws(() => createStep(invalidStep), { name: "Error" });
        });
    });
});

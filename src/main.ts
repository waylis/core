import { createScene } from "./scene/scene";
import { createStep } from "./scene/step";

const stepName = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    replyRestriction: { bodyType: "text" },
});

const stepAge = createStep({
    key: "age",
    prompt: { type: "text", content: "What is your age?" },
    replyRestriction: { bodyType: "number" },
});

const scene = createScene({
    key: "test",
    steps: [stepName, stepAge],
    handler(responses) {
        responses.name;
        return { type: "text", content: "test" };
    },
});

console.log(scene);

import { UserMessageBodyType, SystemMessageBody, ReplyRestriction, MessageBodyMap } from "../message/types";
import { randomUUID } from "../utils/random";

export interface ConfirmedStep {
    id: string;
    threadID: string;
    messageID: string;
    scene: string;
    step: string;
    createdAt: Date;
}

export interface SceneStep<K extends string = string, T extends UserMessageBodyType = UserMessageBodyType> {
    key: K;
    prompt: SystemMessageBody;
    replyRestriction: ReplyRestriction<T>;
    handler?: (body: MessageBodyMap[T]) => Promise<SystemMessageBody | void>;
}

export interface ConfirmedStepDatabase {
    addConfirmedStep(step: ConfirmedStep): Promise<void>;
    getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]>;
    deleteOldConfirmedSteps(maxDate: Date): Promise<number>;
}

export const SCENE_STEP_KEY_MIN_LEN = 1;
export const SCENE_STEP_KEY_MAX_LEN = 32;
export const SCENE_STEP_KEY_ALLOWED_SYMBOLS = /^[a-z0-9_]+$/;

export const createStep = <K extends string, T extends UserMessageBodyType>(step: SceneStep<K, T>): SceneStep<K, T> => {
    if (step.key.length < SCENE_STEP_KEY_MIN_LEN || step.key.length > SCENE_STEP_KEY_MAX_LEN) {
        const msg = `"${step.key}" - Invalid step key length. Must be from ${SCENE_STEP_KEY_MIN_LEN} to ${SCENE_STEP_KEY_MAX_LEN}.`;
        throw Error(msg);
    }

    if (!SCENE_STEP_KEY_ALLOWED_SYMBOLS.test(step.key)) {
        const msg = `"${step.key}" - Invalid step key format. Only lowercase letters (a-z), numbers (0-9), and underscores (_) are allowed.`;
        throw Error(msg);
    }

    return step;
};

export const createConfirmedStep = (params: Omit<ConfirmedStep, "id" | "createdAt">): ConfirmedStep => {
    return { id: randomUUID(), ...params, createdAt: new Date() };
};

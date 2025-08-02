import { UserMessageBodyType, SystemMessageBody, ReplyRestriction, MessageBodyMap } from "../message/types";
import { randomUUID } from "../utils/random";

export interface ConfirmedStep {
    id: string;
    threadID: string;
    messageID: string;
    scene: string;
    step: string;
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
}

const MIN_STEP_KEY_LEN = 1;
const MAX_STEP_KEY_LEN = 32;

export const createStep = <K extends string, T extends UserMessageBodyType>(step: SceneStep<K, T>): SceneStep<K, T> => {
    if (step.key.length < MIN_STEP_KEY_LEN || step.key.length > MAX_STEP_KEY_LEN) {
        throw Error(`Wrong step key length, must be from ${MIN_STEP_KEY_LEN} to ${MAX_STEP_KEY_LEN} characters.`);
    }

    return step;
};

export const createConfirmedStep = (params: Omit<ConfirmedStep, "id">): ConfirmedStep => {
    return { id: randomUUID(), ...params };
};

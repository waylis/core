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

export interface ConfirmedStepStorage {
    addConfirmedStep(step: ConfirmedStep): Promise<void>;
    getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]>;
}

export const createStep = <K extends string, T extends UserMessageBodyType>(step: SceneStep<K, T>): SceneStep<K, T> => {
    return step;
};

export const createConfirmedStep = (params: Omit<ConfirmedStep, "id">): ConfirmedStep => {
    return { id: randomUUID(), ...params };
};

import { UserMessageBodyType, SystemMessageBody, ReplyRestriction, MessageBodyMap } from "../message/types";

export interface ConfirmedStep {
    id: string;
    threadID: string;
    messageID: string;
    sceneKey: string;
    stepKey: string;
}

export interface SceneStep<K extends string = string, T extends UserMessageBodyType = UserMessageBodyType> {
    key: K;
    prompt: SystemMessageBody;
    replyRestriction: ReplyRestriction<T>;
    handler?: (body: MessageBodyMap[T]) => Promise<SystemMessageBody | void>;
}

export const createStep = <K extends string, T extends UserMessageBodyType>(step: SceneStep<K, T>): SceneStep<K, T> => {
    return step;
}

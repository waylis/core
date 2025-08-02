import { randomUUID } from "../utils/random";
import { MessageBody, ReplyRestriction, UserMessageBody } from "./types";

export interface Message {
    id: string;
    chatID: string;
    senderID: string;
    replyTo?: string;
    threadID: string;
    scene?: string;
    step?: string;
    body: MessageBody;
    replyRestriction?: ReplyRestriction;
    createdAt: Date;
}

export interface MessageDatabase {
    addMessage(msg: Message): Promise<void>;
    getMessageByID(id: string): Promise<Message | null>;
    getMessagesByIDs(ids: string[]): Promise<Message[]>;
    getMessagesByChatID(chatID: string, page: number, limit: number): Promise<Message[]>;
    deleteOldMessages(maxDate: Date): Promise<number>;
    deleteMessagesByChatID(chatID: string): Promise<number>;
}

type CreateMessageParams = Omit<Message, "id" | "createdAt">;
type CreateUserMessageParams = Pick<CreateMessageParams, "chatID" | "senderID"> & { body: UserMessageBody };

export const SYSTEM_SENDER_ID = "system";

export const createMessage = (params: CreateMessageParams): Message => {
    return { id: randomUUID(), ...params, createdAt: new Date() };
};

export const createUserMessage = (params: CreateUserMessageParams, replyMsg?: Message) => {
    let msg: Message = {
        id: randomUUID(),
        ...params,
        threadID: replyMsg?.threadID || randomUUID(),
        createdAt: new Date(),
    };

    if (replyMsg) {
        msg = { ...msg, replyTo: replyMsg.id, scene: replyMsg.scene, step: replyMsg.step };
    }

    if (!replyMsg?.replyRestriction) return msg;

    if (replyMsg.replyRestriction.bodyType !== msg.body.type) {
        throw Error(`Invalid body type. Expected ${replyMsg.replyRestriction.bodyType}`);
    }
};

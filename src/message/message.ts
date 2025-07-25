import { randomUUID } from "../utils/random";
import { MessageBody, ReplyRestriction } from "./types";

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

export interface MessageStorage {
    add(msg: Message): Promise<void>;
    getByID(id: string): Promise<Message | null>;
    getByIDs(ids: string[]): Promise<Message[]>;
    getByChatID(chatID: string, page: number, limit: number): Promise<Message[]>;
    deleteOld(maxDate: Date): Promise<number>;
    deleteByChatID(chatID: string): Promise<number>;
}

type CreateMessageParams = Omit<Message, "id" | "createdAt">;

export const createMessage = (params: CreateMessageParams): Message => {
    return {
        id: randomUUID(),
        ...params,
        createdAt: new Date(),
    };
};

export const SYSTEM_SENDER_ID = "system";

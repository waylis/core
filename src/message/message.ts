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

export interface MessageDatabase {
    addMessage(msg: Message): Promise<void>;
    getMessageByID(id: string): Promise<Message | null>;
    getMessagesByIDs(ids: string[]): Promise<Message[]>;
    getMessagesByChatID(chatID: string, page: number, limit: number): Promise<Message[]>;
    deleteOldMessages(maxDate: Date): Promise<number>;
    deleteMessagesByChatID(chatID: string): Promise<number>;
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

import { randomUUID } from "../utils/random";

export interface Chat {
    id: string;
    name: string;
    creatorID: string;
    createdAt: Date;
}

export interface ChatStorage {
    addChat(chat: Chat): Promise<void>;
    getChatByID(id: string): Promise<Chat | null>;
    getChatsByCreatorID(creatorID: string): Promise<Chat[]>;
    deleteChatByID(id: string): Promise<Chat | null>;
}

export const createChat = (name: string, creatorID: string): Chat => {
    return {
        id: randomUUID(),
        name,
        creatorID,
        createdAt: new Date(),
    };
};

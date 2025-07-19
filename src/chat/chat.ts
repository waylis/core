import { randomUUID } from "../utils/random";

export interface Chat {
    id: string;
    name: string;
    creatorID: string;
    createdAt: Date;
}

export interface ChatStorage {
    add(chat: Chat): Promise<void>;
    getByID(id: string): Promise<Chat | null>;
    getByCreatorID(creatorID: string): Promise<Chat[]>;
    deleteByID(id: string): Promise<Chat | null>;
}

export const createChat = (name: string, creatorID: string): Chat => {
    return {
        id: randomUUID(),
        name,
        creatorID,
        createdAt: new Date(),
    };
};

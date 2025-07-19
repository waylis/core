import { Chat } from "./chat";

export interface ChatStorage {
    add(chat: Chat): Promise<void>;
    getByID(id: string): Promise<Chat | null>;
    getByCreatorID(creatorID: string): Promise<Chat[]>;
    deleteByID(id: string): Promise<Chat | null>;
}

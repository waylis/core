import { Chat } from "./chat";

export interface ChatStorage {
    add(chat: Chat): void;
    getByID(id: string): Chat | null;
    getByCreatorID(creatorID: string): Chat[];
    deleteByID(id: string): Chat | null;
}

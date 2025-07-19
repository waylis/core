import { Message } from "./message";

export interface MessageStorage {
    add(msg: Message): Promise<void>;
    getByID(id: string): Promise<Message | null>;
    getByIDs(ids: string[]): Promise<Message[]>;
    getByChatID(chatID: string, page: number, limit: number): Promise<Message[]>;
    deleteOld(maxDate: Date): Promise<number>;
    deleteByChatID(chatID: string): Promise<number>;
}

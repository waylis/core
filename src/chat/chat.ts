export interface Chat {
    id: string;
    name: string;
    creatorID: string;
    createdAt: Date;
}

export interface ChatDatabase {
    addChat(chat: Chat): Promise<void>;
    getChatByID(id: string): Promise<Chat | null>;
    getChatsByCreatorID(creatorID: string, offset: number, limit: number): Promise<Chat[]>;
    countChatsByCreatorID(creatorID: string): Promise<number>;
    editChatByID(id: string, updated: Partial<Chat>): Promise<Chat | null>;
    deleteChatByID(id: string): Promise<Chat | null>;
}

export class ChatManager {
    constructor(private generateID: () => string) {}

    createChat(name: string, creatorID: string): Chat {
        return { id: this.generateID(), name, creatorID, createdAt: new Date() };
    }
}

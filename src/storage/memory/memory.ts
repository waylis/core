import { Chat } from "../../chat/chat";
import { Message } from "../../message/message";
import { ConfirmedStep } from "../../scene/step";
import { Storage } from "../storage";

class MemoryStorage implements Storage {
    private chats: Chat[] = [];
    private messages: Message[] = [];
    private steps: ConfirmedStep[] = [];

    async open(): Promise<void> {}
    async close(): Promise<void> {}

    // Chat operations
    async addChat(chat: Chat): Promise<void> {
        if (this.chats.some((c) => c.id === chat.id)) {
            throw new Error(`Chat with ID ${chat.id} already exists`);
        }
        this.chats.push(chat);
    }

    async getChatByID(id: string): Promise<Chat | null> {
        return this.chats.find((chat) => chat.id === id) || null;
    }

    async getChatsByCreatorID(creatorID: string): Promise<Chat[]> {
        return this.chats.filter((chat) => chat.creatorID === creatorID);
    }

    async deleteChatByID(id: string): Promise<Chat | null> {
        const index = this.chats.findIndex((chat) => chat.id === id);
        if (index === -1) return null;

        const [deletedChat] = this.chats.splice(index, 1);
        return deletedChat;
    }

    // Message operations
    async addMessage(msg: Message): Promise<void> {
        if (this.messages.some((m) => m.id === msg.id)) {
            throw new Error(`Message with ID ${msg.id} already exists`);
        }
        this.messages.push(msg);
    }

    async getMessageByID(id: string): Promise<Message | null> {
        return this.messages.find((msg) => msg.id === id) || null;
    }

    async getMessagesByIDs(ids: string[]): Promise<Message[]> {
        return this.messages.filter((msg) => ids.includes(msg.id));
    }

    async getMessagesByChatID(chatID: string, page: number = 1, limit: number = 50): Promise<Message[]> {
        const filtered = this.messages
            .filter((msg) => msg.chatID === chatID)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const start = (page - 1) * limit;
        return filtered.slice(start, start + limit);
    }

    async deleteOldMessages(maxDate: Date): Promise<number> {
        const initialCount = this.messages.length;
        this.messages = this.messages.filter((msg) => msg.createdAt > maxDate);
        return initialCount - this.messages.length;
    }

    async deleteMessagesByChatID(chatID: string): Promise<number> {
        const initialCount = this.messages.length;
        this.messages = this.messages.filter((msg) => msg.chatID !== chatID);
        return initialCount - this.messages.length;
    }

    // Step operations
    async addConfirmedStep(step: ConfirmedStep): Promise<void> {
        if (this.steps.some((s) => s.id === step.id)) {
            throw new Error(`Step with ID ${step.id} already exists`);
        }
        this.steps.push(step);
    }

    async getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]> {
        return this.steps.filter((step) => step.threadID === threadID);
    }
}

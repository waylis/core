import { Chat } from "../../chat/chat";
import { FileMeta } from "../../file/file";
import { Message } from "../../message/message";
import { ConfirmedStep } from "../../scene/step";
import { Database } from "../database";

export class MemoryDatabase implements Database {
    isOpen: boolean = false;
    private chats: Chat[] = [];
    private messages: Message[] = [];
    private steps: ConfirmedStep[] = [];
    private files: FileMeta[] = [];

    async open(): Promise<void> {
        this.isOpen = true;
    }

    async close(): Promise<void> {
        this.isOpen = false;
    }

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

    async getChatsByCreatorID(creatorID: string, offset: number, limit: number): Promise<Chat[]> {
        const filteredChats = this.chats
            .filter((chat) => chat.creatorID === creatorID)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return filteredChats.slice(offset, offset + limit);
    }

    async countChatsByCreatorID(creatorID: string): Promise<number> {
        return this.chats.filter((chat) => chat.creatorID === creatorID).length;
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

    async getMessagesByChatID(chatID: string, offset: number, limit: number): Promise<Message[]> {
        const filtered = this.messages
            .filter((msg) => msg.chatID === chatID)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return filtered.slice(offset, offset + limit);
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

    async deleteOldConfirmedSteps(maxDate: Date): Promise<number> {
        const initialCount = this.steps.length;
        this.steps = this.steps.filter((step) => step.createdAt > maxDate);
        return initialCount - this.steps.length;
    }

    // File operations
    async addFile(data: FileMeta): Promise<void> {
        if (this.files.some((f) => f.id === data.id)) {
            throw new Error(`File with ID ${data.id} already exists`);
        }
        this.files.push(data);
    }

    async getFileByID(id: string): Promise<FileMeta | null> {
        return this.files.find((file) => file.id === id) || null;
    }

    async getFilesByIDs(ids: string[]): Promise<FileMeta[]> {
        return this.files.filter((file) => ids.includes(file.id));
    }

    async deleteFileByID(id: string): Promise<FileMeta | null> {
        const index = this.files.findIndex((file) => file.id === id);
        if (index === -1) return null;

        const [deletedFile] = this.files.splice(index, 1);
        return deletedFile;
    }

    async deleteOldFiles(maxDate: Date): Promise<string[]> {
        const deletedIDs: string[] = [];
        this.files = this.files.filter((file) => {
            const isOld = file.createdAt < maxDate;
            if (isOld) deletedIDs.push(file.id);
            return !isOld;
        });

        return deletedIDs;
    }
}

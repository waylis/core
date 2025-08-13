import fs from "fs/promises";
import path from "path";
import { Chat } from "../../chat/chat";
import { Message } from "../../message/message";
import { ConfirmedStep } from "../../scene/step";
import { Database } from "../database";
import { FileMeta } from "../../file/file";

export class JSONDatabase implements Database {
    private dataPath: string;
    private data: {
        chats: Chat[];
        messages: Message[];
        steps: ConfirmedStep[];
        files: FileMeta[];
    };

    constructor(filepath: string = "./db.json") {
        this.dataPath = path.resolve(filepath);
        this.data = { chats: [], messages: [], steps: [], files: [] };
    }

    private async loadData(): Promise<void> {
        try {
            const fileContent = await fs.readFile(this.dataPath, "utf-8");
            this.data = JSON.parse(fileContent);
        } catch (error) {
            if (error.code === "ENOENT") {
                // File doesn't exist, initialize with empty data
                await this.saveData();
            } else {
                throw error;
            }
        }
    }

    private async saveData(): Promise<void> {
        const dir = path.dirname(this.dataPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(this.dataPath, JSON.stringify(this.data));
    }

    async open(): Promise<void> {
        await this.loadData();
    }

    async close(): Promise<void> {}

    // Chat operations
    async addChat(chat: Chat): Promise<void> {
        await this.loadData();
        if (this.data.chats.some((c) => c.id === chat.id)) {
            throw new Error(`Chat with ID ${chat.id} already exists`);
        }
        this.data.chats.push(chat);
        await this.saveData();
    }

    async getChatByID(id: string): Promise<Chat | null> {
        await this.loadData();
        return this.data.chats.find((chat) => chat.id === id) || null;
    }

    async getChatsByCreatorID(creatorID: string, page: number, limit: number): Promise<Chat[]> {
        await this.loadData();
        const filteredChats = this.data.chats.filter((chat) => chat.creatorID === creatorID);
        const startIndex = (page - 1) * limit;
        return filteredChats.slice(startIndex, startIndex + limit);
    }

    async deleteChatByID(id: string): Promise<Chat | null> {
        await this.loadData();
        const index = this.data.chats.findIndex((chat) => chat.id === id);
        if (index === -1) return null;

        const [deletedChat] = this.data.chats.splice(index, 1);
        await this.saveData();
        return deletedChat;
    }

    // Message operations
    async addMessage(msg: Message): Promise<void> {
        await this.loadData();
        if (this.data.messages.some((m) => m.id === msg.id)) {
            throw new Error(`Message with ID ${msg.id} already exists`);
        }
        this.data.messages.push(msg);
        await this.saveData();
    }

    async getMessageByID(id: string): Promise<Message | null> {
        await this.loadData();
        return this.data.messages.find((msg) => msg.id === id) || null;
    }

    async getMessagesByIDs(ids: string[]): Promise<Message[]> {
        await this.loadData();
        return this.data.messages.filter((msg) => ids.includes(msg.id));
    }

    async getMessagesByChatID(chatID: string, page: number = 1, limit: number = 50): Promise<Message[]> {
        await this.loadData();
        const filtered = this.data.messages
            .filter((msg) => msg.chatID === chatID)
            .map((msg) => {
                msg.createdAt = new Date(msg.createdAt);
                return msg;
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const start = (page - 1) * limit;
        return filtered.slice(start, start + limit);
    }

    async deleteOldMessages(maxDate: Date): Promise<number> {
        await this.loadData();
        const initialCount = this.data.messages.length;
        this.data.messages = this.data.messages.filter((msg) => msg.createdAt > maxDate);
        await this.saveData();
        return initialCount - this.data.messages.length;
    }

    async deleteMessagesByChatID(chatID: string): Promise<number> {
        await this.loadData();
        const initialCount = this.data.messages.length;
        this.data.messages = this.data.messages.filter((msg) => msg.chatID !== chatID);
        await this.saveData();
        return initialCount - this.data.messages.length;
    }

    // Step operations
    async getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]> {
        await this.loadData();
        return this.data.steps.filter((step) => step.threadID === threadID);
    }

    async addConfirmedStep(step: ConfirmedStep): Promise<void> {
        await this.loadData();
        if (this.data.steps.some((s) => s.id === step.id)) {
            throw new Error(`Step with ID ${step.id} already exists`);
        }
        this.data.steps.push(step);
        await this.saveData();
    }

    async deleteConfirmedStepsByThreadIDs(threadIDs: string[]): Promise<number> {
        const initialLength = this.data.steps.length;
        this.data.steps = this.data.steps.filter((step) => !threadIDs.includes(step.threadID));

        return initialLength - this.data.steps.length;
    }

    // File operations
    async addFile(data: FileMeta): Promise<void> {
        if (this.data.files.some((f) => f.id === data.id)) {
            throw new Error(`File with ID ${data.id} already exists`);
        }
        this.data.files.push(data);
        await this.saveData();
    }

    async getFileByID(id: string): Promise<FileMeta | null> {
        return this.data.files.find((file) => file.id === id) || null;
    }

    async getFilesByIDs(ids: string[]): Promise<FileMeta[]> {
        return this.data.files.filter((file) => ids.includes(file.id));
    }

    async deleteByIDs(ids: string[]): Promise<number> {
        const initialCount = this.data.files.length;
        this.data.files = this.data.files.filter((file) => !ids.includes(file.id));
        await this.saveData();
        return initialCount - this.data.files.length;
    }
}

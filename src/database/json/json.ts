import fs from "fs/promises";
import path from "path";
import { Chat } from "../../chat/chat";
import { Message } from "../../message/message";
import { ConfirmedStep } from "../../scene/step";
import { Database } from "../database";
import { FileMeta } from "../../file/file";
import { Mutex } from "../../utils/mutex";
import { jsonDateReviver } from "../../utils/date";

export class JSONDatabase implements Database {
    isOpen: boolean = false;
    private dataPath: string;
    private data: {
        chats: Chat[];
        messages: Message[];
        steps: ConfirmedStep[];
        files: FileMeta[];
    };
    private writeMutex = new Mutex();

    constructor(filepath: string = "./db.json") {
        this.dataPath = path.resolve(filepath);
        this.data = { chats: [], messages: [], steps: [], files: [] };
    }

    private async loadData(): Promise<void> {
        try {
            const fileContent = await fs.readFile(this.dataPath, "utf-8");
            this.data = JSON.parse(fileContent, jsonDateReviver);
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
        const tmpPath = `${this.dataPath}.${process.pid}.${Date.now()}.tmp`;
        await fs.writeFile(tmpPath, JSON.stringify(this.data));
        await fs.rename(tmpPath, this.dataPath);
    }

    private async withWriteLock<T>(fn: () => Promise<T> | T): Promise<T> {
        const release = await this.writeMutex.acquire();
        try {
            await this.loadData();
            const result = await fn();
            await this.saveData();
            return result;
        } finally {
            release();
        }
    }

    async open(): Promise<void> {
        await this.loadData();
        this.isOpen = true;
    }

    async close(): Promise<void> {
        this.isOpen = false;
    }

    // Chat operations
    async addChat(chat: Chat): Promise<void> {
        await this.withWriteLock(async () => {
            if (this.data.chats.some((c) => c.id === chat.id)) {
                throw new Error(`Chat with ID ${chat.id} already exists`);
            }
            this.data.chats.push(chat);
        });
    }

    async getChatByID(id: string): Promise<Chat | null> {
        await this.loadData();
        return this.data.chats.find((chat) => chat.id === id) || null;
    }

    async getChatsByCreatorID(creatorID: string, offset: number, limit: number): Promise<Chat[]> {
        await this.loadData();

        const filteredChats = this.data.chats
            .filter((chat) => chat.creatorID === creatorID)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return filteredChats.slice(offset, offset + limit);
    }

    async countChatsByCreatorID(creatorID: string): Promise<number> {
        return this.data.chats.filter((chat) => chat.creatorID === creatorID).length;
    }

    async deleteChatByID(id: string): Promise<Chat | null> {
        return this.withWriteLock(() => {
            const index = this.data.chats.findIndex((chat) => chat.id === id);
            if (index === -1) return null;
            const [deleted] = this.data.chats.splice(index, 1);
            return deleted;
        });
    }

    // Message operations
    async addMessage(msg: Message): Promise<void> {
        await this.withWriteLock(async () => {
            if (this.data.messages.some((m) => m.id === msg.id)) {
                throw new Error(`Message with ID ${msg.id} already exists`);
            }
            this.data.messages.push(msg);
        });
    }

    async getMessageByID(id: string): Promise<Message | null> {
        await this.loadData();
        return this.data.messages.find((msg) => msg.id === id) || null;
    }

    async getMessagesByIDs(ids: string[]): Promise<Message[]> {
        await this.loadData();
        return this.data.messages.filter((msg) => ids.includes(msg.id));
    }

    async getMessagesByChatID(chatID: string, offset: number, limit: number): Promise<Message[]> {
        await this.loadData();

        const filtered = this.data.messages
            .filter((msg) => msg.chatID === chatID)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return filtered.slice(offset, offset + limit);
    }

    async deleteOldMessages(maxDate: Date): Promise<number> {
        return this.withWriteLock(() => {
            const initialCount = this.data.messages.length;
            this.data.messages = this.data.messages.filter((msg) => msg.createdAt > maxDate);
            return initialCount - this.data.messages.length;
        });
    }
    async deleteMessagesByChatID(chatID: string): Promise<number> {
        return this.withWriteLock(() => {
            const initialCount = this.data.messages.length;
            this.data.messages = this.data.messages.filter((msg) => msg.chatID !== chatID);
            return initialCount - this.data.messages.length;
        });
    }

    // Step operations
    async getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]> {
        await this.loadData();
        return this.data.steps.filter((step) => step.threadID === threadID);
    }

    async addConfirmedStep(step: ConfirmedStep): Promise<void> {
        await this.withWriteLock(async () => {
            if (this.data.steps.some((s) => s.id === step.id)) {
                throw new Error(`Step with ID ${step.id} already exists`);
            }
            this.data.steps.push(step);
        });
    }

    async deleteOldConfirmedSteps(maxDate: Date): Promise<number> {
        return this.withWriteLock(() => {
            const initialLength = this.data.steps.length;
            this.data.steps = this.data.steps.filter((step) => step.createdAt > maxDate);
            return initialLength - this.data.steps.length;
        });
    }

    // File operations
    async addFile(data: FileMeta): Promise<void> {
        await this.withWriteLock(async () => {
            if (this.data.files.some((f) => f.id === data.id)) {
                throw new Error(`File with ID ${data.id} already exists`);
            }
            this.data.files.push(data);
        });
    }

    async getFileByID(id: string): Promise<FileMeta | null> {
        return this.data.files.find((file) => file.id === id) || null;
    }

    async getFilesByIDs(ids: string[]): Promise<FileMeta[]> {
        return this.data.files.filter((file) => ids.includes(file.id));
    }

    async deleteFileByID(id: string): Promise<FileMeta | null> {
        return this.withWriteLock(() => {
            const index = this.data.files.findIndex((file) => file.id === id);
            if (index === -1) return null;
            const [deleted] = this.data.files.splice(index, 1);
            return deleted;
        });
    }

    async deleteOldFiles(maxDate: Date): Promise<string[]> {
        return this.withWriteLock(() => {
            const deletedIDs: string[] = [];
            this.data.files = this.data.files.filter((file) => {
                const isOld = file.createdAt < maxDate;
                if (isOld) deletedIDs.push(file.id);
                return !isOld;
            });
            return deletedIDs;
        });
    }
}

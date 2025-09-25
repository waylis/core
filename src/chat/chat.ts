/**
 * Represents a chat entity.
 */
export interface Chat {
    /** Unique identifier of the chat. */
    id: string;
    /** Display name of the chat. */
    name: string;
    /** ID of the user who created the chat. */
    creatorID: string;
    /** Timestamp when the chat was created. */
    createdAt: Date;
}

/**
 * Abstraction for chat persistence operations.
 */
export interface ChatDatabase {
    /**
     * Add a new chat to the database.
     * @param chat Chat object to store.
     */
    addChat(chat: Chat): Promise<void>;

    /**
     * Retrieve a chat by its ID.
     * @param id Chat identifier.
     * @returns Chat if found, otherwise null.
     */
    getChatByID(id: string): Promise<Chat | null>;

    /**
     * Retrieve chats created by a specific user.
     * @param creatorID User identifier.
     * @param offset Skip this many results.
     * @param limit Maximum number of results.
     */
    getChatsByCreatorID(creatorID: string, offset: number, limit: number): Promise<Chat[]>;

    /**
     * Count how many chats were created by a user.
     * @param creatorID User identifier.
     */
    countChatsByCreatorID(creatorID: string): Promise<number>;

    /**
     * Update a chat by ID.
     * @param id Chat identifier.
     * @param updated Partial fields to update.
     * @returns Updated chat or null if not found.
     */
    editChatByID(id: string, updated: Partial<Chat>): Promise<Chat | null>;

    /**
     * Remove a chat by ID.
     * @param id Chat identifier.
     * @returns Deleted chat or null if not found.
     */
    deleteChatByID(id: string): Promise<Chat | null>;
}

export class ChatManager {
    constructor(private generateID: () => string) {}

    createChat(name: string, creatorID: string): Chat {
        return { id: this.generateID(), name, creatorID, createdAt: new Date() };
    }
}

import { FileMeta } from "../file/file";
import { bytesToMB, isFloat } from "../utils/number";
import { isPlainObject } from "../utils/validation";
import {
    DatetimeLimits,
    MessageBody,
    NumberLimits,
    ReplyRestriction,
    OptionLimits,
    SystemMessageBody,
    TextLimits,
    UserMessageBody,
    OptionsLimits,
    FileLimits,
    FilesLimits,
    UserMessageBodyType,
} from "./types";

/**
 * Represents a chat message.
 */
export interface Message {
    /** Unique identifier of the message. */
    id: string;
    /** ID of the chat this message belongs to. */
    chatID: string;
    /** ID of the user who sent the message. */
    senderID: string;
    /** ID of the message this one replies to, if any. */
    replyTo?: string;
    /** ID of the thread this message belongs to. */
    threadID: string;
    /** Optional scene identifier for workflow tracking. */
    scene?: string;
    /** Optional step identifier within a scene. */
    step?: string;
    /** Message content. */
    body: MessageBody;
    /** Restriction settings for replies, if any. */
    replyRestriction?: ReplyRestriction;
    /** Timestamp when the message was created. */
    createdAt: Date;
}

/**
 * Abstraction for message persistence operations.
 */
export interface MessageDatabase {
    /**
     * Add a new message to the database.
     * @param msg Message to store.
     */
    addMessage(msg: Message): Promise<void>;

    /**
     * Retrieve a message by its ID.
     * @param id Message identifier.
     * @returns Message if found, otherwise null.
     */
    getMessageByID(id: string): Promise<Message | null>;

    /**
     * Retrieve multiple messages by IDs.
     * @param ids List of message identifiers.
     */
    getMessagesByIDs(ids: string[]): Promise<Message[]>;

    /**
     * Retrieve messages from a chat.
     * @param chatID Chat identifier.
     * @param offset Skip this many results.
     * @param limit Maximum number of results.
     */
    getMessagesByChatID(chatID: string, offset: number, limit: number): Promise<Message[]>;

    /**
     * Delete all messages created before a given date.
     * @param maxDate Cutoff date.
     * @returns Number of deleted messages.
     */
    deleteOldMessages(maxDate: Date): Promise<number>;

    /**
     * Delete all messages belonging to a chat.
     * @param chatID Chat identifier.
     * @returns Number of deleted messages.
     */
    deleteMessagesByChatID(chatID: string): Promise<number>;
}

type CreateMessageParams = Omit<Message, "id" | "createdAt">;

export type CreateSystemMessageParams = Omit<
    CreateMessageParams,
    "senderID" | "replyTo" | "threadID" | "chatID" | "body"
> & {
    body: SystemMessageBody;
    chatID?: string;
};
export type CreateUserMessageParams = Pick<CreateMessageParams, "chatID" | "senderID" | "body" | "replyTo"> & {
    body: UserMessageBody;
};

export const SYSTEM_SENDER_ID = "system";

const allowedUserMessageBodyTypes: UserMessageBodyType[] = [
    "command",
    "text",
    "number",
    "boolean",
    "datetime",
    "option",
    "options",
    "file",
    "files",
];

export class MessageManager {
    constructor(private generateID: () => string) {}

    createSystemMessage(params: CreateSystemMessageParams, userMsg?: Message): Message {
        if (!userMsg && !params.chatID) {
            throw new Error("chatID is required when user message is not provided");
        }

        return {
            id: this.generateID(),
            senderID: SYSTEM_SENDER_ID,
            ...params,
            threadID: userMsg ? userMsg.threadID : this.generateID(),
            replyTo: userMsg?.id,
            chatID: userMsg ? userMsg.chatID : params.chatID!,
            createdAt: new Date(),
        };
    }

    createUserMessage(params: CreateUserMessageParams, replyMsg?: Message): Message {
        let msg: Message = {
            id: this.generateID(),
            ...params,
            threadID: replyMsg?.threadID || this.generateID(),
            createdAt: new Date(),
        };

        if (replyMsg) {
            msg = {
                ...msg,
                replyTo: replyMsg.id,
                scene: replyMsg.scene,
                step: replyMsg.step,
            };
        }

        if (!replyMsg?.replyRestriction) return msg;

        if (replyMsg.replyRestriction.bodyType !== msg.body.type) {
            throw Error(`Invalid body type. Expected ${replyMsg.replyRestriction.bodyType}`);
        }

        if (replyMsg.replyRestriction.bodyType === "text") {
            const bodyContent = params.body.content.toString();
            const limit = replyMsg.replyRestriction.bodyLimits as TextLimits;
            msg.body.content = bodyContent;

            if (limit?.minLength != null && bodyContent.length < limit.minLength) {
                throw Error(`The message body is too short. It must be at least ${limit.minLength} characters long.`);
            }

            if (limit?.maxLength != null && bodyContent.length > limit.maxLength) {
                throw Error(
                    `The message body is too long. It should be no more than ${limit.maxLength} characters long.`
                );
            }
        }

        if (replyMsg.replyRestriction.bodyType === "number") {
            const bodyContent = Number(params.body.content) || 0;
            const limit = replyMsg.replyRestriction.bodyLimits as NumberLimits;
            msg.body.content = bodyContent;

            if (limit?.integerOnly && isFloat(bodyContent)) {
                throw Error(`Invalid message body. It must be a valid integer.`);
            }

            if (limit?.min != null && bodyContent < limit.min) {
                throw Error(`The number is too small. The minimum allowed value is ${limit.min}.`);
            }

            if (limit?.max != null && bodyContent > limit.max) {
                throw Error(`The number is too big. The maximum allowed value is ${limit.max}.`);
            }
        }

        if (replyMsg.replyRestriction.bodyType === "datetime") {
            const bodyContent = params.body.content as Date;
            const limit = replyMsg.replyRestriction.bodyLimits as DatetimeLimits;
            msg.body.content = bodyContent;

            if (limit?.min != null && bodyContent.getTime() < limit.min.getTime()) {
                throw Error(`The date is too old. The minimum allowed is ${limit.min.toISOString()}.`);
            }

            if (limit?.max != null && bodyContent.getTime() > limit.max.getTime()) {
                throw Error(`The date is too early. The maximum allowed is ${limit.max.toISOString()}.`);
            }
        }

        if (replyMsg.replyRestriction.bodyType === "option") {
            const bodyContent = msg.body.content as string;
            const limit = replyMsg.replyRestriction.bodyLimits as OptionLimits;
            const existingOption = limit?.options?.find((opt) => opt?.value === bodyContent);
            if (!existingOption) {
                throw Error("The provided option does not exist.");
            }
        }

        if (replyMsg.replyRestriction.bodyType === "options") {
            const bodyContent = msg.body.content as string[];
            const limit = replyMsg.replyRestriction.bodyLimits as OptionsLimits;

            if (limit?.maxAmount != null && bodyContent.length > limit.maxAmount) {
                throw Error(`Too many options. The maximum allowed is ${limit.maxAmount}`);
            }

            for (const option of bodyContent) {
                const existingOption = limit?.options?.find((lopt) => lopt?.value === option);
                if (!existingOption) {
                    throw Error("The provided option does not exist.");
                }
            }
        }

        if (replyMsg.replyRestriction.bodyType === "file") {
            const bodyContent = msg.body.content as FileMeta;
            const limit = replyMsg.replyRestriction.bodyLimits as FileLimits;
            this.checkFileDataLimit(limit, bodyContent);
        }

        if (replyMsg.replyRestriction.bodyType === "files") {
            const bodyContent = msg.body.content as FileMeta[];
            const limit = replyMsg.replyRestriction.bodyLimits as FilesLimits;
            if (limit?.maxAmount != null && bodyContent.length > limit.maxAmount) {
                throw Error(`Too many files. The maximum allowed is ${limit.maxAmount}`);
            }

            for (const file of bodyContent) {
                this.checkFileDataLimit(limit, file);
            }
        }

        return msg;
    }

    validateUserMessageParams(input: any, senderID: string): CreateUserMessageParams {
        if (!isPlainObject(input)) throw Error("Input must be a JSON object");
        const params = input;

        if (!("chatID" in input) || typeof input.chatID !== "string") throw Error("'chatID' must be a string");
        if ("replyTo" in input && typeof input.replyTo !== "string")
            throw Error("'replyTo' must be a string if provided");
        if (!("body" in input)) throw Error("'body' must be an object");
        if (!("type" in input.body) || typeof input.body.type !== "string") throw Error("'body.type' must be a string");
        if (!allowedUserMessageBodyTypes.includes(input.body.type)) throw Error("Not allowed 'body.type'");

        if (!("content" in input.body)) throw Error("'body.content' must be provided");

        const invalidBodyContentMsg = "Invalid body.content for the provided body.type";
        if (input.body.type === "text") {
            if (typeof input.body.content !== "string") throw Error(invalidBodyContentMsg);
        }
        if (input.body.type === "number") {
            if (typeof input.body.content !== "number") throw Error(invalidBodyContentMsg);
        }
        if (input.body.type === "boolean") {
            if (typeof input.body.content !== "boolean") throw Error(invalidBodyContentMsg);
        }
        if (input.body.type === "datetime") {
            if (typeof input.body.content !== "string") throw Error(invalidBodyContentMsg);
            if (isNaN(new Date(input.body.content)?.getTime())) throw Error(invalidBodyContentMsg);
            params.body.content = new Date(input.body.content);
        }
        if (input.body.type === "option") {
            if (typeof input.body.content !== "string") throw Error(invalidBodyContentMsg);
        }
        if (input.body.type === "options") {
            if (!Array.isArray(input.body.content)) throw Error(invalidBodyContentMsg);
            params.body.content = input.body.content.map(String);
        }
        if (input.body.type === "file") {
            if (!isPlainObject(input.body.content)) throw Error(invalidBodyContentMsg);
            if (!("id" in input.body.content)) throw Error(invalidBodyContentMsg);
            if (typeof input.body.content.id !== "string") throw Error(invalidBodyContentMsg);
        }
        if (input.body.type === "files") {
            if (!Array.isArray(input.body.content)) throw Error(invalidBodyContentMsg);
            for (const item of input.body.content) {
                if (!isPlainObject(item)) throw Error(invalidBodyContentMsg);
                if (!("id" in item)) throw Error(invalidBodyContentMsg);
                if (typeof item.id !== "string") throw Error(invalidBodyContentMsg);
            }
        }

        return {
            senderID,
            chatID: params.chatID,
            replyTo: params.replyTo,
            body: { type: params.body.type, content: params.body.content },
        };
    }

    private checkFileDataLimit(limit: FileLimits, filemeta: FileMeta) {
        if (limit?.mimeTypes && limit.mimeTypes.length) {
            const isValidMime = limit.mimeTypes.includes(filemeta.mimeType);
            if (!isValidMime) throw Error("MIME type not allowed.");
        }

        if (limit?.maxSize != null && filemeta.size > limit.maxSize) {
            throw Error(`Too large file. The maximum allowed size is ${bytesToMB(limit.maxSize)} MB.`);
        }
    }
}

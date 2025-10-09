import { ERRORS } from "./errors";
import { FileMeta } from "../file/file";
import { bytesToMB, isFloat } from "../utils/number";
import { isPlainObject } from "../utils/validation";
import {
    DatetimeLimits,
    MessageBody,
    NumberLimits,
    ExpectedReply,
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
    reply?: ExpectedReply;
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
        if (!userMsg && !params.chatID) throw new Error(ERRORS.SYSTEM_CHAT_ID_REQUIRED);

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
            msg = { ...msg, replyTo: replyMsg.id, scene: replyMsg.scene, step: replyMsg.step };
        }

        if (!replyMsg?.reply) return msg;

        if (replyMsg.reply.bodyType !== msg.body.type) {
            throw Error(ERRORS.INVALID_BODY_TYPE_EXPECTED(replyMsg.reply.bodyType));
        }

        if (replyMsg.reply.bodyType === "text") {
            const bodyContent = params.body.content.toString();
            const limit = replyMsg.reply.bodyLimits as TextLimits;
            msg.body.content = bodyContent;

            if (limit?.minLength != null && bodyContent.length < limit.minLength) {
                throw Error(ERRORS.TEXT_TOO_SHORT(limit.minLength));
            }

            if (limit?.maxLength != null && bodyContent.length > limit.maxLength) {
                throw Error(ERRORS.TEXT_TOO_LONG(limit.maxLength));
            }
        }

        if (replyMsg.reply.bodyType === "number") {
            const bodyContent = Number(params.body.content) || 0;
            const limit = replyMsg.reply.bodyLimits as NumberLimits;
            msg.body.content = bodyContent;

            if (limit?.integerOnly && isFloat(bodyContent)) {
                throw Error(ERRORS.NUMBER_NOT_INTEGER);
            }

            if (limit?.min != null && bodyContent < limit.min) {
                throw Error(ERRORS.NUMBER_TOO_SMALL(limit.min));
            }

            if (limit?.max != null && bodyContent > limit.max) {
                throw Error(ERRORS.NUMBER_TOO_BIG(limit.max));
            }
        }

        if (replyMsg.reply.bodyType === "datetime") {
            const bodyContent = params.body.content as Date;
            const limit = replyMsg.reply.bodyLimits as DatetimeLimits;
            msg.body.content = bodyContent;

            if (limit?.min != null && bodyContent.getTime() < limit.min.getTime()) {
                throw Error(ERRORS.DATE_TOO_OLD(limit.min));
            }

            if (limit?.max != null && bodyContent.getTime() > limit.max.getTime()) {
                throw Error(ERRORS.DATE_TOO_EARLY(limit.max));
            }
        }

        if (replyMsg.reply.bodyType === "option") {
            const bodyContent = msg.body.content as string;
            const limit = replyMsg.reply.bodyLimits as OptionLimits;
            const existingOption = limit?.options?.find((opt) => opt?.value === bodyContent);
            if (!existingOption) {
                throw Error(ERRORS.OPTION_NOT_EXIST);
            }
        }

        if (replyMsg.reply.bodyType === "options") {
            const bodyContent = msg.body.content as string[];
            const limit = replyMsg.reply.bodyLimits as OptionsLimits;

            if (limit?.maxAmount != null && bodyContent.length > limit.maxAmount) {
                throw Error(ERRORS.TOO_MANY_OPTIONS(limit.maxAmount));
            }

            for (const option of bodyContent) {
                const existingOption = limit?.options?.find((lopt) => lopt?.value === option);
                if (!existingOption) {
                    throw Error(ERRORS.OPTION_NOT_EXIST);
                }
            }
        }

        if (replyMsg.reply.bodyType === "file") {
            const bodyContent = msg.body.content as FileMeta;
            const limit = replyMsg.reply.bodyLimits as FileLimits;
            this.checkFileDataLimit(limit, bodyContent);
        }

        if (replyMsg.reply.bodyType === "files") {
            const bodyContent = msg.body.content as FileMeta[];
            const limit = replyMsg.reply.bodyLimits as FilesLimits;
            if (limit?.maxAmount != null && bodyContent.length > limit.maxAmount) {
                throw Error(ERRORS.TOO_MANY_FILES(limit.maxAmount));
            }

            for (const file of bodyContent) {
                this.checkFileDataLimit(limit, file);
            }
        }

        return msg;
    }
    validateUserMessageParams(input: any, senderID: string): CreateUserMessageParams {
        if (!isPlainObject(input)) throw Error(ERRORS.INPUT_NOT_OBJECT);
        const params = structuredClone(input);

        if (!("chatID" in input) || typeof input.chatID !== "string") throw Error(ERRORS.CHAT_ID_STRING);
        if (!("body" in input) || !isPlainObject(input.body)) throw Error(ERRORS.BODY_NOT_OBJECT);
        if (!("type" in input.body) || typeof input.body.type !== "string") throw Error(ERRORS.BODY_TYPE_STRING);
        if (!("content" in input.body)) throw Error(ERRORS.BODY_CONTENT_REQUIRED);
        if ("replyTo" in input && typeof input.replyTo !== "string") throw Error(ERRORS.REPLY_TO_STRING);
        if (!allowedUserMessageBodyTypes.includes(input.body.type)) throw Error(ERRORS.BODY_TYPE_NOT_ALLOWED);

        if (input.body.type === "text") {
            if (typeof input.body.content !== "string") throw Error(ERRORS.INVALID_BODY_CONTENT);
        }
        if (input.body.type === "number") {
            if (typeof input.body.content !== "number") throw Error(ERRORS.INVALID_BODY_CONTENT);
        }
        if (input.body.type === "boolean") {
            if (typeof input.body.content !== "boolean") throw Error(ERRORS.INVALID_BODY_CONTENT);
        }
        if (input.body.type === "datetime") {
            if (typeof input.body.content !== "string") throw Error(ERRORS.INVALID_BODY_CONTENT);
            if (isNaN(new Date(input.body.content)?.getTime())) throw Error(ERRORS.INVALID_BODY_CONTENT);
            params.body.content = new Date(input.body.content);
        }
        if (input.body.type === "option") {
            if (typeof input.body.content !== "string") throw Error(ERRORS.INVALID_BODY_CONTENT);
        }
        if (input.body.type === "options") {
            if (!Array.isArray(input.body.content)) throw Error(ERRORS.INVALID_BODY_CONTENT);
            params.body.content = input.body.content.map(String);
        }
        if (input.body.type === "file") {
            if (!isPlainObject(input.body.content)) throw Error(ERRORS.INVALID_BODY_CONTENT);
            if (!("id" in input.body.content)) throw Error(ERRORS.INVALID_BODY_CONTENT);
            if (typeof input.body.content.id !== "string") throw Error(ERRORS.INVALID_BODY_CONTENT);
        }
        if (input.body.type === "files") {
            if (!Array.isArray(input.body.content)) throw Error(ERRORS.INVALID_BODY_CONTENT);
            for (const item of input.body.content) {
                if (!isPlainObject(item)) throw Error(ERRORS.INVALID_BODY_CONTENT);
                if (!("id" in item)) throw Error(ERRORS.INVALID_BODY_CONTENT);
                if (typeof item.id !== "string") throw Error(ERRORS.INVALID_BODY_CONTENT);
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
            if (!isValidMime) throw Error(ERRORS.MIME_NOT_ALLOWED);
        }

        if (limit?.maxSize != null && filemeta.size > limit.maxSize) {
            throw Error(ERRORS.FILE_TOO_LARGE(bytesToMB(limit.maxSize)));
        }
    }
}

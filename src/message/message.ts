import { FileMeta } from "../file/file";
import { bytesToMB, isFloat } from "../utils/number";
import { randomUUID } from "../utils/random";
import {
    DatetimeLimits,
    MessageBody,
    NumberLimits,
    ReplyRestriction,
    Option,
    OptionLimits,
    SystemMessageBody,
    TextLimits,
    UserMessageBody,
    OptionsLimits,
    FileLimits,
    FilesLimits,
} from "./types";

export interface Message {
    id: string;
    chatID: string;
    senderID: string;
    replyTo?: string;
    threadID: string;
    scene?: string;
    step?: string;
    body: MessageBody;
    replyRestriction?: ReplyRestriction;
    createdAt: Date;
}

export interface MessageDatabase {
    addMessage(msg: Message): Promise<void>;
    getMessageByID(id: string): Promise<Message | null>;
    getMessagesByIDs(ids: string[]): Promise<Message[]>;
    getMessagesByChatID(chatID: string, page: number, limit: number): Promise<Message[]>;
    deleteOldMessages(maxDate: Date): Promise<number>;
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
export type CreateUserMessageParams = Pick<CreateMessageParams, "chatID" | "senderID" | "body"> & {
    body: UserMessageBody;
};

export const SYSTEM_SENDER_ID = "system";

export const createSystemMessage = (params: CreateSystemMessageParams, userMsg?: Message): Message => {
    if (!userMsg && !params.chatID) {
        throw new Error("chatID is required when user message is not provided");
    }

    return {
        id: randomUUID(),
        senderID: SYSTEM_SENDER_ID,
        ...params,
        threadID: userMsg ? userMsg.threadID : randomUUID(),
        replyTo: userMsg?.id,
        chatID: userMsg ? userMsg.chatID : params.chatID!,
        createdAt: new Date(),
    };
};

export const createUserMessage = (params: CreateUserMessageParams, replyMsg?: Message): Message => {
    let msg: Message = {
        id: randomUUID(),
        ...params,
        threadID: replyMsg?.threadID || randomUUID(),
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
            throw Error(`The message body is too long. It should be no more than ${limit.maxLength} characters long.`);
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
        const bodyContent = msg.body.content as Option;
        const limit = replyMsg.replyRestriction.bodyLimits as OptionLimits;
        const existingOption = limit?.options?.find((opt) => opt?.value === bodyContent.value);
        if (!existingOption) {
            throw Error("The specified option does not exist.");
        }
    }

    if (replyMsg.replyRestriction.bodyType === "options") {
        const bodyContent = msg.body.content as Option[];
        const limit = replyMsg.replyRestriction.bodyLimits as OptionsLimits;

        if (limit?.maxAmount != null && bodyContent.length > limit.maxAmount) {
            throw Error(`Too many options. The maximum allowed is ${limit.maxAmount}`);
        }

        for (const option of bodyContent) {
            const existingOption = limit?.options?.find((lopt) => lopt?.value === option.value);
            if (!existingOption) {
                throw Error("The specified option does not exist.");
            }
        }
    }

    if (replyMsg.replyRestriction.bodyType === "file") {
        const bodyContent = msg.body.content as FileMeta;
        const limit = replyMsg.replyRestriction.bodyLimits as FileLimits;
        checkFileDataLimit(limit, bodyContent);
    }

    if (replyMsg.replyRestriction.bodyType === "files") {
        const bodyContent = msg.body.content as FileMeta[];
        const limit = replyMsg.replyRestriction.bodyLimits as FilesLimits;
        if (limit?.maxAmount != null && bodyContent.length > limit.maxAmount) {
            throw Error(`Too many files. The maximum allowed is ${limit.maxAmount}`);
        }

        for (const file of bodyContent) {
            checkFileDataLimit(limit, file);
        }
    }

    return msg;
};

function checkFileDataLimit(limit: FileLimits, filemeta: FileMeta) {
    if (limit?.mimeTypes && limit.mimeTypes.length) {
        const isValidMime = limit.mimeTypes.includes(filemeta.mimeType);
        if (!isValidMime) throw Error("MIME type not allowed.");
    }

    if (limit?.maxSize != null && filemeta.size > limit.maxSize) {
        throw Error(`Too large file. The maximum allowed size is ${bytesToMB(limit.maxSize)} MB.`);
    }
}

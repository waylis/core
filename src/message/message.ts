import { MessageBody, ReplyRestriction } from "./types";

export interface Message {
    id: string;
    chatID: string;
    senderID: string;
    replyTo?: string;
    threadID: string;
    sceneKey?: string;
    stepKey?: string;
    body: MessageBody;
    replyRestriction?: ReplyRestriction;
    createdAt: Date;
}

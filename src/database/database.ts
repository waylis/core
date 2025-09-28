import { ChatDatabase } from "../chat/chat";
import { FileDatabase } from "../file/file";
import { MessageDatabase } from "../message/message";
import { ConfirmedStepDatabase } from "../scene/step";

/** Unified database interface combining chats, messages, confirmed steps, and files. */
export interface Database extends ChatDatabase, MessageDatabase, ConfirmedStepDatabase, FileDatabase {
    isOpen: boolean;
    close: () => Promise<void>;
    open: () => Promise<void>;
}

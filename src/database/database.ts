import { ChatDatabase } from "../chat/chat";
import { FileDatabase } from "../file/file";
import { MessageDatabase } from "../message/message";
import { ConfirmedStepDatabase } from "../scene/step";

/** Unified database interface combining chats, messages, confirmed steps, and files. */
export type Database = ChatDatabase &
    MessageDatabase &
    ConfirmedStepDatabase &
    FileDatabase & {
        isOpen: boolean;
        open(): Promise<void>;
        close(): Promise<void>;
    };

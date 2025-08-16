import { ChatDatabase } from "../chat/chat";
import { FileDatabase } from "../file/file";
import { MessageDatabase } from "../message/message";
import { ConfirmedStepDatabase } from "../scene/step";

export type Database = ChatDatabase &
    MessageDatabase &
    ConfirmedStepDatabase &
    FileDatabase & {
        isOpen: boolean;
        open(): Promise<void>;
        close(): Promise<void>;
    };

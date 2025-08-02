import { ChatDatabase } from "../chat/chat";
import { MessageDatabase } from "../message/message";
import { ConfirmedStepDatabase } from "../scene/step";

export type Database = ChatDatabase &
    MessageDatabase &
    ConfirmedStepDatabase & {
        open(): Promise<void>;
        close(): Promise<void>;
    };

import { ChatStorage } from "../chat/chat";
import { MessageStorage } from "../message/message";
import { ConfirmedStepStorage } from "../scene/step";

export type Storage = ChatStorage &
    MessageStorage &
    ConfirmedStepStorage & {
        open(): Promise<void>;
        close(): Promise<void>;
    };

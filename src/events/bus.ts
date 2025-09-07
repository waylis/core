import { EventEmitter } from "node:events";
import { Message } from "../message/message";

export interface AppEvents {
    newUserMessage: Message;
    newSystemResponse: { userID: string; response: Message | Message[] };
}

class EventBusClass extends EventEmitter {
    emit<K extends keyof AppEvents>(eventName: K, payload: AppEvents[K]): boolean {
        return super.emit(eventName, payload);
    }

    on<K extends keyof AppEvents>(eventName: K, listener: (payload: AppEvents[K]) => void): this {
        return super.on(eventName, listener);
    }

    off<K extends keyof AppEvents>(eventName: K, listener: (payload: AppEvents[K]) => void): this {
        return super.off(eventName, listener);
    }
}

export type EventBus = EventBusClass;
export const eventBus = new EventBusClass();

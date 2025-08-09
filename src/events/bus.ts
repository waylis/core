import { EventEmitter } from "node:events";
import { Message } from "../message/message";

interface AppEvents {
    newUserMessage: Message;
    newSystemMessage: { userID: string; msg: Message };
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

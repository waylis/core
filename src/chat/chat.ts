import { randomUUID } from "../utils/random";

export interface Chat {
    id: string;
    name: string;
    creatorID: string;
    createdAt: Date;
}

export const createChat = (name: string, creatorID: string): Chat => {
    return {
        id: randomUUID(),
        name,
        creatorID,
        createdAt: new Date(),
    };
};

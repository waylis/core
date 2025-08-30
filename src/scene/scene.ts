import { MessageBodyMap, SystemMessageBody } from "../message/types";
import { SceneStep } from "./step";

export type SceneResponsesMap<Steps extends readonly SceneStep[]> = {
    [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? MessageBodyMap[T] : never;
};

export interface Scene<Steps extends readonly [...SceneStep[]]> {
    steps: Steps;
    handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody | SystemMessageBody[]>;
}

export const createScene = <Steps extends readonly SceneStep<any, any>[]>(config: {
    steps: [...Steps];
    handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody | SystemMessageBody[]>;
}): Scene<Steps> => {
    return config;
};

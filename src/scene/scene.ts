import { MessageBodyMap, SystemMessageBody } from "../message/types";
import { SceneStep } from "./step";

type SceneResponsesMap<Steps extends readonly SceneStep[]> = {
    [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? MessageBodyMap[T] : never;
};

export interface Scene<Steps extends readonly [...SceneStep[]]> {
    key: string;
    steps: Steps;
    handler: (responses: SceneResponsesMap<Steps>) => SystemMessageBody;
}

export function createScene<Steps extends readonly SceneStep<any, any>[]>(config: {
    key: string;
    steps: [...Steps];
    handler: (responses: SceneResponsesMap<Steps>) => SystemMessageBody;
}): Scene<Steps> {
    return config;
}

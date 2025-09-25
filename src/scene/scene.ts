import { MessageBodyMap, SystemMessageBody } from "../message/types";
import { SceneStep } from "./step";

/** Maps scene steps to their expected response body content. */
export type SceneResponsesMap<Steps extends readonly SceneStep[]> = {
    [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? MessageBodyMap[T] : never;
};

/** Represents an interactive scene composed of multiple steps. */
export interface Scene<Steps extends readonly [...SceneStep[]]> {
    /** Steps that define the scene flow. */
    steps: Steps;

    /**
     * Handler executed after all steps are completed.
     * @param responses Collected responses from the steps.
     * @returns One or more system messages to output.
     */
    handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody | SystemMessageBody[]>;
}

/**
 * Create a new scene definition.
 * @param config Scene configuration including steps and handler.
 * @returns A scene instance.
 */
export const createScene = <Steps extends readonly SceneStep<any, any>[]>(config: {
    steps: [...Steps];
    handler: (responses: SceneResponsesMap<Steps>) => Promise<SystemMessageBody | SystemMessageBody[]>;
}): Scene<Steps> => {
    return config;
};

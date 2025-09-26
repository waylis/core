import { UserMessageBodyType, SystemMessageBody, ReplyRestriction, MessageBodyMap } from "../message/types";
import { createSortableIdGenerator } from "../utils/random";

/** Represents a confirmed step in a scene flow. */
export interface ConfirmedStep {
    /** Unique identifier of the confirmed step. */
    id: string;
    /** Thread the step belongs to. */
    threadID: string;
    /** Message that triggered the confirmation. */
    messageID: string;
    /** Scene identifier. */
    scene: string;
    /** Step key within the scene. */
    step: string;
    /** Timestamp when the step was confirmed. */
    createdAt: Date;
}

/** Defines a single step in a scene. */
export interface SceneStep<K extends string = string, T extends UserMessageBodyType = UserMessageBodyType> {
    /** Unique key identifying the step. */
    key: K;
    /** Prompt message shown to the user. */
    prompt: SystemMessageBody;
    /** Restriction on expected reply. */
    reply: ReplyRestriction<T>;

    /**
     * Optional handler to process (validate) the user's reply.
     * @param body Message body matching the reply restriction type.
     * @returns Optional system message response if processing (validation) fails.
     */
    handler?: (body: MessageBodyMap[T]) => Promise<SystemMessageBody | void>;
}

/** Abstraction for confirmed step persistence. */
export interface ConfirmedStepDatabase {
    /**
     * Store a confirmed step.
     * @param step Step to add.
     */
    addConfirmedStep(step: ConfirmedStep): Promise<void>;

    /**
     * Retrieve all confirmed steps belonging to a thread.
     * @param threadID Thread identifier.
     */
    getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]>;

    /**
     * Delete all confirmed steps created before a given date.
     * @param maxDate Cutoff date.
     * @returns Number of deleted steps.
     */
    deleteOldConfirmedSteps(maxDate: Date): Promise<number>;
}

export const SCENE_STEP_KEY_MIN_LEN = 1;
export const SCENE_STEP_KEY_MAX_LEN = 32;
export const SCENE_STEP_KEY_ALLOWED_SYMBOLS = /^[a-zA-Z0-9_]+$/;

export class StepManager {
    constructor(private generateID: () => string = createSortableIdGenerator()) {}

    createConfirmedStep(params: Omit<ConfirmedStep, "id" | "createdAt">): ConfirmedStep {
        return { id: this.generateID(), ...params, createdAt: new Date() };
    }
}

/**
 * Create a new scene step, validating its key format and length.
 * @param step Step configuration.
 * @throws If the step key is invalid.
 * @returns The validated step.
 */
export const createStep = <K extends string, T extends UserMessageBodyType>(step: SceneStep<K, T>): SceneStep<K, T> => {
    if (step.key.length < SCENE_STEP_KEY_MIN_LEN || step.key.length > SCENE_STEP_KEY_MAX_LEN) {
        const msg = `"${step.key}" - Invalid step key length. Must be from ${SCENE_STEP_KEY_MIN_LEN} to ${SCENE_STEP_KEY_MAX_LEN}.`;
        throw Error(msg);
    }

    if (!SCENE_STEP_KEY_ALLOWED_SYMBOLS.test(step.key)) {
        const msg = `"${step.key}" - Invalid step key format. Only letters (a-z, A-Z), numbers (0-9), and underscores (_) are allowed.`;
        throw Error(msg);
    }

    return step;
};

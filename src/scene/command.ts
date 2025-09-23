/**
 * Represents a command that can trigger a scene.
 */
export interface Command {
    /**
     * The unique identifier or value of the command.
     */
    value: string;
    /**
     * A human-readable label for the command.
     */
    label?: string;
    /**
     * A short description explaining what the command does.
     */
    description?: string;
}

export const COMMAND_VALUE_MIN_LEN = 1;
export const COMMAND_VALUE_MAX_LEN = 32;
export const COMMAND_LABEL_MAX_LEN = 64;
export const COMMAND_DESCR_MAX_LEN = 512;
export const COMMAND_ALLOWED_SYMBOLS = /^[a-z0-9_]+$/;

/**
 * Create a new `Command` object.
 *
 * This function is a simple factory for creating `Command` instances,
 * ensuring the object matches the expected interface and restrictions.
 *
 * @param params - The parameters for the command.
 * @returns The newly created `Command` object.
 *
 * @example
 * ```ts
 * const myCommand = createCommand({
 *   value: "start",
 *   label: "Start",
 *   description: "Start the main scene."
 * });
 * ```
 */
export const createCommand = (params: Command): Command => {
    const { value, label, description } = params;

    if (value.length < COMMAND_VALUE_MIN_LEN || value.length > COMMAND_VALUE_MAX_LEN) {
        throw Error(
            `"${value}" - Invalid command value length. Must be from ${COMMAND_VALUE_MIN_LEN} to ${COMMAND_VALUE_MAX_LEN} characters.`
        );
    }

    if (label && label.length > COMMAND_LABEL_MAX_LEN) {
        throw Error(`"${value}" - Invalid command label length. Must not exceed ${COMMAND_LABEL_MAX_LEN} characters.`);
    }

    if (description && description.length > COMMAND_DESCR_MAX_LEN) {
        throw Error(
            `"${value}" - Invalid command description length. Must not exceed ${COMMAND_DESCR_MAX_LEN} characters.`
        );
    }

    if (!COMMAND_ALLOWED_SYMBOLS.test(value)) {
        throw Error(
            `"${value}" - Invalid command value format. Only lowercase letters (a-z), numbers (0-9), and underscores (_) are allowed.`
        );
    }

    return { value, label, description };
};

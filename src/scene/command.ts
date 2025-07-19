export interface Command {
    value: string;
    label?: string;
    description?: string;
}

const MIN_VALUE_LEN = 1;
const MAX_VALUE_LEN = 16;
const MAX_LABEL_LEN = 64;
const MAX_DESCR_LEN = 512;

export const createCommand = (params: Command): Command => {
    const {value, label, description} = params
    
    if (value.length < MIN_VALUE_LEN && value.length > MAX_VALUE_LEN) {
        throw Error(`Wrong command value length, must be from ${MIN_VALUE_LEN} to ${MAX_VALUE_LEN} characters.`)
    }

    if (label && label.length > MAX_LABEL_LEN) {
        throw Error(`Wrong command label length, must not exceed ${MAX_LABEL_LEN} characters.`)
    }

    if (description && description.length > MAX_DESCR_LEN) {
        throw Error(`Wrong command description length, must not exceed ${MAX_DESCR_LEN} characters.`)
    }

    return {value, label, description}
}
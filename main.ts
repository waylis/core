export interface Command {
    value: string;
    label?: string;
}

export interface Attachment {
    id: string;
    path: string;
    name: string;
    size: number;
    mimeType: string;
}

export interface SelectValue {
    value: string;
    label?: string;
}

export enum MessageBodyType {
    command = 1,
    text,
    number,
    boolean,
    attachment,
    attachments,
    selectValue,
    selectValues,
    datetime,
    markdown,
}

export type MessageBody =
    | { type: MessageBodyType.command; content: string }
    | { type: MessageBodyType.text; content: string }
    | { type: MessageBodyType.number; content: number }
    | { type: MessageBodyType.boolean; content: boolean }
    | { type: MessageBodyType.attachment; content: Attachment }
    | { type: MessageBodyType.attachments; content: Attachment[] }
    | { type: MessageBodyType.selectValue; content: SelectValue }
    | { type: MessageBodyType.selectValues; content: SelectValue[] }
    | { type: MessageBodyType.datetime; content: Date }
    | { type: MessageBodyType.markdown; content: string };

export type MessageBodyMap = {
    [MessageBodyType.command]: string;
    [MessageBodyType.text]: string;
    [MessageBodyType.number]: number;
    [MessageBodyType.boolean]: boolean;
    [MessageBodyType.attachment]: Attachment;
    [MessageBodyType.attachments]: Attachment[];
    [MessageBodyType.selectValue]: SelectValue;
    [MessageBodyType.selectValues]: SelectValue[];
    [MessageBodyType.datetime]: Date;
    [MessageBodyType.markdown]: string;
};

export interface TextLimits {
    minLength: number;
    maxLength: number;
}

export interface NumberLimits {
    min: number;
    max: number;
    integerOnly: boolean;
}

export interface AttachmentLimits {
    mimeTypes: string[];
    maxSize: number;
}

export type AttachmentsLimits = AttachmentLimits & { maxAmount: number };

export interface SelectValueLimits {
    options: SelectValue[];
}

export interface SelectValuesLimits {
    options: SelectValue[];
    maxAmount: number;
}

export interface DatetimeLimits {
    min?: Date;
    max?: Date;
}

export type ReplyRestriction<T extends MessageBodyType = MessageBodyType> = {
    bodyType: T;
    bodyLimits?: T extends MessageBodyType.text
        ? TextLimits
        : T extends MessageBodyType.number
        ? NumberLimits
        : T extends MessageBodyType.attachment
        ? AttachmentLimits
        : T extends MessageBodyType.attachments
        ? AttachmentsLimits
        : T extends MessageBodyType.selectValue
        ? SelectValueLimits
        : T extends MessageBodyType.selectValues
        ? SelectValuesLimits
        : T extends MessageBodyType.datetime
        ? DatetimeLimits
        : never;
};

export interface Chat {
    id: string;
    name: string;
    creatorID: string; // Уникальный идентификатор пользоватателя, создавшего чат
    createdAt: Date;
}

export interface Message {
    id: string;
    chatID: string;
    senderID: string; // Уникальный идентификатор отправителя (null - система)
    replyTo?: string; // ID системного сообщения к которому данное сообщение является ответом
    threadID: string; // ID диалога (связанного списка сообщений - диалога)
    sceneIndex?: number; // Порядковый номер сцены
    stepIndex?: number; // Порядковый номер шага сцены
    body: MessageBody;
    replyRestriction?: ReplyRestriction; // Ограничения на ответ, который должен предоставить пользователь
    createdAt: Date;
}

export type SystemMessageBody = Extract<
    MessageBody,
    { type: MessageBodyType.text } | { type: MessageBodyType.markdown }
>;

export type UserMessageBodyType = Exclude<MessageBodyType, MessageBodyType.command | MessageBodyType.markdown>;

export interface SceneStep<K extends string = string, T extends UserMessageBodyType = UserMessageBodyType> {
    key: K;
    prompt: SystemMessageBody;
    replyRestriction: ReplyRestriction<T>;
    handler: (body: MessageBodyMap[T]) => SystemMessageBody;
}

export type SceneResponsesMap<Steps extends readonly SceneStep[]> = {
    [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? MessageBodyMap[T] : never;
};

export interface Scene<
    Cmds extends readonly Command[] = Command[],
    Steps extends readonly SceneStep[] = readonly SceneStep[]
> {
    key: string;
    trigger: Cmds[number]["value"];
    steps: Steps;
    handler: (responses: SceneResponsesMap<Steps>) => SystemMessageBody;
}

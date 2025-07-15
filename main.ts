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

export type MessageBody = string | number | boolean | Attachment | Attachment[] | SelectValue | SelectValue[] | Date;

export interface TextLimits {
    minLength: number;
    maxLength: number;
}

export interface NumberLimits {
    min: number;
    max: number;
    intOnly: boolean;
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

export type Commands = Record<string, { label?: string; description?: string }>;

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

export interface Chat {
    id: string;
    name: string;
    userID: string; // Уникальный идентификатор пользоватателя, создавшего чат
}

export interface Message {
    id: string;
    sceneID: string; // ID текущей сцены (связанного списка сообщений - диалога)
    chatID: string;
    userID?: string; // Уникальный идентификатор отправителя (null - система)
    replyFor?: string; // ID системного сообщения к которому данное сообщение является ответом
    sceneKey?: string; // Ключ сцены
    stepKey?: string; // Ключ шага сцены
    bodyType: MessageBodyType; // Тип данных которые содержаться в body
    body: string; // строка которая может быть приведена к конкретному типу в зависимости от bodyType
    replyRestriction?: ReplyRestriction; // Ограничения на ответ, который должен предоставить пользователь
    createdAt: number;
}

export type ReplyRestriction =
    | {
          bodyType: MessageBodyType.command;
      }
    | {
          bodyType: MessageBodyType.text;
          bodyLimits?: TextLimits;
      }
    | {
          bodyType: MessageBodyType.number;
          bodyLimits?: NumberLimits;
      }
    | {
          bodyType: MessageBodyType.boolean;
      }
    | {
          bodyType: MessageBodyType.attachment;
          bodyLimits: AttachmentLimits;
      }
    | {
          bodyType: MessageBodyType.attachments;
          bodyLimits: AttachmentsLimits;
      }
    | {
          bodyType: MessageBodyType.selectValue;
          bodyLimits: SelectValueLimits;
      }
    | {
          bodyType: MessageBodyType.selectValues;
          bodyLimits: SelectValuesLimits;
      }
    | {
          bodyType: MessageBodyType.datetime;
          bodyLimits?: DatetimeLimits;
      };

// interface SceneStep<Key extends string = string, Input extends UserMessageBody> {
//     key: Key;
//     prompt: UserMessageBody;
//     handler?: (input: Input) => Promise<UserMessageBody | void>;
// }

// type ExtractAnswers<Steps extends readonly SceneStep[]> = {
//     [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? T : never;
// };

// interface SceneDefinition<SceneSteps extends readonly SceneStep[]> {
//     command: SceneTrigger;
//     steps: SceneSteps;
//     onComplete: (answers: ExtractAnswers<SceneSteps>) => string;
// }

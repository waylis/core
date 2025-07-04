enum UserMessageBodyType {
    command = 1,
    text,
    number,
    boolean,
    attachment,
    attachments,
    selectValue,
    selectValues,
    datetime,
}

enum SystemMessageBodyType {
    text = 1,
    markdown,
}

type UserMessageBody = string | number | boolean | Attachment | Attachment[] | SelectValue | SelectValue[] | Date;
type SystemMessageBody = string;

interface TextLimits {
    minLength: number;
    maxLength: number;
}

interface NumberLimits {
    min: number;
    max: number;
    intOnly: boolean;
}

interface AttachmentLimits {
    mimeTypes: string[];
    maxSize: number;
}

type AttachmentsLimits = AttachmentLimits & { maxAmount: number };

interface SelectValueLimits {
    options: SelectValue[];
}

type SelectValuesLimits = SelectValue & { maxAmount: number };

interface DatetimeLimits {
    min?: Date;
    max?: Date;
}

type Commands = Record<string, { label?: string; description?: string }>;

interface Attachment {
    id: string;
    path: string;
    name: string;
    size: number;
    mimeType: string;
}

interface SelectValue {
    value: string;
    label?: string;
}

interface Chat {
    id: string;
    name: string;
    userID: string; // Уникальный идентификатор пользоватателя, создавшего чат
}

interface UserMessage {
    id: string;
    chatID: string;
    userID: string; // Уникальный идентификатор отправителя
    bodyType: UserMessageBodyType; // Тип данных которые содержаться в body
    body: string; // JSON строка которая может быть приведена к конкретному типу в зависимости от bodyType
    createdAt: number;
}

type ReplyRestriction =
    | {
          allowedBodyType: UserMessageBodyType.command;
      }
    | {
          allowedBodyType: UserMessageBodyType.text;
          bodyLimits?: TextLimits;
      }
    | {
          allowedBodyType: UserMessageBodyType.number;
          bodyLimits?: NumberLimits;
      }
    | {
          allowedBodyType: UserMessageBodyType.boolean;
      }
    | {
          allowedBodyType: UserMessageBodyType.attachment;
          bodyLimits: AttachmentLimits;
      }
    | {
          allowedBodyType: UserMessageBodyType.attachments;
          bodyLimits: AttachmentsLimits;
      }
    | {
          allowedBodyType: UserMessageBodyType.selectValue;
          bodyLimits: SelectValueLimits;
      }
    | {
          allowedBodyType: UserMessageBodyType.selectValues;
          bodyLimits: SelectValuesLimits;
      }
    | {
          allowedBodyType: UserMessageBodyType.datetime;
          bodyLimits?: DatetimeLimits;
      };

interface SystemMessage {
    id: string;
    chatID: string;
    bodyType: SystemMessageBodyType; // Тип данных которые содержаться в body
    body: SystemMessageBody; // JSON строка которая может быть приведена к конкретному типу в зависимости от bodyType
    attachments?: Attachment[]; // Список файлов прикрепленных к сообщению
    replyRestriction?: ReplyRestriction;
    createdAt: number;
}

const scene = {
    trigger: "start",
    steps: [{}],
    handler: () => {},
};

console.log(scene);

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

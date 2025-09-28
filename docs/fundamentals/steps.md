# Steps

Steps are the building blocks of [scenes](/fundamentals/scenes). Each step asks the user for some data and validates it.

## Basic usage

You create a step using [`createStep`](/api/functions/createStep):

```ts
import { createStep } from "@waylis/core";
```

```ts
const ageStep = createStep({
    key: "age",
    prompt: { type: "text", content: "How old are you?" },
    reply: { bodyType: "number" },
    handler: async (age) => {
        if (age < 18) {
            return { type: "text", content: "You must be at least 18." };
        }
    },
});
```

-   `key` (required) — Unique identifier of the step (used in main scene handler).
    -   must be 1–32 characters
    -   allowed: lowercase letters (a-z), numbers (0-9), underscores (\_)
-   `prompt` (required) — The message/question sent to the user. See [system responses](/fundamentals/scenes#system-responses).
-   [`reply`](/api/interfaces/ExpectedReply) (required) — Defines which type of response is allowed and restriction for it.
-   [`handler`](/api/interfaces/SceneStep#handler) (optional) — Async function called immediately after the user responds. Used for custom validation.

## Expected reply

The `reply` defines what type of user response is expected and applies optional validation rules.

Supported [`bodyType`](/api/type-aliases/UserMessageBodyType) values:

| Type       | Description                             |
| ---------- | --------------------------------------- |
| `text`     | plain text                              |
| `number`   | numeric input                           |
| `boolean`  | true / false (yes or no)                |
| `datetime` | a date with time                        |
| `option`   | one option from a predefined list       |
| `options`  | multiple options from a predefined list |
| `file`     | a single file                           |
| `files`    | multiple files                          |

Some body types supports [`bodyLimits`](/api/type-aliases/MessageBodyLimitsMap) object for basic auto validation:

```ts
reply: {
  bodyType: "text",
  bodyLimits: { minLength: 2, maxLength: 50 }
}
```

```ts
reply: {
  bodyType: "number",
  bodyLimits: { min: 0, max: 100, integerOnly: true }
}
```

```ts
reply: {
  bodyType: "file",
  bodyLimits: {
    mimeTypes: ["application/json",],
    maxSize: 1_000_000 // 1 MB
  }
}
```

```ts
reply: {
  bodyType: "files",
  bodyLimits: {
    maxAmount: 3,
    mimeTypes: ["image/png", "image/jpeg"],
    maxSize: 2_000_000 // 2 MB
  }
}
```

```ts
reply: {
  bodyType: "option",
  bodyLimits: {
    options: [
      { value: "paris", label: "France, Paris" },
      { value: "berlin", label: "Germany, Berlin" },
      { value: "warsaw", label: "Poland, Warsaw" }
    ],
  }
}
```

```ts
reply: {
  bodyType: "options",
  bodyLimits: {
    options: [
      { value: "red", label: "Red" },
      { value: "green", label: "Green" },
      { value: "blue", label: "Blue" }
    ],
    maxAmount: 2
  }
}
```

::: tip

See the full [API Reference](/api/type-aliases/MessageBodyLimitsMap) for better understaning.

:::

## Handler

Each step may have its own handler, which is executed right after the user submits a valid reply. It gives you a chance to process or react to the input before moving to the next step.

```ts
handler: async (username) => {
    if (!username.match(/^[a-z]+$/i)) {
        return { type: "text", content: "Only letters are allowed." };
    }
};
```

The handler receives the parsed and validated response from the user. If `bodyType` is _number_, the handler receives a number primitive. If `bodyType` is _file_, it receives a [FileMeta](/api/interfaces/FileMeta) object. See all type matches in the [reference](/api/type-aliases/MessageBodyMap).

The handler can return:

-   nothing (void) — step is accepted, scene continues to the next step.
-   a [system response](/fundamentals/scenes#system-responses) — that sent immediately back to the user and re-requesting data for the current step.

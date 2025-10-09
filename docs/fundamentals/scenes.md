# Scenes

A Scene is a complete conversation flow. It can combine multiple steps into a sequence and defines what happens when all the required data is collected.

You define a scene using [`createScene`](/api/functions/createScene):

```ts
import { createScene, createStep } from "@waylis/core";
```

```ts
const nameStep = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    reply: { bodyType: "text" },
});

const ageStep = createStep({
    key: "age",
    prompt: { type: "text", content: "How old are you?" },
    reply: { bodyType: "number" },
});

const scene = createScene({
    steps: [nameStep, ageStep],
    handler: async (answers) => {
        return {
            type: "text",
            content: `Hello ${answers.name}, your age is ${answers.age}`,
        };
    },
});
```

-   `steps` (required) — An ordered list of [steps](/fundamentals/steps). Each step runs sequentially. Collected answers are stored by their key.
-   `handler` (required) — A function called after all steps are complete.

## Handlers

The handlers always returns [system responses](#system-responses), which are shown to the user.

```ts
handler: async (answers) => {
    await yourCustomLogic(answers);
    return { type: "text", content: "Registration complete!" };
},
```

It also support for multiple responses at once if you need to send a reply with a different types (e.g., _text_ + _file_).

```ts
handler: async (answers) => {
    const pdfFile = await yourCustomLogic(answers);
    return [
        { type: "text", content: "Thanks for your answers!" },
        { type: "file", content: pdfFile },
    ];
},
```

## System responses

Inside the [scene handler](#handlers), you must return a [`SystemMessageBody`](/api/type-aliases/SystemMessageBody). Exactly the same system message must be returned inside the `prompt` and `handler` from [steps](/fundamentals/steps).

Each response consists of a `type` field and a corresponding `content` field (all correspondences can be found [here](/api/type-aliases/MessageBodyMap)).

The `type` values available for system responses are shown below:

| Type                                     | Description                        |
| ---------------------------------------- | ---------------------------------- |
| `text`                                   | plain text                         |
| `markdown`                               | text formated as markdown          |
| [`file`](/api/interfaces/FileMeta)       | a single file                      |
| [`files`](/api/interfaces/FileMeta)      | multiple files                     |
| [`table`](/api/interfaces/Table)         | simple talbe with columns and rows |
| [`linechart`](/api/interfaces/LineChart) | configurable line chart            |

Text response example:

```ts
return {
    type: "text",
    content: "This is simple text response!",
};
```

Markdown response example:

```ts
return {
    type: "markdown",
    content: "This is **simple** markdown _response_!",
};
```

::: tip

Under the hood, markdown rendered by [react-markdown](https://www.npmjs.com/package/react-markdown) package and [remark-gfm](https://www.npmjs.com/package/remark-gfm) plugin on the frontend side.
:::

Single file response example:

```ts
const data = Buffer.from("hello world");
const file = await fileManager.uploadFile(data, {
    name: "text.txt",
    size: data.length,
});

return { type: "file", content: file };
```

:::tip
_file_ and _files_ types are described in detail [here](/guides/files).
:::

Table response example:

```ts
const head = ["Header 1", "Header 2"];
const body = [
    [1, "hello"],
    [2, "world"],
    [3, "again"],
];

return { type: "table", content: { head, body } };
```

Line chart response example:

```ts
const data = [
    { day: "Mar 22", price: 5 },
    { day: "Mar 23", price: 7 },
    { day: "Mar 24", price: 4 },
    { day: "Mar 25", price: 2 },
    { day: "Mar 26", price: 6 },
];

const series = [{ name: "price", color: "blue.6" }];

return {
    type: "linechart",
    content: { data, dataKey: "day", series, curveType: "linear" },
};
```

:::tip
You can also find [_linechart_](/examples#send-line-chart) and [_table_](/examples#send-table) types in the examples.
:::

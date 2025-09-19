# Examples

Here you will find many examples for working with different data in Waylis.

## Get text

<video controls="controls" autoplay loop src="./assets/get_text.mp4" />

```ts
const command = createCommand({ value: "text_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please enter text" },
    replyRestriction: {
        bodyType: "text",
        bodyLimits: { minLength: 3, maxLength: 50 },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Get: ${answers.data}` };
    },
});
```

## Get number

<video controls="controls" autoplay loop src="./assets/get_number.mp4" />

```ts
const command = createCommand({ value: "number_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please enter a number" },
    replyRestriction: {
        bodyType: "number",
        bodyLimits: { min: 1, max: 9999, integerOnly: true },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Get: ${answers.data}` };
    },
});
```

## Get boolean

<video controls="controls" autoplay loop src="./assets/get_boolean.mp4" />

```ts
const command = createCommand({ value: "boolean_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please pick yes or no" },
    replyRestriction: { bodyType: "boolean" },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Get: ${answers.data}` };
    },
});
```

## Get datetime

<video controls="controls" autoplay loop src="./assets/get_datetime.mp4" />

```ts
const command = createCommand({ value: "datetime_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please pick a date" },
    replyRestriction: {
        bodyType: "datetime",
        bodyLimits: { max: new Date() },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Get: ${answers.data}` };
    },
});
```

## Get option

<video controls="controls" autoplay loop src="./assets/get_option.mp4" />

```ts
const command = createCommand({ value: "option_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please pick an option" },
    replyRestriction: {
        bodyType: "option",
        bodyLimits: {
            options: [
                { value: "red", label: "Red color" },
                { value: "green", label: "Green color" },
                { value: "blue", label: "Blue color" },
            ],
        },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Get: ${answers.data}` };
    },
});
```

## Get options

<video controls="controls" autoplay loop src="./assets/get_options.mp4" />

```ts
const command = createCommand({ value: "options_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please pick options" },
    replyRestriction: {
        bodyType: "options",
        bodyLimits: {
            options: [
                { value: "red", label: "Red color" },
                { value: "green", label: "Green color" },
                { value: "blue", label: "Blue color" },
                { value: "black", label: "Black color" },
                { value: "white", label: "White color" },
            ],
            maxAmount: 2,
        },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Get: ${answers.data}` };
    },
});
```

## Get file

<video controls="controls" autoplay loop src="./assets/get_file.mp4" />

```ts
const command = createCommand({ value: "file_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please pick a file" },
    replyRestriction: {
        bodyType: "file",
        bodyLimits: { mimeTypes: ["image/gif"], maxSize: 1_000_000 },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return {
            type: "text",
            content: `Get: ${JSON.stringify(answers.data)}`,
        };
    },
});
```

## Get files

<video controls="controls" autoplay loop src="./assets/get_files.mp4" />

```ts
const command = createCommand({ value: "files_example" });

const step = createStep({
    key: "data",
    prompt: { type: "text", content: "Please pick files" },
    replyRestriction: {
        bodyType: "files",
        bodyLimits: {
            mimeTypes: ["image/png"],
            maxSize: 500_000,
            maxAmount: 3,
        },
    },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return {
            type: "text",
            content: `Get: ${JSON.stringify(answers.data)}`,
        };
    },
});
```

## Send text

<video controls="controls" autoplay loop src="./assets/send_text.mp4" />

```ts
const command = createCommand({ value: "text_example" });

const scene = createScene({
    steps: [],
    handler: async () => {
        return { type: "text", content: `This is simple text.` };
    },
});
```

## Send markdown

<video controls="controls" autoplay loop src="./assets/send_markdown.mp4" />

```ts
const command = createCommand({ value: "markdown_example" });

const scene = createScene({
    steps: [],
    handler: async () => {
        let content = "This is *simple* **markdown** _text_";
        content += "\n - one";
        content += "\n - two";
        content += "\n - three";
        content += "\n ~~~\nconsole.log(123)\n~~~";
        content += "\n [Learn it](https://commonmark.org/help/)";

        return { type: "markdown", content };
    },
});
```

## Send file

<video controls="controls" autoplay loop src="./assets/send_file.mp4" />

See the [detailed guide](/guides/files.md) on working with files.

```ts
const command = createCommand({ value: "file_example" });

const scene = createScene({
    steps: [],
    handler: async () => {
        const data = Buffer.from("abc".repeat(10000));
        const file = await fileManager.uploadFile(data, {
            name: "simple_text_file.txt",
            size: data.length,
        });

        return { type: "file", content: file };
    },
});
```

## Send files

<video controls="controls" autoplay loop src="./assets/send_files.mp4" />

```ts
const command = createCommand({ value: "files_example" });

const scene = createScene({
    steps: [],
    handler: async () => {
        const videoData = readFileSync("./video.mp4");
        const imageData = readFileSync("./image.jpg");
        const audioData = readFileSync("./audio.mp3");

        const videoMeta = { name: "video.mp4", size: videoData.length };
        const imageMeta = { name: "image.jpg", size: imageData.length };
        const audioMeta = { name: "audio.mp3", size: audioData.length };

        const video = await fileManager.uploadFile(videoData, videoMeta);
        const image = await fileManager.uploadFile(imageData, imageMeta);
        const audio = await fileManager.uploadFile(audioData, audioMeta);

        return { type: "files", content: [video, image, audio] };
    },
});
```

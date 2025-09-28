# Working with files

Waylis has built-in support for file uploads and downloads.

The [AppServer](/fundamentals/app-server) class provides a method to get a [FileManager](/api/interfaces/FileManager) instance, which you can use in your [scene](/fundamentals/scenes#handlers) or [step handlers](/fundamentals/steps#handler) to process files.

```ts
const app = new AppServer();
const fileManager = await app.getFileManager();
```

You can upload any files using Node.js [buffers](https://nodejs.org/api/buffer.html#buffer) or [streams](https://nodejs.org/api/stream.html#stream) and send them to users:

```ts
const fileScene = createScene({
    steps: [],
    handler: async () => {
        const buffer = Buffer.from("Hello World");
        const textFile = await fileManager.uploadFile(buffer, {
            name: "hello.txt",
            size: buffer.length,
            mimeType: "text/plain",
        });

        return [
            { type: "text", content: "This is simple text file:" },
            { type: "file", content: textFile },
        ];
    },
});
```

You can download files uploaded by users and work with them:

```ts
const fileScene = createScene({
    steps: [
        createStep({
            key: "file",
            prompt: { type: "text", content: "Please upload a file." },
            reply: { bodyType: "file" },
        }),
    ],
    handler: async (answers) => {
        const receivedFile = answers.file;
        const stream = await fileManager.downloadFile(receivedFile.id);
        const chunks: Buffer<ArrayBuffer>[] = [];

        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }

        const content = Buffer.concat(chunks).toString();
        return { type: "text", content: `Received: ${content})` };
    },
});
```

You can also delete files yourself by their IDs:

```ts
const deletedFile = await fileManager.deleteFile(fileID);
```

By default, files are stored on disk thanks to the built-in [DiskFileStorage](/api/classes/DiskFileStorage) class. But you can connect any other storage by reading [this](/guides/file-storage) guide.

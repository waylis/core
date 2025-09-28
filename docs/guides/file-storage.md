# Custrom file storage

Waylis allows you to work with files (upload, download, and delete). This requires external file storage.

## Built-in

The `@waylis/core` package includes one implementations of such storage:

-   [DiskFileStorage](/api/classes/DiskFileStorage) — Simple implementation of file storage based on the server's file system (used by default).

```ts
import { DiskFileStorage } from "@waylis/core";
```

```ts
const app = new AppServer({
    fileStorage: new DiskFileStorage("files"),
});
```

## Any other file storage

Waylis makes it easy to implement any other file storage implementation that satisfies the [FileStorage](/api/interfaces/FileStorage) interface.

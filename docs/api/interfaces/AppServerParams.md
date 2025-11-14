[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / AppServerParams

# Interface: `AppServerParams`

Defined in: [server/server.ts:39](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L39)

Parameters for initializing application server.

## Properties

### config?

```ts
optional config: DeepPartial<ServerConfig>;
```

Defined in: [server/server.ts:49](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L49)

Server configuration options.
Can be partially provided; defaults will be applied for missing values.

***

### db?

```ts
optional db: Database;
```

Defined in: [server/server.ts:41](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L41)

Database instance used by the server for persistence.

***

### fileStorage?

```ts
optional fileStorage: FileStorage;
```

Defined in: [server/server.ts:43](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L43)

File storage implementation for handling file uploads and storage.

***

### logger?

```ts
optional logger: Logger;
```

Defined in: [server/server.ts:51](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L51)

Logger instance for capturing and formatting logs.

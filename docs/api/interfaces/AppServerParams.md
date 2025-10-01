[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / AppServerParams

# Interface: `AppServerParams`

Defined in: [src/server/server.ts:39](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/server/server.ts#L39)

Parameters for initializing application server.

## Properties

### config?

```ts
optional config: DeepPartial<ServerConfig>;
```

Defined in: [src/server/server.ts:49](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/server/server.ts#L49)

Server configuration options.
Can be partially provided; defaults will be applied for missing values.

***

### db?

```ts
optional db: Database;
```

Defined in: [src/server/server.ts:41](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/server/server.ts#L41)

Database instance used by the server for persistence.

***

### fileStorage?

```ts
optional fileStorage: FileStorage;
```

Defined in: [src/server/server.ts:43](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/server/server.ts#L43)

File storage implementation for handling file uploads and storage.

***

### logger?

```ts
optional logger: Logger;
```

Defined in: [src/server/server.ts:51](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/server/server.ts#L51)

Logger instance for capturing and formatting logs.

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / ServerConfig

# Interface: `ServerConfig`

Defined in: [server/config.ts:7](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L7)

## Properties

### app

```ts
app: {
  description?: string;
  faviconURL?: string;
  name?: string;
};
```

Defined in: [server/config.ts:18](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L18)

Your app metadata

#### description?

```ts
optional description: string;
```

Description for your application

#### faviconURL?

```ts
optional faviconURL: string;
```

URL to web page icon

#### name?

```ts
optional name: string;
```

The name of your application

***

### auth

```ts
auth: {
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  logoutHandler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
  middleware: (req: IncomingMessage) => Promise<string>;
};
```

Defined in: [server/config.ts:28](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L28)

Authentication configuration

#### handler()

```ts
handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
```

Authentication (login) handler that attach unique user ID via cookies

##### Parameters

###### req

`IncomingMessage`

###### res

`ServerResponse`

##### Returns

`Promise`\<`void`\>

#### logoutHandler()

```ts
logoutHandler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
```

Handler that clear the authentication cookie

##### Parameters

###### req

`IncomingMessage`

###### res

`ServerResponse`

##### Returns

`Promise`\<`void`\>

#### middleware()

```ts
middleware: (req: IncomingMessage) => Promise<string>;
```

Authentication middleware that returns user ID or throws

##### Parameters

###### req

`IncomingMessage`

##### Returns

`Promise`\<`string`\>

***

### chatNameGenerator()

```ts
chatNameGenerator: () => string;
```

Defined in: [server/config.ts:15](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L15)

Default function for generating chat names, unless explicitly specified by the user

#### Returns

`string`

***

### cleanup

```ts
cleanup: {
  fileTTL: number;
  interval: number;
  messageTTL: number;
};
```

Defined in: [server/config.ts:38](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L38)

Cleanup-related configuration

#### fileTTL

```ts
fileTTL: number;
```

How long (in seconds) uploaded files should be kept before automatic cleanup

#### interval

```ts
interval: number;
```

Interval (in seconds) for cleaning tasks

#### messageTTL

```ts
messageTTL: number;
```

How long (in seconds) messages should be kept before automatic cleanup

***

### defaultPageLimit

```ts
defaultPageLimit: number;
```

Defined in: [server/config.ts:11](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L11)

Default number of items per page for paginated endpoints

***

### idGenerator()

```ts
idGenerator: () => string;
```

Defined in: [server/config.ts:13](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L13)

Default function for generating unique identifiers

#### Returns

`string`

***

### limits

```ts
limits: {
  maxChatsPerUser: number;
};
```

Defined in: [server/config.ts:48](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L48)

System limits and constraints

#### maxChatsPerUser

```ts
maxChatsPerUser: number;
```

Maximum number of chats a single user can create

***

### port

```ts
port: number;
```

Defined in: [server/config.ts:9](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L9)

Port number the server should listen on

***

### sse

```ts
sse: {
  heartbeatInterval: number;
};
```

Defined in: [server/config.ts:54](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/config.ts#L54)

SSE configuration

#### heartbeatInterval

```ts
heartbeatInterval: number;
```

Interval (in seconds) for Server-sent Events heartbeat messages

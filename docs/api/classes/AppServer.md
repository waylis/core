[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / AppServer

# Class: `AppServer`

Defined in: [server/server.ts:60](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L60)

Main application server.

This class encapsulates the initialization and lifecycle management
of the server, including database, file storage, configuration, and logging.

## Constructors

### Constructor

```ts
new AppServer(params?: AppServerParams): AppServer;
```

Defined in: [server/server.ts:80](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L80)

Create a new application server instance.

#### Parameters

##### params?

[`AppServerParams`](../interfaces/AppServerParams.md)

Optional initialization parameters used to configure
  the server. If omitted, defaults will be applied.

#### Returns

`AppServer`

## Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="chatmanager"></a> `chatManager` | `protected` | `ChatManager` | [server/server.ts:65](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L65) |
| <a id="config"></a> `config` | `protected` | [`ServerConfig`](../interfaces/ServerConfig.md) | [server/server.ts:61](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L61) |
| <a id="connections"></a> `connections` | `protected` | `Map`\<`string`, `ServerResponse`\<`IncomingMessage`\>\> | [server/server.ts:72](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L72) |
| <a id="database"></a> `database` | `protected` | [`Database`](../interfaces/Database.md) | [server/server.ts:62](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L62) |
| <a id="engine"></a> `engine` | `protected` | `SceneEngine` | [server/server.ts:70](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L70) |
| <a id="eventbus"></a> `eventBus` | `protected` | `EventBusClass` | [server/server.ts:71](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L71) |
| <a id="filemanager"></a> `fileManager` | `protected` | [`FileManager`](../interfaces/FileManager.md) | [server/server.ts:64](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L64) |
| <a id="filestorage"></a> `fileStorage` | `protected` | [`FileStorage`](../interfaces/FileStorage.md) | [server/server.ts:63](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L63) |
| <a id="logger"></a> `logger` | `protected` | [`Logger`](../interfaces/Logger.md) | [server/server.ts:68](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L68) |
| <a id="messagemanager"></a> `messageManager` | `protected` | `MessageManager` | [server/server.ts:66](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L66) |
| <a id="stepmanager"></a> `stepManager` | `protected` | `StepManager` | [server/server.ts:67](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L67) |

## Methods

### addScene()

```ts
addScene<Steps>(command: Command, scene: {
  handler: (responses: SceneResponsesMap<Steps>) => Promise<
     | SystemMessageBody
    | SystemMessageBody[]>;
  steps: [...Steps[]];
}): void;
```

Defined in: [server/server.ts:222](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L222)

Add a new scene to the application.

A scene represents a sequence of steps that the engine will execute
when the specified command is triggered.

#### Type Parameters

##### Steps

`Steps` *extends* readonly [`SceneStep`](../interfaces/SceneStep.md)\<`any`, `any`\>[]

A tuple of `SceneStep` definitions representing
  the ordered steps of the scene.

#### Parameters

##### command

[`Command`](../interfaces/Command.md)

The command that will trigger this scene.

##### scene

The actual scene.

###### handler

(`responses`: [`SceneResponsesMap`](../type-aliases/SceneResponsesMap.md)\<`Steps`\>) => `Promise`\<
  \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)
  \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)[]\>

###### steps

\[`...Steps[]`\]

#### Returns

`void`

***

### getFileManager()

```ts
getFileManager(): Promise<FileManager>;
```

Defined in: [server/server.ts:237](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L237)

Get the `FileManager` instance for managing files.

#### Returns

`Promise`\<[`FileManager`](../interfaces/FileManager.md)\>

A promise that resolves to the `FileManager` instance.

***

### start()

```ts
start(): Promise<Server<typeof IncomingMessage, typeof ServerResponse>>;
```

Defined in: [server/server.ts:182](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/server/server.ts#L182)

Start the HTTP server.

#### Returns

`Promise`\<`Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>\>

A new instance of the HTTP server.

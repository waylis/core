[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / MemoryDatabase

# Class: `MemoryDatabase`

Defined in: [database/memory/memory.ts:12](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L12)

Simple in-memory database implementation.

Data is lost when the process exits.

## Implements

- [`Database`](../interfaces/Database.md)

## Constructors

### Constructor

```ts
new MemoryDatabase(): MemoryDatabase;
```

#### Returns

`MemoryDatabase`

## Properties

| Property | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="isopen"></a> `isOpen` | `boolean` | `false` | [database/memory/memory.ts:13](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L13) |

## Methods

### addChat()

```ts
addChat(chat: Chat): Promise<void>;
```

Defined in: [database/memory/memory.ts:28](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L28)

Add a new chat to the database.

#### Parameters

##### chat

[`Chat`](../interfaces/Chat.md)

Chat object to store.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`addChat`](../interfaces/Database.md#addchat)

***

### addConfirmedStep()

```ts
addConfirmedStep(step: ConfirmedStep): Promise<void>;
```

Defined in: [database/memory/memory.ts:111](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L111)

Store a confirmed step.

#### Parameters

##### step

[`ConfirmedStep`](../interfaces/ConfirmedStep.md)

Step to add.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`addConfirmedStep`](../interfaces/Database.md#addconfirmedstep)

***

### addFile()

```ts
addFile(data: FileMeta): Promise<void>;
```

Defined in: [database/memory/memory.ts:129](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L129)

Add file metadata to the database.

#### Parameters

##### data

[`FileMeta`](../interfaces/FileMeta.md)

File metadata to store.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`addFile`](../interfaces/Database.md#addfile)

***

### addMessage()

```ts
addMessage(msg: Message): Promise<void>;
```

Defined in: [database/memory/memory.ts:74](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L74)

Add a new message to the database.

#### Parameters

##### msg

[`Message`](../interfaces/Message.md)

Message to store.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`addMessage`](../interfaces/Database.md#addmessage)

***

### close()

```ts
close(): Promise<void>;
```

Defined in: [database/memory/memory.ts:23](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L23)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`close`](../interfaces/Database.md#close)

***

### countChatsByCreatorID()

```ts
countChatsByCreatorID(creatorID: string): Promise<number>;
```

Defined in: [database/memory/memory.ts:47](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L47)

Count how many chats were created by a user.

#### Parameters

##### creatorID

`string`

User identifier.

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`countChatsByCreatorID`](../interfaces/Database.md#countchatsbycreatorid)

***

### deleteChatByID()

```ts
deleteChatByID(id: string): Promise<null | Chat>;
```

Defined in: [database/memory/memory.ts:65](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L65)

Remove a chat by ID.

#### Parameters

##### id

`string`

Chat identifier.

#### Returns

`Promise`\<`null` \| [`Chat`](../interfaces/Chat.md)\>

Deleted chat or null if not found.

#### Implementation of

[`Database`](../interfaces/Database.md).[`deleteChatByID`](../interfaces/Database.md#deletechatbyid)

***

### deleteFileByID()

```ts
deleteFileByID(id: string): Promise<null | FileMeta>;
```

Defined in: [database/memory/memory.ts:144](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L144)

Delete file metadata by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](../interfaces/FileMeta.md)\>

Deleted metadata or null if not found.

#### Implementation of

[`Database`](../interfaces/Database.md).[`deleteFileByID`](../interfaces/Database.md#deletefilebyid)

***

### deleteMessagesByChatID()

```ts
deleteMessagesByChatID(chatID: string): Promise<number>;
```

Defined in: [database/memory/memory.ts:104](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L104)

Delete all messages belonging to a chat.

#### Parameters

##### chatID

`string`

Chat identifier.

#### Returns

`Promise`\<`number`\>

Number of deleted messages.

#### Implementation of

[`Database`](../interfaces/Database.md).[`deleteMessagesByChatID`](../interfaces/Database.md#deletemessagesbychatid)

***

### deleteOldConfirmedSteps()

```ts
deleteOldConfirmedSteps(maxDate: Date): Promise<number>;
```

Defined in: [database/memory/memory.ts:122](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L122)

Delete all confirmed steps created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`number`\>

Number of deleted steps.

#### Implementation of

[`Database`](../interfaces/Database.md).[`deleteOldConfirmedSteps`](../interfaces/Database.md#deleteoldconfirmedsteps)

***

### deleteOldFiles()

```ts
deleteOldFiles(maxDate: Date): Promise<string[]>;
```

Defined in: [database/memory/memory.ts:152](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L152)

Delete all files created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`string`[]\>

List of deleted file IDs.

#### Implementation of

[`Database`](../interfaces/Database.md).[`deleteOldFiles`](../interfaces/Database.md#deleteoldfiles)

***

### deleteOldMessages()

```ts
deleteOldMessages(maxDate: Date): Promise<number>;
```

Defined in: [database/memory/memory.ts:98](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L98)

Delete all messages created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`number`\>

Number of deleted messages.

#### Implementation of

[`Database`](../interfaces/Database.md).[`deleteOldMessages`](../interfaces/Database.md#deleteoldmessages)

***

### editChatByID()

```ts
editChatByID(id: string, updated: Partial<Chat>): Promise<null | Chat>;
```

Defined in: [database/memory/memory.ts:51](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L51)

Update a chat by ID.

#### Parameters

##### id

`string`

Chat identifier.

##### updated

`Partial`\<[`Chat`](../interfaces/Chat.md)\>

Partial fields to update.

#### Returns

`Promise`\<`null` \| [`Chat`](../interfaces/Chat.md)\>

Updated chat or null if not found.

#### Implementation of

[`Database`](../interfaces/Database.md).[`editChatByID`](../interfaces/Database.md#editchatbyid)

***

### getChatByID()

```ts
getChatByID(id: string): Promise<null | Chat>;
```

Defined in: [database/memory/memory.ts:35](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L35)

Retrieve a chat by its ID.

#### Parameters

##### id

`string`

Chat identifier.

#### Returns

`Promise`\<`null` \| [`Chat`](../interfaces/Chat.md)\>

Chat if found, otherwise null.

#### Implementation of

[`Database`](../interfaces/Database.md).[`getChatByID`](../interfaces/Database.md#getchatbyid)

***

### getChatsByCreatorID()

```ts
getChatsByCreatorID(
   creatorID: string, 
   offset: number, 
limit: number): Promise<Chat[]>;
```

Defined in: [database/memory/memory.ts:39](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L39)

Retrieve chats created by a specific user.

#### Parameters

##### creatorID

`string`

User identifier.

##### offset

`number`

Skip this many results.

##### limit

`number`

Maximum number of results.

#### Returns

`Promise`\<[`Chat`](../interfaces/Chat.md)[]\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`getChatsByCreatorID`](../interfaces/Database.md#getchatsbycreatorid)

***

### getConfirmedStepsByThreadID()

```ts
getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]>;
```

Defined in: [database/memory/memory.ts:118](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L118)

Retrieve all confirmed steps belonging to a thread.

#### Parameters

##### threadID

`string`

Thread identifier.

#### Returns

`Promise`\<[`ConfirmedStep`](../interfaces/ConfirmedStep.md)[]\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`getConfirmedStepsByThreadID`](../interfaces/Database.md#getconfirmedstepsbythreadid)

***

### getFileByID()

```ts
getFileByID(id: string): Promise<null | FileMeta>;
```

Defined in: [database/memory/memory.ts:136](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L136)

Retrieve file metadata by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](../interfaces/FileMeta.md)\>

Metadata if found, otherwise null.

#### Implementation of

[`Database`](../interfaces/Database.md).[`getFileByID`](../interfaces/Database.md#getfilebyid)

***

### getFilesByIDs()

```ts
getFilesByIDs(ids: string[]): Promise<FileMeta[]>;
```

Defined in: [database/memory/memory.ts:140](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L140)

Retrieve multiple files by IDs.

#### Parameters

##### ids

`string`[]

List of file identifiers.

#### Returns

`Promise`\<[`FileMeta`](../interfaces/FileMeta.md)[]\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`getFilesByIDs`](../interfaces/Database.md#getfilesbyids)

***

### getMessageByID()

```ts
getMessageByID(id: string): Promise<null | Message>;
```

Defined in: [database/memory/memory.ts:81](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L81)

Retrieve a message by its ID.

#### Parameters

##### id

`string`

Message identifier.

#### Returns

`Promise`\<`null` \| [`Message`](../interfaces/Message.md)\>

Message if found, otherwise null.

#### Implementation of

[`Database`](../interfaces/Database.md).[`getMessageByID`](../interfaces/Database.md#getmessagebyid)

***

### getMessagesByChatID()

```ts
getMessagesByChatID(
   chatID: string, 
   offset: number, 
limit: number): Promise<Message[]>;
```

Defined in: [database/memory/memory.ts:89](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L89)

Retrieve messages from a chat.

#### Parameters

##### chatID

`string`

Chat identifier.

##### offset

`number`

Skip this many results.

##### limit

`number`

Maximum number of results.

#### Returns

`Promise`\<[`Message`](../interfaces/Message.md)[]\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`getMessagesByChatID`](../interfaces/Database.md#getmessagesbychatid)

***

### getMessagesByIDs()

```ts
getMessagesByIDs(ids: string[]): Promise<Message[]>;
```

Defined in: [database/memory/memory.ts:85](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L85)

Retrieve multiple messages by IDs.

#### Parameters

##### ids

`string`[]

List of message identifiers.

#### Returns

`Promise`\<[`Message`](../interfaces/Message.md)[]\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`getMessagesByIDs`](../interfaces/Database.md#getmessagesbyids)

***

### open()

```ts
open(): Promise<void>;
```

Defined in: [database/memory/memory.ts:19](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/database/memory/memory.ts#L19)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Database`](../interfaces/Database.md).[`open`](../interfaces/Database.md#open)

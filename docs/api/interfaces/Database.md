[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / Database

# Interface: `Database`

Defined in: [src/database/database.ts:7](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/database/database.ts#L7)

Unified database interface combining chats, messages, confirmed steps, and files.

## Extends

- [`ChatDatabase`](ChatDatabase.md).[`MessageDatabase`](MessageDatabase.md).[`ConfirmedStepDatabase`](ConfirmedStepDatabase.md).[`FileDatabase`](FileDatabase.md)

## Properties

### close()

```ts
close: () => Promise<void>;
```

Defined in: [src/database/database.ts:9](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/database/database.ts#L9)

#### Returns

`Promise`\<`void`\>

***

### isOpen

```ts
isOpen: boolean;
```

Defined in: [src/database/database.ts:8](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/database/database.ts#L8)

***

### open()

```ts
open: () => Promise<void>;
```

Defined in: [src/database/database.ts:10](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/database/database.ts#L10)

#### Returns

`Promise`\<`void`\>

## Methods

### addChat()

```ts
addChat(chat: Chat): Promise<void>;
```

Defined in: [src/chat/chat.ts:23](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/chat/chat.ts#L23)

Add a new chat to the database.

#### Parameters

##### chat

[`Chat`](Chat.md)

Chat object to store.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ChatDatabase`](ChatDatabase.md).[`addChat`](ChatDatabase.md#addchat)

***

### addConfirmedStep()

```ts
addConfirmedStep(step: ConfirmedStep): Promise<void>;
```

Defined in: [src/scene/step.ts:43](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/scene/step.ts#L43)

Store a confirmed step.

#### Parameters

##### step

[`ConfirmedStep`](ConfirmedStep.md)

Step to add.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`ConfirmedStepDatabase`](ConfirmedStepDatabase.md).[`addConfirmedStep`](ConfirmedStepDatabase.md#addconfirmedstep)

***

### addFile()

```ts
addFile(data: FileMeta): Promise<void>;
```

Defined in: [src/file/file.ts:61](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/file/file.ts#L61)

Add file metadata to the database.

#### Parameters

##### data

[`FileMeta`](FileMeta.md)

File metadata to store.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FileDatabase`](FileDatabase.md).[`addFile`](FileDatabase.md#addfile)

***

### addMessage()

```ts
addMessage(msg: Message): Promise<void>;
```

Defined in: [src/message/message.ts:53](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/message.ts#L53)

Add a new message to the database.

#### Parameters

##### msg

[`Message`](Message.md)

Message to store.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`MessageDatabase`](MessageDatabase.md).[`addMessage`](MessageDatabase.md#addmessage)

***

### countChatsByCreatorID()

```ts
countChatsByCreatorID(creatorID: string): Promise<number>;
```

Defined in: [src/chat/chat.ts:44](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/chat/chat.ts#L44)

Count how many chats were created by a user.

#### Parameters

##### creatorID

`string`

User identifier.

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`ChatDatabase`](ChatDatabase.md).[`countChatsByCreatorID`](ChatDatabase.md#countchatsbycreatorid)

***

### deleteChatByID()

```ts
deleteChatByID(id: string): Promise<null | Chat>;
```

Defined in: [src/chat/chat.ts:59](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/chat/chat.ts#L59)

Remove a chat by ID.

#### Parameters

##### id

`string`

Chat identifier.

#### Returns

`Promise`\<`null` \| [`Chat`](Chat.md)\>

Deleted chat or null if not found.

#### Inherited from

[`ChatDatabase`](ChatDatabase.md).[`deleteChatByID`](ChatDatabase.md#deletechatbyid)

***

### deleteFileByID()

```ts
deleteFileByID(id: string): Promise<null | FileMeta>;
```

Defined in: [src/file/file.ts:81](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/file/file.ts#L81)

Delete file metadata by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](FileMeta.md)\>

Deleted metadata or null if not found.

#### Inherited from

[`FileDatabase`](FileDatabase.md).[`deleteFileByID`](FileDatabase.md#deletefilebyid)

***

### deleteMessagesByChatID()

```ts
deleteMessagesByChatID(chatID: string): Promise<number>;
```

Defined in: [src/message/message.ts:88](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/message.ts#L88)

Delete all messages belonging to a chat.

#### Parameters

##### chatID

`string`

Chat identifier.

#### Returns

`Promise`\<`number`\>

Number of deleted messages.

#### Inherited from

[`MessageDatabase`](MessageDatabase.md).[`deleteMessagesByChatID`](MessageDatabase.md#deletemessagesbychatid)

***

### deleteOldConfirmedSteps()

```ts
deleteOldConfirmedSteps(maxDate: Date): Promise<number>;
```

Defined in: [src/scene/step.ts:56](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/scene/step.ts#L56)

Delete all confirmed steps created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`number`\>

Number of deleted steps.

#### Inherited from

[`ConfirmedStepDatabase`](ConfirmedStepDatabase.md).[`deleteOldConfirmedSteps`](ConfirmedStepDatabase.md#deleteoldconfirmedsteps)

***

### deleteOldFiles()

```ts
deleteOldFiles(maxDate: Date): Promise<string[]>;
```

Defined in: [src/file/file.ts:88](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/file/file.ts#L88)

Delete all files created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`string`[]\>

List of deleted file IDs.

#### Inherited from

[`FileDatabase`](FileDatabase.md).[`deleteOldFiles`](FileDatabase.md#deleteoldfiles)

***

### deleteOldMessages()

```ts
deleteOldMessages(maxDate: Date): Promise<number>;
```

Defined in: [src/message/message.ts:81](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/message.ts#L81)

Delete all messages created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`number`\>

Number of deleted messages.

#### Inherited from

[`MessageDatabase`](MessageDatabase.md).[`deleteOldMessages`](MessageDatabase.md#deleteoldmessages)

***

### editChatByID()

```ts
editChatByID(id: string, updated: Partial<Chat>): Promise<null | Chat>;
```

Defined in: [src/chat/chat.ts:52](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/chat/chat.ts#L52)

Update a chat by ID.

#### Parameters

##### id

`string`

Chat identifier.

##### updated

`Partial`\<[`Chat`](Chat.md)\>

Partial fields to update.

#### Returns

`Promise`\<`null` \| [`Chat`](Chat.md)\>

Updated chat or null if not found.

#### Inherited from

[`ChatDatabase`](ChatDatabase.md).[`editChatByID`](ChatDatabase.md#editchatbyid)

***

### getChatByID()

```ts
getChatByID(id: string): Promise<null | Chat>;
```

Defined in: [src/chat/chat.ts:30](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/chat/chat.ts#L30)

Retrieve a chat by its ID.

#### Parameters

##### id

`string`

Chat identifier.

#### Returns

`Promise`\<`null` \| [`Chat`](Chat.md)\>

Chat if found, otherwise null.

#### Inherited from

[`ChatDatabase`](ChatDatabase.md).[`getChatByID`](ChatDatabase.md#getchatbyid)

***

### getChatsByCreatorID()

```ts
getChatsByCreatorID(
   creatorID: string, 
   offset: number, 
limit: number): Promise<Chat[]>;
```

Defined in: [src/chat/chat.ts:38](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/chat/chat.ts#L38)

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

`Promise`\<[`Chat`](Chat.md)[]\>

#### Inherited from

[`ChatDatabase`](ChatDatabase.md).[`getChatsByCreatorID`](ChatDatabase.md#getchatsbycreatorid)

***

### getConfirmedStepsByThreadID()

```ts
getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]>;
```

Defined in: [src/scene/step.ts:49](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/scene/step.ts#L49)

Retrieve all confirmed steps belonging to a thread.

#### Parameters

##### threadID

`string`

Thread identifier.

#### Returns

`Promise`\<[`ConfirmedStep`](ConfirmedStep.md)[]\>

#### Inherited from

[`ConfirmedStepDatabase`](ConfirmedStepDatabase.md).[`getConfirmedStepsByThreadID`](ConfirmedStepDatabase.md#getconfirmedstepsbythreadid)

***

### getFileByID()

```ts
getFileByID(id: string): Promise<null | FileMeta>;
```

Defined in: [src/file/file.ts:68](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/file/file.ts#L68)

Retrieve file metadata by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](FileMeta.md)\>

Metadata if found, otherwise null.

#### Inherited from

[`FileDatabase`](FileDatabase.md).[`getFileByID`](FileDatabase.md#getfilebyid)

***

### getFilesByIDs()

```ts
getFilesByIDs(ids: string[]): Promise<FileMeta[]>;
```

Defined in: [src/file/file.ts:74](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/file/file.ts#L74)

Retrieve multiple files by IDs.

#### Parameters

##### ids

`string`[]

List of file identifiers.

#### Returns

`Promise`\<[`FileMeta`](FileMeta.md)[]\>

#### Inherited from

[`FileDatabase`](FileDatabase.md).[`getFilesByIDs`](FileDatabase.md#getfilesbyids)

***

### getMessageByID()

```ts
getMessageByID(id: string): Promise<null | Message>;
```

Defined in: [src/message/message.ts:60](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/message.ts#L60)

Retrieve a message by its ID.

#### Parameters

##### id

`string`

Message identifier.

#### Returns

`Promise`\<`null` \| [`Message`](Message.md)\>

Message if found, otherwise null.

#### Inherited from

[`MessageDatabase`](MessageDatabase.md).[`getMessageByID`](MessageDatabase.md#getmessagebyid)

***

### getMessagesByChatID()

```ts
getMessagesByChatID(
   chatID: string, 
   offset: number, 
limit: number): Promise<Message[]>;
```

Defined in: [src/message/message.ts:74](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/message.ts#L74)

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

`Promise`\<[`Message`](Message.md)[]\>

#### Inherited from

[`MessageDatabase`](MessageDatabase.md).[`getMessagesByChatID`](MessageDatabase.md#getmessagesbychatid)

***

### getMessagesByIDs()

```ts
getMessagesByIDs(ids: string[]): Promise<Message[]>;
```

Defined in: [src/message/message.ts:66](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/message.ts#L66)

Retrieve multiple messages by IDs.

#### Parameters

##### ids

`string`[]

List of message identifiers.

#### Returns

`Promise`\<[`Message`](Message.md)[]\>

#### Inherited from

[`MessageDatabase`](MessageDatabase.md).[`getMessagesByIDs`](MessageDatabase.md#getmessagesbyids)

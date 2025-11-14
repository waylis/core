[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / ChatDatabase

# Interface: `ChatDatabase`

Defined in: [chat/chat.ts:18](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L18)

Abstraction for chat persistence operations.

## Extended by

- [`Database`](Database.md)

## Methods

### addChat()

```ts
addChat(chat: Chat): Promise<void>;
```

Defined in: [chat/chat.ts:23](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L23)

Add a new chat to the database.

#### Parameters

##### chat

[`Chat`](Chat.md)

Chat object to store.

#### Returns

`Promise`\<`void`\>

***

### countChatsByCreatorID()

```ts
countChatsByCreatorID(creatorID: string): Promise<number>;
```

Defined in: [chat/chat.ts:44](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L44)

Count how many chats were created by a user.

#### Parameters

##### creatorID

`string`

User identifier.

#### Returns

`Promise`\<`number`\>

***

### deleteChatByID()

```ts
deleteChatByID(id: string): Promise<null | Chat>;
```

Defined in: [chat/chat.ts:59](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L59)

Remove a chat by ID.

#### Parameters

##### id

`string`

Chat identifier.

#### Returns

`Promise`\<`null` \| [`Chat`](Chat.md)\>

Deleted chat or null if not found.

***

### editChatByID()

```ts
editChatByID(id: string, updated: Partial<Chat>): Promise<null | Chat>;
```

Defined in: [chat/chat.ts:52](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L52)

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

***

### getChatByID()

```ts
getChatByID(id: string): Promise<null | Chat>;
```

Defined in: [chat/chat.ts:30](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L30)

Retrieve a chat by its ID.

#### Parameters

##### id

`string`

Chat identifier.

#### Returns

`Promise`\<`null` \| [`Chat`](Chat.md)\>

Chat if found, otherwise null.

***

### getChatsByCreatorID()

```ts
getChatsByCreatorID(
   creatorID: string, 
   offset: number, 
limit: number): Promise<Chat[]>;
```

Defined in: [chat/chat.ts:38](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/chat/chat.ts#L38)

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

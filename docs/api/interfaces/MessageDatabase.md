[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / MessageDatabase

# Interface: `MessageDatabase`

Defined in: [message/message.ts:49](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L49)

Abstraction for message persistence operations.

## Extended by

- [`Database`](Database.md)

## Methods

### addMessage()

```ts
addMessage(msg: Message): Promise<void>;
```

Defined in: [message/message.ts:54](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L54)

Add a new message to the database.

#### Parameters

##### msg

[`Message`](Message.md)

Message to store.

#### Returns

`Promise`\<`void`\>

***

### deleteMessagesByChatID()

```ts
deleteMessagesByChatID(chatID: string): Promise<number>;
```

Defined in: [message/message.ts:89](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L89)

Delete all messages belonging to a chat.

#### Parameters

##### chatID

`string`

Chat identifier.

#### Returns

`Promise`\<`number`\>

Number of deleted messages.

***

### deleteOldMessages()

```ts
deleteOldMessages(maxDate: Date): Promise<number>;
```

Defined in: [message/message.ts:82](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L82)

Delete all messages created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`number`\>

Number of deleted messages.

***

### getMessageByID()

```ts
getMessageByID(id: string): Promise<null | Message>;
```

Defined in: [message/message.ts:61](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L61)

Retrieve a message by its ID.

#### Parameters

##### id

`string`

Message identifier.

#### Returns

`Promise`\<`null` \| [`Message`](Message.md)\>

Message if found, otherwise null.

***

### getMessagesByChatID()

```ts
getMessagesByChatID(
   chatID: string, 
   offset: number, 
limit: number): Promise<Message[]>;
```

Defined in: [message/message.ts:75](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L75)

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

***

### getMessagesByIDs()

```ts
getMessagesByIDs(ids: string[]): Promise<Message[]>;
```

Defined in: [message/message.ts:67](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L67)

Retrieve multiple messages by IDs.

#### Parameters

##### ids

`string`[]

List of message identifiers.

#### Returns

`Promise`\<[`Message`](Message.md)[]\>

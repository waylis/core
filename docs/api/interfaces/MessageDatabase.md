[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / MessageDatabase

# Interface: `MessageDatabase`

Defined in: [src/message/message.ts:48](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L48)

Abstraction for message persistence operations.

## Extended by

- [`Database`](Database.md)

## Methods

### addMessage()

```ts
addMessage(msg: Message): Promise<void>;
```

Defined in: [src/message/message.ts:53](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L53)

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

Defined in: [src/message/message.ts:88](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L88)

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

Defined in: [src/message/message.ts:81](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L81)

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

Defined in: [src/message/message.ts:60](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L60)

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

Defined in: [src/message/message.ts:74](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L74)

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

Defined in: [src/message/message.ts:66](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L66)

Retrieve multiple messages by IDs.

#### Parameters

##### ids

`string`[]

List of message identifiers.

#### Returns

`Promise`\<[`Message`](Message.md)[]\>

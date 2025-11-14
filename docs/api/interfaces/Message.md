[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / Message

# Interface: `Message`

Defined in: [message/message.ts:23](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L23)

Represents a chat message.

## Properties

### body

```ts
body: MessageBody;
```

Defined in: [message/message.ts:39](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L39)

Message content.

***

### chatID

```ts
chatID: string;
```

Defined in: [message/message.ts:27](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L27)

ID of the chat this message belongs to.

***

### createdAt

```ts
createdAt: Date;
```

Defined in: [message/message.ts:43](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L43)

Timestamp when the message was created.

***

### id

```ts
id: string;
```

Defined in: [message/message.ts:25](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L25)

Unique identifier of the message.

***

### reply?

```ts
optional reply: ExpectedReply<UserMessageBodyType>;
```

Defined in: [message/message.ts:41](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L41)

Restriction settings for replies, if any.

***

### replyTo?

```ts
optional replyTo: string;
```

Defined in: [message/message.ts:31](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L31)

ID of the message this one replies to, if any.

***

### scene?

```ts
optional scene: string;
```

Defined in: [message/message.ts:35](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L35)

Optional scene identifier for workflow tracking.

***

### senderID

```ts
senderID: string;
```

Defined in: [message/message.ts:29](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L29)

ID of the user who sent the message.

***

### step?

```ts
optional step: string;
```

Defined in: [message/message.ts:37](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L37)

Optional step identifier within a scene.

***

### threadID

```ts
threadID: string;
```

Defined in: [message/message.ts:33](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/message.ts#L33)

ID of the thread this message belongs to.

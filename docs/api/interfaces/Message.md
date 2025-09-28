[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / Message

# Interface: `Message`

Defined in: [src/message/message.ts:22](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L22)

Represents a chat message.

## Properties

### body

```ts
body: MessageBody;
```

Defined in: [src/message/message.ts:38](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L38)

Message content.

***

### chatID

```ts
chatID: string;
```

Defined in: [src/message/message.ts:26](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L26)

ID of the chat this message belongs to.

***

### createdAt

```ts
createdAt: Date;
```

Defined in: [src/message/message.ts:42](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L42)

Timestamp when the message was created.

***

### id

```ts
id: string;
```

Defined in: [src/message/message.ts:24](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L24)

Unique identifier of the message.

***

### reply?

```ts
optional reply: ExpectedReply<UserMessageBodyType>;
```

Defined in: [src/message/message.ts:40](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L40)

Restriction settings for replies, if any.

***

### replyTo?

```ts
optional replyTo: string;
```

Defined in: [src/message/message.ts:30](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L30)

ID of the message this one replies to, if any.

***

### scene?

```ts
optional scene: string;
```

Defined in: [src/message/message.ts:34](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L34)

Optional scene identifier for workflow tracking.

***

### senderID

```ts
senderID: string;
```

Defined in: [src/message/message.ts:28](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L28)

ID of the user who sent the message.

***

### step?

```ts
optional step: string;
```

Defined in: [src/message/message.ts:36](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L36)

Optional step identifier within a scene.

***

### threadID

```ts
threadID: string;
```

Defined in: [src/message/message.ts:32](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/message.ts#L32)

ID of the thread this message belongs to.

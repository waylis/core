[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / UserMessageBodyType

# Type Alias: `UserMessageBodyType`

```ts
type UserMessageBodyType = Exclude<MessageBodyType, "markdown" | "linechart" | "table">;
```

Defined in: [src/message/types.ts:125](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/types.ts#L125)

Types allowed for user-created messages.

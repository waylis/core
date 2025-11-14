[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / UserMessageBodyType

# Type Alias: `UserMessageBodyType`

```ts
type UserMessageBodyType = Exclude<MessageBodyType, "markdown" | "linechart" | "table">;
```

Defined in: [message/types.ts:125](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L125)

Types allowed for user-created messages.

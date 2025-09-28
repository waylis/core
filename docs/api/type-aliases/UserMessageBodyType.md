[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / UserMessageBodyType

# Type Alias: `UserMessageBodyType`

```ts
type UserMessageBodyType = Exclude<MessageBodyType, "markdown" | "linechart" | "table">;
```

Defined in: [src/message/types.ts:125](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L125)

Types allowed for user-created messages.

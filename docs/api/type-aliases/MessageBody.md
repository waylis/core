[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / MessageBody

# Type Alias: `MessageBody`

```ts
type MessageBody = { [K in keyof MessageBodyMap]: { content: MessageBodyMap[K]; type: K } }[keyof MessageBodyMap];
```

Defined in: [message/types.ts:106](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L106)

A message body, discriminated by `type`.

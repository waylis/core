[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / MessageBody

# Type Alias: `MessageBody`

```ts
type MessageBody = { [K in keyof MessageBodyMap]: { content: MessageBodyMap[K]; type: K } }[keyof MessageBodyMap];
```

Defined in: [src/message/types.ts:106](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/types.ts#L106)

A message body, discriminated by `type`.

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / MessageBody

# Type Alias: `MessageBody`

```ts
type MessageBody = { [K in keyof MessageBodyMap]: { content: MessageBodyMap[K]; type: K } }[keyof MessageBodyMap];
```

Defined in: [src/message/types.ts:106](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L106)

A message body, discriminated by `type`.

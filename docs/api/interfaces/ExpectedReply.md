[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / ExpectedReply

# Interface: `ExpectedReply<T>`

Defined in: [message/types.ts:143](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L143)

Defines the expected shape and constraints of a reply.

## Type Parameters

### T

`T` *extends* [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md) = [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md)

## Properties

### bodyLimits?

```ts
optional bodyLimits: T extends keyof MessageBodyLimitsMap ? MessageBodyLimitsMap[T<T>] : never;
```

Defined in: [message/types.ts:147](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L147)

Optional limits for that body type.

***

### bodyType

```ts
bodyType: T;
```

Defined in: [message/types.ts:145](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L145)

Required body type for the reply.

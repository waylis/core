[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / ExpectedReply

# Interface: `ExpectedReply<T>`

Defined in: [src/message/types.ts:143](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L143)

Defines the expected shape and constraints of a reply.

## Type Parameters

### T

`T` *extends* [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md) = [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md)

## Properties

### bodyLimits?

```ts
optional bodyLimits: T extends keyof MessageBodyLimitsMap ? MessageBodyLimitsMap[T<T>] : never;
```

Defined in: [src/message/types.ts:147](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L147)

Optional limits for that body type.

***

### bodyType

```ts
bodyType: T;
```

Defined in: [src/message/types.ts:145](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L145)

Required body type for the reply.

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / SceneStep

# Interface: `SceneStep<K, T>`

Defined in: [scene/step.ts:21](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L21)

Defines a single step in a scene.

## Type Parameters

### K

`K` *extends* `string` = `string`

### T

`T` *extends* [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md) = [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md)

## Properties

### handler()?

```ts
optional handler: (body: MessageBodyMap[T]) => Promise<void | SystemMessageBody>;
```

Defined in: [scene/step.ts:34](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L34)

Optional handler to process (validate) the user's reply.

#### Parameters

##### body

[`MessageBodyMap`](../type-aliases/MessageBodyMap.md)\[`T`\]

Message body matching the reply restriction type.

#### Returns

`Promise`\<`void` \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)\>

Optional system message response if processing (validation) fails.

***

### key

```ts
key: K;
```

Defined in: [scene/step.ts:23](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L23)

Unique key identifying the step.

***

### prompt

```ts
prompt: SystemMessageBody;
```

Defined in: [scene/step.ts:25](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L25)

Prompt message shown to the user.

***

### reply

```ts
reply: ExpectedReply<T>;
```

Defined in: [scene/step.ts:27](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L27)

Restriction on expected reply.

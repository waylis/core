[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / createStep

# Function: `createStep()`

```ts
function createStep<K, T>(step: SceneStep<K, T>): SceneStep<K, T>;
```

Defined in: [scene/step.ts:77](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L77)

Create a new scene step, validating its key format and length.

## Type Parameters

### K

`K` *extends* `string`

### T

`T` *extends* [`UserMessageBodyType`](../type-aliases/UserMessageBodyType.md)

## Parameters

### step

[`SceneStep`](../interfaces/SceneStep.md)\<`K`, `T`\>

Step configuration.

## Returns

[`SceneStep`](../interfaces/SceneStep.md)\<`K`, `T`\>

The validated step.

## Throws

If the step key is invalid.

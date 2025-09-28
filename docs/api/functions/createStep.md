[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / createStep

# Function: `createStep()`

```ts
function createStep<K, T>(step: SceneStep<K, T>): SceneStep<K, T>;
```

Defined in: [src/scene/step.ts:77](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/step.ts#L77)

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

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / createScene

# Function: `createScene()`

```ts
function createScene<Steps>(config: {
  handler: (responses: SceneResponsesMap<Steps>) => Promise<
     | SystemMessageBody
    | SystemMessageBody[]>;
  steps: [...Steps[]];
}): Scene<Steps>;
```

Defined in: [src/scene/scene.ts:27](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/scene.ts#L27)

Create a new scene definition.

## Type Parameters

### Steps

`Steps` *extends* readonly [`SceneStep`](../interfaces/SceneStep.md)\<`any`, `any`\>[]

## Parameters

### config

Scene configuration including steps and handler.

#### handler

(`responses`: [`SceneResponsesMap`](../type-aliases/SceneResponsesMap.md)\<`Steps`\>) => `Promise`\<
  \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)
  \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)[]\>

#### steps

\[`...Steps[]`\]

## Returns

[`Scene`](../interfaces/Scene.md)\<`Steps`\>

A scene instance.

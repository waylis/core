[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / Scene

# Interface: `Scene<Steps>`

Defined in: [src/scene/scene.ts:10](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/scene.ts#L10)

Represents an interactive scene composed of multiple steps.

## Type Parameters

### Steps

`Steps` *extends* readonly \[`...SceneStep[]`\]

## Properties

### handler()

```ts
handler: (responses: SceneResponsesMap<Steps>) => Promise<
  | SystemMessageBody
| SystemMessageBody[]>;
```

Defined in: [src/scene/scene.ts:19](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/scene.ts#L19)

Handler executed after all steps are completed.

#### Parameters

##### responses

[`SceneResponsesMap`](../type-aliases/SceneResponsesMap.md)\<`Steps`\>

Collected responses from the steps.

#### Returns

`Promise`\<
  \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)
  \| [`SystemMessageBody`](../type-aliases/SystemMessageBody.md)[]\>

One or more system messages to output.

***

### steps

```ts
steps: Steps;
```

Defined in: [src/scene/scene.ts:12](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/scene.ts#L12)

Steps that define the scene flow.

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / ConfirmedStep

# Interface: `ConfirmedStep`

Defined in: [scene/step.ts:5](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L5)

Represents a confirmed step in a scene flow.

## Properties

### createdAt

```ts
createdAt: Date;
```

Defined in: [scene/step.ts:17](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L17)

Timestamp when the step was confirmed.

***

### id

```ts
id: string;
```

Defined in: [scene/step.ts:7](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L7)

Unique identifier of the confirmed step.

***

### messageID

```ts
messageID: string;
```

Defined in: [scene/step.ts:11](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L11)

Message that triggered the confirmation.

***

### scene

```ts
scene: string;
```

Defined in: [scene/step.ts:13](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L13)

Scene identifier.

***

### step

```ts
step: string;
```

Defined in: [scene/step.ts:15](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L15)

Step key within the scene.

***

### threadID

```ts
threadID: string;
```

Defined in: [scene/step.ts:9](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/step.ts#L9)

Thread the step belongs to.

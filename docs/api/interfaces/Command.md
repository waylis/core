[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / Command

# Interface: `Command`

Defined in: [scene/command.ts:2](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/command.ts#L2)

Represents a command that can trigger a scene.

## Properties

### description?

```ts
optional description: string;
```

Defined in: [scene/command.ts:8](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/command.ts#L8)

A short description explaining what the command does.

***

### label?

```ts
optional label: string;
```

Defined in: [scene/command.ts:6](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/command.ts#L6)

A human-readable label for the command.

***

### value

```ts
value: string;
```

Defined in: [scene/command.ts:4](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/command.ts#L4)

The unique identifier or value of the command.

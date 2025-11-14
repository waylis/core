[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / createCommand

# Function: `createCommand()`

```ts
function createCommand(params: Command): Command;
```

Defined in: [scene/command.ts:26](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/scene/command.ts#L26)

Create a new `Command` object.

This function is a simple factory for creating `Command` instances,
ensuring the object matches the expected interface and restrictions.

## Parameters

### params

[`Command`](../interfaces/Command.md)

The parameters for the command.

## Returns

[`Command`](../interfaces/Command.md)

The newly created `Command` object.

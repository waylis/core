[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / createCommand

# Function: `createCommand()`

```ts
function createCommand(params: Command): Command;
```

Defined in: [src/scene/command.ts:26](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/scene/command.ts#L26)

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

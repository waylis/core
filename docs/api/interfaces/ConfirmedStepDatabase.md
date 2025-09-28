[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / ConfirmedStepDatabase

# Interface: `ConfirmedStepDatabase`

Defined in: [src/scene/step.ts:38](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/step.ts#L38)

Abstraction for confirmed step persistence.

## Extended by

- [`Database`](Database.md)

## Methods

### addConfirmedStep()

```ts
addConfirmedStep(step: ConfirmedStep): Promise<void>;
```

Defined in: [src/scene/step.ts:43](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/step.ts#L43)

Store a confirmed step.

#### Parameters

##### step

[`ConfirmedStep`](ConfirmedStep.md)

Step to add.

#### Returns

`Promise`\<`void`\>

***

### deleteOldConfirmedSteps()

```ts
deleteOldConfirmedSteps(maxDate: Date): Promise<number>;
```

Defined in: [src/scene/step.ts:56](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/step.ts#L56)

Delete all confirmed steps created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`number`\>

Number of deleted steps.

***

### getConfirmedStepsByThreadID()

```ts
getConfirmedStepsByThreadID(threadID: string): Promise<ConfirmedStep[]>;
```

Defined in: [src/scene/step.ts:49](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/step.ts#L49)

Retrieve all confirmed steps belonging to a thread.

#### Parameters

##### threadID

`string`

Thread identifier.

#### Returns

`Promise`\<[`ConfirmedStep`](ConfirmedStep.md)[]\>

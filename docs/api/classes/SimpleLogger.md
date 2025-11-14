[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / SimpleLogger

# Class: `SimpleLogger`

Defined in: [logger/logger.ts:22](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/logger/logger.ts#L22)

A simple logger implementation with configurable log levels and optional file output.

## Implements

- [`Logger`](../interfaces/Logger.md)

## Constructors

### Constructor

```ts
new SimpleLogger(options: {
  levels?: LogLevel[];
  logsDir?: string;
  writeToFile?: boolean;
}): SimpleLogger;
```

Defined in: [logger/logger.ts:34](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/logger/logger.ts#L34)

Creates a new SimpleLogger instance.

#### Parameters

##### options

Configuration options.

###### levels?

[`LogLevel`](../type-aliases/LogLevel.md)[] = `...`

Logging levels to enable. Defaults to all levels.

###### logsDir?

`string` = `"logs"`

Directory where log files will be stored. Defaults to `"logs"`.

###### writeToFile?

`boolean` = `true`

Whether to write logs to files in addition to console. Defaults to `true`.

#### Returns

`SimpleLogger`

## Methods

### debug()

```ts
debug(...args: unknown[]): void;
```

Defined in: [logger/logger.ts:76](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/logger/logger.ts#L76)

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`debug`](../interfaces/Logger.md#debug)

***

### error()

```ts
error(...args: unknown[]): void;
```

Defined in: [logger/logger.ts:72](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/logger/logger.ts#L72)

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`error`](../interfaces/Logger.md#error)

***

### info()

```ts
info(...args: unknown[]): void;
```

Defined in: [logger/logger.ts:64](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/logger/logger.ts#L64)

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`info`](../interfaces/Logger.md#info)

***

### warn()

```ts
warn(...args: unknown[]): void;
```

Defined in: [logger/logger.ts:68](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/logger/logger.ts#L68)

#### Parameters

##### args

...`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`warn`](../interfaces/Logger.md#warn)

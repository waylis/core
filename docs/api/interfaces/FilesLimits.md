[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / FilesLimits

# Interface: `FilesLimits`

Defined in: [src/message/types.ts:61](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L61)

Limits for multiple files.

## Extends

- [`FileLimits`](FileLimits.md)

## Properties

### maxAmount?

```ts
optional maxAmount: number;
```

Defined in: [src/message/types.ts:62](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L62)

***

### maxSize?

```ts
optional maxSize: number;
```

Defined in: [src/message/types.ts:57](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L57)

Maximum size in bytes.

#### Inherited from

[`FileLimits`](FileLimits.md).[`maxSize`](FileLimits.md#maxsize)

***

### mimeTypes?

```ts
optional mimeTypes: string[];
```

Defined in: [src/message/types.ts:55](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L55)

Allowed MIME types.

#### Inherited from

[`FileLimits`](FileLimits.md).[`mimeTypes`](FileLimits.md#mimetypes)

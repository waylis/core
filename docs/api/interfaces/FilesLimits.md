[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / FilesLimits

# Interface: `FilesLimits`

Defined in: [message/types.ts:61](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L61)

Limits for multiple files.

## Extends

- [`FileLimits`](FileLimits.md)

## Properties

### maxAmount?

```ts
optional maxAmount: number;
```

Defined in: [message/types.ts:62](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L62)

***

### maxSize?

```ts
optional maxSize: number;
```

Defined in: [message/types.ts:57](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L57)

Maximum size in bytes.

#### Inherited from

[`FileLimits`](FileLimits.md).[`maxSize`](FileLimits.md#maxsize)

***

### mimeTypes?

```ts
optional mimeTypes: string[];
```

Defined in: [message/types.ts:55](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L55)

Allowed MIME types.

#### Inherited from

[`FileLimits`](FileLimits.md).[`mimeTypes`](FileLimits.md#mimetypes)

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / CreateFileMetaParams

# Type Alias: `CreateFileMetaParams`

```ts
type CreateFileMetaParams = Omit<FileMeta, "id" | "mimeType" | "createdAt"> & {
  mimeType?: string;
};
```

Defined in: [src/file/file.ts:95](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L95)

Parameters required to create a new file metadata object.
ID, MIME type, and creation date will be generated automatically.

## Type Declaration

### mimeType?

```ts
optional mimeType: string;
```

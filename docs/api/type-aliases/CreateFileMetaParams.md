[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / CreateFileMetaParams

# Type Alias: `CreateFileMetaParams`

```ts
type CreateFileMetaParams = Omit<FileMeta, "id" | "mimeType" | "createdAt"> & {
  mimeType?: string;
};
```

Defined in: [file/file.ts:95](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L95)

Parameters required to create a new file metadata object.
ID, MIME type, and creation date will be generated automatically.

## Type Declaration

### mimeType?

```ts
optional mimeType: string;
```

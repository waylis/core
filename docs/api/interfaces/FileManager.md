[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / FileManager

# Interface: `FileManager`

Defined in: [src/file/file.ts:100](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L100)

High-level interface for managing files and metadata.

## Methods

### deleteFile()

```ts
deleteFile(id: string): Promise<null | FileMeta>;
```

Defined in: [src/file/file.ts:128](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L128)

Delete a file by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](FileMeta.md)\>

Deleted metadata or null if not found.

***

### downloadFile()

```ts
downloadFile(id: string): Promise<ReadableStream>;
```

Defined in: [src/file/file.ts:121](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L121)

Download a file by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`ReadableStream`\>

File content as a readable stream.

***

### generateFileMeta()

```ts
generateFileMeta(meta: CreateFileMetaParams): FileMeta;
```

Defined in: [src/file/file.ts:135](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L135)

Generate metadata for a file.

#### Parameters

##### meta

[`CreateFileMetaParams`](../type-aliases/CreateFileMetaParams.md)

File metadata parameters.

#### Returns

[`FileMeta`](FileMeta.md)

Complete file metadata object.

***

### getFileMeta()

```ts
getFileMeta(id: string): Promise<null | FileMeta>;
```

Defined in: [src/file/file.ts:106](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L106)

Retrieve metadata of a file by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](FileMeta.md)\>

File metadata if found, otherwise null.

***

### uploadFile()

```ts
uploadFile(bytes: ReadableStream | Buffer<ArrayBufferLike>, meta: CreateFileMetaParams): Promise<FileMeta>;
```

Defined in: [src/file/file.ts:114](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L114)

Upload a new file with metadata.

#### Parameters

##### bytes

File content as a stream or buffer.

`ReadableStream` | `Buffer`\<`ArrayBufferLike`\>

##### meta

[`CreateFileMetaParams`](../type-aliases/CreateFileMetaParams.md)

File metadata parameters.

#### Returns

`Promise`\<[`FileMeta`](FileMeta.md)\>

Stored file metadata.

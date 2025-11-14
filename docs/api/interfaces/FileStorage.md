[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / FileStorage

# Interface: `FileStorage`

Defined in: [file/file.ts:20](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L20)

Abstraction for file storage operations.

## Properties

### isOpen

```ts
isOpen: boolean;
```

Defined in: [file/file.ts:44](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L44)

Indicates whether the storage connection is open.

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [file/file.ts:50](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L50)

Close the storage connection.

#### Returns

`Promise`\<`void`\>

***

### deleteByID()

```ts
deleteByID(id: string): Promise<boolean>;
```

Defined in: [file/file.ts:41](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L41)

Delete a file from storage by its ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`boolean`\>

True if deletion succeeded.

***

### download()

```ts
download(metadata: FileMeta): Promise<ReadableStream>;
```

Defined in: [file/file.ts:34](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L34)

Download a file from storage.

#### Parameters

##### metadata

[`FileMeta`](FileMeta.md)

File metadata.

#### Returns

`Promise`\<`ReadableStream`\>

File content as a readable stream.

***

### open()

```ts
open(): Promise<void>;
```

Defined in: [file/file.ts:47](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L47)

Open the storage connection.

#### Returns

`Promise`\<`void`\>

***

### upload()

```ts
upload(bytes: ReadableStream | Buffer<ArrayBufferLike>, metadata: FileMeta): Promise<boolean>;
```

Defined in: [file/file.ts:27](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/file/file.ts#L27)

Upload a file into storage.

#### Parameters

##### bytes

File content as a stream or buffer.

`ReadableStream` | `Buffer`\<`ArrayBufferLike`\>

##### metadata

[`FileMeta`](FileMeta.md)

Associated file metadata.

#### Returns

`Promise`\<`boolean`\>

True if upload succeeded.

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / FileStorage

# Interface: `FileStorage`

Defined in: [src/file/file.ts:20](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L20)

Abstraction for file storage operations.

## Properties

### isOpen

```ts
isOpen: boolean;
```

Defined in: [src/file/file.ts:44](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L44)

Indicates whether the storage connection is open.

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [src/file/file.ts:50](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L50)

Close the storage connection.

#### Returns

`Promise`\<`void`\>

***

### deleteByID()

```ts
deleteByID(id: string): Promise<boolean>;
```

Defined in: [src/file/file.ts:41](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L41)

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

Defined in: [src/file/file.ts:34](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L34)

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

Defined in: [src/file/file.ts:47](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L47)

Open the storage connection.

#### Returns

`Promise`\<`void`\>

***

### upload()

```ts
upload(bytes: ReadableStream | Buffer<ArrayBufferLike>, metadata: FileMeta): Promise<boolean>;
```

Defined in: [src/file/file.ts:27](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L27)

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

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / DiskFileStorage

# Class: `DiskFileStorage`

Defined in: [src/file/storage/disk.ts:9](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L9)

File storage implementation that saves files to the local disk.

## Implements

- [`FileStorage`](../interfaces/FileStorage.md)

## Constructors

### Constructor

```ts
new DiskFileStorage(storagePath?: string): DiskFileStorage;
```

Defined in: [src/file/storage/disk.ts:17](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L17)

Create a new disk-based file storage.

#### Parameters

##### storagePath?

`string`

Optional root directory path (defaults to `"files"`).

#### Returns

`DiskFileStorage`

## Properties

| Property | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="isopen"></a> `isOpen` | `boolean` | `false` | Indicates whether the storage connection is open. | [src/file/storage/disk.ts:10](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L10) |

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [src/file/storage/disk.ts:36](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L36)

Close the storage connection.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`FileStorage`](../interfaces/FileStorage.md).[`close`](../interfaces/FileStorage.md#close)

***

### deleteByID()

```ts
deleteByID(id: string): Promise<boolean>;
```

Defined in: [src/file/storage/disk.ts:72](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L72)

Delete a file from storage by its ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`boolean`\>

True if deletion succeeded.

#### Implementation of

[`FileStorage`](../interfaces/FileStorage.md).[`deleteByID`](../interfaces/FileStorage.md#deletebyid)

***

### download()

```ts
download(metadata: FileMeta): Promise<ReadableStream>;
```

Defined in: [src/file/storage/disk.ts:60](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L60)

Download a file from storage.

#### Parameters

##### metadata

[`FileMeta`](../interfaces/FileMeta.md)

File metadata.

#### Returns

`Promise`\<`ReadableStream`\>

File content as a readable stream.

#### Implementation of

[`FileStorage`](../interfaces/FileStorage.md).[`download`](../interfaces/FileStorage.md#download)

***

### open()

```ts
open(): Promise<void>;
```

Defined in: [src/file/storage/disk.ts:32](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L32)

Open the storage connection.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`FileStorage`](../interfaces/FileStorage.md).[`open`](../interfaces/FileStorage.md#open)

***

### upload()

```ts
upload(bytes: ReadableStream | Buffer<ArrayBufferLike>, metadata: FileMeta): Promise<boolean>;
```

Defined in: [src/file/storage/disk.ts:40](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/storage/disk.ts#L40)

Upload a file into storage.

#### Parameters

##### bytes

File content as a stream or buffer.

`ReadableStream` | `Buffer`\<`ArrayBufferLike`\>

##### metadata

[`FileMeta`](../interfaces/FileMeta.md)

Associated file metadata.

#### Returns

`Promise`\<`boolean`\>

True if upload succeeded.

#### Implementation of

[`FileStorage`](../interfaces/FileStorage.md).[`upload`](../interfaces/FileStorage.md#upload)

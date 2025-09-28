[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / FileDatabase

# Interface: `FileDatabase`

Defined in: [src/file/file.ts:56](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L56)

Abstraction for file metadata persistence.

## Extended by

- [`Database`](Database.md)

## Methods

### addFile()

```ts
addFile(data: FileMeta): Promise<void>;
```

Defined in: [src/file/file.ts:61](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L61)

Add file metadata to the database.

#### Parameters

##### data

[`FileMeta`](FileMeta.md)

File metadata to store.

#### Returns

`Promise`\<`void`\>

***

### deleteFileByID()

```ts
deleteFileByID(id: string): Promise<null | FileMeta>;
```

Defined in: [src/file/file.ts:81](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L81)

Delete file metadata by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](FileMeta.md)\>

Deleted metadata or null if not found.

***

### deleteOldFiles()

```ts
deleteOldFiles(maxDate: Date): Promise<string[]>;
```

Defined in: [src/file/file.ts:88](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L88)

Delete all files created before a given date.

#### Parameters

##### maxDate

`Date`

Cutoff date.

#### Returns

`Promise`\<`string`[]\>

List of deleted file IDs.

***

### getFileByID()

```ts
getFileByID(id: string): Promise<null | FileMeta>;
```

Defined in: [src/file/file.ts:68](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L68)

Retrieve file metadata by ID.

#### Parameters

##### id

`string`

File identifier.

#### Returns

`Promise`\<`null` \| [`FileMeta`](FileMeta.md)\>

Metadata if found, otherwise null.

***

### getFilesByIDs()

```ts
getFilesByIDs(ids: string[]): Promise<FileMeta[]>;
```

Defined in: [src/file/file.ts:74](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/file/file.ts#L74)

Retrieve multiple files by IDs.

#### Parameters

##### ids

`string`[]

List of file identifiers.

#### Returns

`Promise`\<[`FileMeta`](FileMeta.md)[]\>

[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / SystemMessageBody

# Type Alias: `SystemMessageBody`

```ts
type SystemMessageBody = Extract<MessageBody, 
  | {
  type: "text";
}
  | {
  type: "markdown";
}
  | {
  type: "file";
}
  | {
  type: "files";
}
  | {
  type: "linechart";
}
  | {
  type: "table";
}>;
```

Defined in: [message/types.ts:111](https://github.com/waylis/core/blob/29d83ce405b1852dcce37021d7e0f727d8d40cae/src/message/types.ts#L111)

Message bodies generated only by the system.

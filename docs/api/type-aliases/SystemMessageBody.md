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

Defined in: [src/message/types.ts:111](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/message/types.ts#L111)

Message bodies generated only by the system.

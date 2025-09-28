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

Defined in: [src/message/types.ts:111](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/message/types.ts#L111)

Message bodies generated only by the system.

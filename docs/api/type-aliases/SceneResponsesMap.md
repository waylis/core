[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / SceneResponsesMap

# Type Alias: `SceneResponsesMap<Steps>`

```ts
type SceneResponsesMap<Steps> = { [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? MessageBodyMap[T] : never };
```

Defined in: [src/scene/scene.ts:5](https://github.com/waylis/core/blob/ec4e52cc907d26692651cc5868e974b2792624f2/src/scene/scene.ts#L5)

Maps scene steps to their expected response body content.

## Type Parameters

### Steps

`Steps` *extends* readonly [`SceneStep`](../interfaces/SceneStep.md)[]

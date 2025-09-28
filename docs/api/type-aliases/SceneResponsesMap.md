[**@waylis/core**](../index.md)

***

[@waylis/core](../index.md) / SceneResponsesMap

# Type Alias: `SceneResponsesMap<Steps>`

```ts
type SceneResponsesMap<Steps> = { [S in Steps[number] as S["key"]]: S extends SceneStep<S["key"], infer T> ? MessageBodyMap[T] : never };
```

Defined in: [src/scene/scene.ts:5](https://github.com/waylis/core/blob/cf814abeb0d255c46b018529492ef3597811d428/src/scene/scene.ts#L5)

Maps scene steps to their expected response body content.

## Type Parameters

### Steps

`Steps` *extends* readonly [`SceneStep`](../interfaces/SceneStep.md)[]

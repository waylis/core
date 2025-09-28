# App server

App server combines commands, scenes, and the built-in HTTP server into a single working app.

You can create a new instance of server using [`AppServer`](/api/classes/AppServer) class:

```ts
import { AppServer } from "@waylis/core";
```

```ts
const app = new AppServer();
```

::: tip

It has a flexible [configuration](/guides/configuration), so you can easily tune the server according to your needs.

:::

Before starting a server you need to regeister all your scenes using [`addScene`](/api/classes/AppServer#addscene) method:

```ts
app.addScene(yourCommand1, yourScene1);
app.addScene(yourCommand2, yourScene2);
app.addScene(yourCommand3, yourScene3);
```

To run the server, just call [`start`](/api/classes/AppServer#start) method:

```ts
app.start();
```

By default, the server starts on http://localhost:7770.

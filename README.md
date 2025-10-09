<br>
<p align="center">
  <a href="https://github.com/waylis/core">
    <img src="https://raw.githubusercontent.com/waylis/core/refs/heads/master/docs/public/logo-black-white.svg" alt="logo" height="128">
  </a>
</p>

<h2 align="center">Waylis</h2>
<p align="center">A quick and simple way to communicate with your Node.js app from the browser.</p>
<p align="center">
🔍 <a href="https://waylis.github.io">Documentation</a>
&nbsp; 🧩 <a href="https://waylis.github.io/examples">Examples</a>
&nbsp; 💻 <a href="https://waylis.yurace.pro/">Live demo</a>
&nbsp; 🚨 <a href="https://github.com/waylis/core/issues/new">Bug report</a>
</p>
<br />

<img src="https://raw.githubusercontent.com/waylis/core/refs/heads/master/docs/public/promo.webp" alt="promo">

**Waylis** is a Node.js package that provides a quick and simple way to interact with your application’s logic directly from the browser. It offers a developer-friendly API for building interactive scenes and a user-friendly interface for exchanging information with your app.

Define exactly what kind of data you expect with precise validation and constraints. Then work with it as you need and send responses back to users in any formats (such as text, files, tables, charts).

⚡ It’s like Express.js, but instead of exposing an HTTP API for developers — you expose a user-friendly UI for end users.

> [!WARNING]
> Waylis is a new project and currently in beta phase. Updates released before version 1.0 may introduce breaking changes.

## Features

-   **Wide range of usage**: from standalone offline tools to online services.
-   **Built-in input validation**: accept only data you need from users (strings, numbers, booleans, dates, files).
-   **Configurable**: comes with flexible server configuration.
-   **Pluggable**: supports custom databases, file storages, loggers by implementing simple interfaces.
-   **No heavy dependencies**: all core functions and the HTTP server are written using only the standard Node.js library.
-   **Minimalistic web UI**: with responsive layout and themes.

## Quick start

Install package from NPM:

```sh
npm install @waylis/core
```

Write some code:

```ts
import { AppServer, createCommand, createScene, createStep } from "@waylis/core";

const command = createCommand({ value: "hello", label: "Hello World" });

const step = createStep({
    key: "name",
    prompt: { type: "text", content: "What is your name?" },
    reply: { bodyType: "text" },
});

const scene = createScene({
    steps: [step],
    handler: async (answers) => {
        return { type: "text", content: `Hello, ${answers.name}!` };
    },
});

const app = new AppServer();
app.addScene(command, scene);
app.start();
```

Run it:

```sh
node ./main.js
```

And see the result on http://localhost:7770

## Contribution

If you have any suggestions, or you have found some kind of bugs, feel free to create an [Issue on GitHub](https://github.com/waylis/core/issues). If you have specific suggestions for making changes to the source code, you can create a [Pull Request](https://github.com/waylis/core/pulls).

## Licence

Released under the [MIT License](http://www.opensource.org/licenses/MIT).

# Server configuration

The [App Server](/fundamentals/app-server) class supports configuration via the `config` argument when creating a new instance.

```ts
import { AppServer } from "@waylis/core";
```

```ts
const app = new AppServer({
    config: {
        // Your custom configuration
    },
});
```

Below in this guide is a complete description of all available fields for the configuration object.

## port

-   Type: `number`
-   Default: `7770`

The port on which the HTTP server runs.

## defaultPageLimit

-   Type: `number`
-   Default: `20`

Default pagination size for endpoints (chats, messages).

## idGenerator

-   Type: `() => string`
-   Default: `crypto.randomUUID()`

Function for generating unique identifiers (IDs) for all elements in the system.

## app.name

-   Type: `string`
-   Default: `Waylis`

The name of your application. It will be displayed in the header of the web client and in the browser tab.

## app.description

-   Type: `string`

Description for your application. Will be displayed when there are no messages in the chat or when you click on the application name in the header.

Supports Markdown markup thanks to [react-markdown](https://www.npmjs.com/package/react-markdown) package and [remark-gfm](https://www.npmjs.com/package/remark-gfm) plugin on the frontend side.

## app.faviconURL

-   Type: `string`

URL to web page icon. Displayed by the browser in the tab before the page title.

## auth.handler

-   Type: `(req: IncomingMessage, res: ServerResponse) => Promise<void>`
-   Default: [simpleAuthHandler](https://github.com/waylis/core/blob/master/src/server/handlers.ts#L246)

Authentication (login) handler that attach unique user ID via cookies.

With this handler, you can flexibly implement any authorization mechanism using existing systems. Waylis only requires a unique identifier for each user via the `user_id` field embedded in the [HTTP cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies).

## auth.middleware

-   Type: `(req: IncomingMessage) => Promise<string>`
-   Default: [simpleAuthMiddleware](https://github.com/waylis/core/blob/master/src/server/helpers.ts#L69)

Authentication middleware that extracts a unique user identifier from the HTTP cookie or throws 401 error.

## auth.logoutHandler

-   Type: `(req: IncomingMessage, res: ServerResponse) => Promise<void>`
-   Default: [simpleLogoutHandler](https://github.com/waylis/core/blob/master/src/server/handlers.ts#L254)

Handler that clear the authentication cookie.

## cleanup.interval

-   Type: `number`
-   Default: `1200`

Interval (in seconds) between cleanup tasks (deleting old messages and files). Every 20 minutes by default.

## cleanup.messageTTL

-   Type: `number`
-   Default: `2592000`

How long (in seconds) messages are kept before being deleted from database. Default is 30 days.

## cleanup.fileTTL

-   Type: `number`
-   Default: `2592000`

How long (in seconds) files are kept before being deleted from database and file storage. Default is 30 days.

## limits.maxChatsPerUser

-   Type: `number`
-   Default: `50`

Maximum number of chats a single user can create.

## sse.heartbeatInterval

-   Type: `number`
-   Default: `5`

Interval (in seconds) between heartbeat pings to keep [SSE](https://en.wikipedia.org/wiki/Server-sent_events) connections alive.

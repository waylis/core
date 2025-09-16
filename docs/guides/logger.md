# Custom logger

Waylis outputs logs to the terminal and also has a built-in ability to save them to files.

By default, a simple built-in [SimpleLogger](https://github.com/waylis/core/blob/master/src/logger/logger.ts) is used:

```ts
import { SimpleLogger } from "@waylis/core";
```

```ts
const app = new AppServer({
    logger: new SimpleLogger({
        levels: ["error", "warn", "info", "debug"],
        logsDir: "logs",
        writeToFile: true,
    }),
});
```

If you wish, you can use your own logger, which must satisfy the [Logger]() interface:

```ts
interface Logger {
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    debug(...args: unknown[]): void;
}
```

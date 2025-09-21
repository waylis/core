# Custom database

Waylis uses external storage to store messages, chats, and other auxiliary data.

## Built-in

The `@waylis/core` package includes two implementations of such storage:

-   [JSONDatabase](https://github.com/waylis/core/blob/master/src/database/json/json.ts) — A simple database that stores data in a single JSON file (used by default).

```ts
import { JSONDatabase } from "@waylis/core";
```

```ts
const app = new AppServer({
    db: new JSONDatabase("db.json"),
});
```

-   [MemoryDatabase](https://github.com/waylis/core/blob/master/src/database/memory/memory.ts) — An even simpler database that stores data in the server's RAM. Data is lost after each restart, so this implementation is only suitable for testing or development mode.

```ts
import { MemoryDatabase } from "@waylis/core";
```

```ts
const app = new AppServer({ db: new MemoryDatabase() });
```

## Community packages

Over time, as needed, ready-made packages for integration with various databases will become available for Waylis. These may be either official packages or those created by other developers.

-   [SqliteDatabase](https://github.com/waylis/sqlite-db) — Official package for the [Sqlite](https://en.wikipedia.org/wiki/SQLite) database.

## Any other database

Waylis makes it easy to implement any other database implementation that satisfies the [Database](https://github.com/waylis/core/blob/master/src/database/database.ts) interface.

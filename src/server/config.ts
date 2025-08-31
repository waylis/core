import { IncomingMessage, ServerResponse } from "http";
import { simpleAuthHandler } from "./handlers";
import { simpleAuthMiddleware } from "./helpers";
import { randomUUID } from "../utils/random";

export interface ServerConfig {
    /** Port number the server should listen on */
    port: number;
    /** Default number of items per page for paginated endpoints */
    defaultPageLimit: number;
    // Default function for generating unique identifiers
    idGenerator: () => string;

    /** Authentication configuration */
    auth: {
        /** Authentication (login) handler that attach unique user ID via cookies */
        handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
        /** Authentication middleware that returns user ID or throws */
        middleware: (req: IncomingMessage) => Promise<string>;
    };

    /** Cleanup-related configuration */
    cleanup: {
        /** Interval (in seconds) for cleaning tasks */
        interval: number;
        /** How long (in seconds) messages should be kept before automatic cleanup */
        messageTTL: number;
        /** How long (in seconds) uploaded files should be kept before automatic cleanup */
        fileTTL: number;
    };

    /** System limits and constraints */
    limits: {
        /** Maximum number of chats a single user can create */
        maxChatsPerUser: number;
    };

    /** System metadata */
    app: {
        name?: string;
        description?: string;
        faviconURL?: string;
    };

    /** SSE configuration */
    sse: {
        /** Interval (in seconds) for Server-sent Events heartbeat messages */
        heartbeatInterval: number;
    };
}

export const defaultConfig: ServerConfig = {
    port: 7331,
    defaultPageLimit: 20,
    idGenerator: randomUUID,

    auth: {
        handler: simpleAuthHandler,
        middleware: simpleAuthMiddleware,
    },

    cleanup: {
        interval: 1200,
        messageTTL: 2592000, // 30 days
        fileTTL: 2592000, // 30 days
    },

    limits: {
        maxChatsPerUser: 50,
    },

    app: {},

    sse: {
        heartbeatInterval: 5,
    },
};

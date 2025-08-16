import { IncomingMessage, ServerResponse } from "http";
import { authHandler } from "./handlers";
import { identifyUser } from "./helpers";

export interface ServerConfig {
    /** Port number the server should listen on */
    port: number;

    /** Interval (in seconds) for Server-sent Events heartbeat messages */
    sseHeartbeatInterval: number;

    /** Default number of items per page for paginated endpoints */
    defaultPageLimit: number;

    /** Authentication (login) handler that attach unique user ID via cookies */
    authHandler: (req: IncomingMessage, res: ServerResponse) => Promise<void>;

    /** Authentication middleware that returns user ID or throws */
    authMiddleware: (req: IncomingMessage) => Promise<string>;

    /** Interval (in seconds) for cleaning tasks */
    cleanupInterval: number;

    /** System limits and constraints */
    limits: {
        /** Maximum number of chats a single user can create */
        maxChatsPerUser: number;
        /** How long (in seconds) messages should be kept before automatic cleanup */
        messagesLifetime: number;
        /** How long (in seconds) uploaded files should be kept before automatic cleanup */
        filesLifetime: number;
    };

    /** Application metadata */
    appInfo: {
        name?: string;
        description?: string;
        faviconURL?: string;
    };
}

export const defaultConfig: ServerConfig = {
    port: 7331,
    sseHeartbeatInterval: 5,
    defaultPageLimit: 20,
    authHandler: authHandler,
    authMiddleware: identifyUser,
    cleanupInterval: 1200, // 20 min

    limits: {
        maxChatsPerUser: 50,
        messagesLifetime: 2592000, // 30 days
        filesLifetime: 2592000, // 30 days
    },

    appInfo: {},
};

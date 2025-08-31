import { describe, it } from "node:test";
import assert from "node:assert";
import {
    CreateUserMessageParams,
    MessageManager,
    SYSTEM_SENDER_ID,
    CreateSystemMessageParams,
    Message,
} from "../src/message/message";
import { TextLimits, NumberLimits, DatetimeLimits, OptionLimits, FileLimits, FilesLimits } from "../src/message/types";
import { Option } from "../src/message/option";

describe("createSystemMessage", () => {
    const mockUserMessage: Message = {
        id: "user-msg-123",
        chatID: "chat-456",
        senderID: "user-789",
        threadID: "thread-101",
        body: { type: "text", content: "test" },
        createdAt: new Date(),
    };

    const baseParams: CreateSystemMessageParams = {
        body: { type: "text", content: "test" },
        chatID: "default-chat-id",
    };

    const manager = new MessageManager();

    it("should create system message with user message reference", () => {
        const result = manager.createSystemMessage(baseParams, mockUserMessage);

        assert.deepStrictEqual(result, {
            id: result.id,
            senderID: SYSTEM_SENDER_ID,
            ...baseParams,
            threadID: mockUserMessage.threadID,
            replyTo: mockUserMessage.id,
            chatID: mockUserMessage.chatID,
            createdAt: result.createdAt,
        });
        assert(result.createdAt instanceof Date);
    });

    it("should create system message without user message", () => {
        const result = manager.createSystemMessage(baseParams);

        assert.deepStrictEqual(result, {
            id: result.id,
            senderID: SYSTEM_SENDER_ID,
            ...baseParams,
            threadID: result.threadID,
            replyTo: undefined,
            chatID: baseParams.chatID,
            createdAt: result.createdAt,
        });
    });

    it("should throw error when no chatID provided without user message", () => {
        const params: CreateSystemMessageParams = { body: { type: "text", content: "test" } };
        assert.throws(() => manager.createSystemMessage(params), { name: "Error" });
    });

    it("should override params.chatID when user message provided", () => {
        const paramsWithChatID = { ...baseParams, chatID: "should-be-overridden" };
        const result = manager.createSystemMessage(paramsWithChatID, mockUserMessage);

        assert.strictEqual(result.chatID, mockUserMessage.chatID);
    });

    it("should generate new threadID when no user message", () => {
        const result = manager.createSystemMessage(baseParams);
        assert.equal(typeof result.threadID, "string");
    });

    it("should use user message threadID when provided", () => {
        const result = manager.createSystemMessage(baseParams, mockUserMessage);
        assert.strictEqual(result.threadID, mockUserMessage.threadID);
    });
});

describe("createUserMessage", () => {
    const baseParams: CreateUserMessageParams = {
        chatID: "chat-123",
        senderID: "user-456",
        body: { type: "text", content: "Hello" },
    };

    const mockReplyMessage: Message = {
        id: "reply-msg-789",
        chatID: "chat-123",
        senderID: "user-456",
        threadID: "thread-101",
        body: { type: "text", content: "Original message" },
        createdAt: new Date(),
        replyRestriction: undefined,
    };

    const manager = new MessageManager();

    describe("Basic message creation", () => {
        it("should create simple user message without reply", () => {
            const result = manager.createUserMessage(baseParams);

            assert.deepStrictEqual(result, {
                id: result.id,
                ...baseParams,
                threadID: result.threadID,
                createdAt: result.createdAt,
            });
            assert(result.createdAt instanceof Date);
        });

        it("should create message with reply but without restrictions", () => {
            const result = manager.createUserMessage(baseParams, mockReplyMessage);

            assert.strictEqual(result.replyTo, mockReplyMessage.id);
            assert.strictEqual(result.threadID, mockReplyMessage.threadID);
        });
    });

    describe("Text restrictions", () => {
        it("should validate text length (min)", () => {
            const replyMsg: Message = {
                ...mockReplyMessage,
                replyRestriction: {
                    bodyType: "text",
                    bodyLimits: { minLength: 10 } as TextLimits,
                },
            };

            assert.throws(
                () => manager.createUserMessage({ ...baseParams, body: { type: "text", content: "Short" } }, replyMsg),
                { message: /at least 10 characters/ }
            );
        });

        it("should validate text length (max)", () => {
            const replyMsg: Message = {
                ...mockReplyMessage,
                replyRestriction: {
                    bodyType: "text",
                    bodyLimits: { maxLength: 5 } as TextLimits,
                },
            };

            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "text", content: "Too long text" } },
                        replyMsg
                    ),
                { message: /no more than 5 characters/ }
            );
        });
    });

    describe("Number restrictions", () => {
        const numberReplyMsg = (limits: Partial<NumberLimits>): Message => ({
            ...mockReplyMessage,
            replyRestriction: {
                bodyType: "number",
                bodyLimits: limits as NumberLimits,
            },
        });

        it("should validate integer only", () => {
            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "number", content: 3.14 } },
                        numberReplyMsg({ integerOnly: true })
                    ),
                { message: /must be a valid integer/ }
            );
        });

        it("should validate min number", () => {
            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "number", content: 5 } },
                        numberReplyMsg({ min: 10 })
                    ),
                { message: /minimum allowed value is 10/ }
            );
        });
    });

    describe("Datetime restrictions", () => {
        const dateReplyMsg = (limits: Partial<DatetimeLimits>): Message => ({
            ...mockReplyMessage,
            replyRestriction: {
                bodyType: "datetime",
                bodyLimits: limits as DatetimeLimits,
            },
        });

        it("should validate min date", () => {
            const minDate = new Date("2023-01-01");
            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "datetime", content: new Date("2022-12-31") } },
                        dateReplyMsg({ min: minDate })
                    ),
                { message: /The date is too old/ }
            );
        });
    });

    describe("Option restrictions", () => {
        const optionReplyMsg = (options: Option[]): Message => ({
            ...mockReplyMessage,
            replyRestriction: {
                bodyType: "option",
                bodyLimits: { options } as OptionLimits,
            },
        });

        it("should validate option exists", () => {
            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "option", content: "invalid" } },
                        optionReplyMsg([{ value: "valid" }])
                    ),
                { message: /does not exist/ }
            );
        });
    });

    describe("File restrictions", () => {
        const validFile = {
            id: "file-123",
            mimeType: "image/png",
            name: "test.png",
            path: "/uploads/test.png",
            size: 1024,
            createdAt: new Date(),
        };

        const fileReplyMsg = (limits: Partial<FileLimits>): Message => ({
            ...mockReplyMessage,
            replyRestriction: {
                bodyType: "file",
                bodyLimits: limits as FileLimits,
            },
        });

        it("should validate file size", () => {
            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "file", content: { ...validFile, size: 10485760 } } },
                        fileReplyMsg({ maxSize: 5242880 })
                    ),
                { message: /Too large file/ }
            );
        });
    });

    describe("Multiple files restrictions", () => {
        const validFiles = [
            {
                id: "file-1",
                mimeType: "image/jpeg",
                name: "test.jpg",
                path: "/uploads/test.jpg",
                size: 1024,
                createdAt: new Date(),
            },
            {
                id: "file-2",
                mimeType: "image/png",
                name: "test.png",
                path: "/uploads/test.png",
                size: 2048,
                createdAt: new Date(),
            },
        ];

        const filesReplyMsg = (limits: Partial<FilesLimits>): Message => ({
            ...mockReplyMessage,
            replyRestriction: {
                bodyType: "files",
                bodyLimits: limits as FilesLimits,
            },
        });

        it("should validate max files amount", () => {
            assert.throws(
                () =>
                    manager.createUserMessage(
                        { ...baseParams, body: { type: "files", content: [...validFiles, ...validFiles] } },
                        filesReplyMsg({ maxAmount: 2 })
                    ),
                { message: /Too many files/ }
            );
        });
    });
});

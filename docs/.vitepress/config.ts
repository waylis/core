import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: "en-US",
    title: "Waylis",
    description: "A simple way to interact with your backend",
    head: [["link", { rel: "icon", href: "/favicon.ico" }]],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: "/logo-black-white.svg",
        nav: [
            { text: "Home", link: "/" },
            { text: "Documentation", link: "/intro" },
            { text: "API", link: "/api/" },
            { text: "Examples", link: "/examples" },
            { text: "Live demo", link: "https://github.com/waylis/core" },
        ],

        sidebar: [
            { text: "Introduction", link: "/intro" },
            { text: "First steps", link: "/first-steps" },
            {
                text: "Fundamentals",
                items: [
                    { text: "Commands", link: "/fundamentals/commands" },
                    { text: "Steps", link: "/fundamentals/steps" },
                    { text: "Scenes", link: "/fundamentals/scenes" },
                    { text: "App server", link: "/fundamentals/app-server" },
                ],
            },
            {
                text: "Guides",
                items: [
                    { text: "Working with files", link: "/guides/files" },
                    { text: "Server configuration", link: "/guides/configuration" },
                    { text: "Custom database", link: "/guides/database" },
                    { text: "Custom file storage", link: "/guides/file-storage" },
                    { text: "Custom logger", link: "/guides/logger" },
                ],
            },
            { text: "API reference", items: typedocSidebar },
        ],
        footer: {
            message: "Released under the MIT License.",
        },

        socialLinks: [{ icon: "github", link: "https://github.com/waylis/core" }],
        search: {
            provider: "local",
        },
        lastUpdated: {
            text: "Updated at",
            formatOptions: {
                dateStyle: "short",
                timeStyle: "short",
            },
        },
    },
    ignoreDeadLinks: true,
});

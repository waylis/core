import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Waylis",
    description: "A simple way to interact with your backend",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            { text: "Documentation", link: "/intro" },
            { text: "Examples", link: "/examples" },
            { text: "Live demo", link: "https://github.com/waylis/core" },
        ],

        sidebar: [
            { text: "What is Waylis?", link: "/intro" },
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
            { text: "API reference", link: "/api" },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/waylis/core" }],
    },
});

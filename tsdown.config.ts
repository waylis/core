import { defineConfig } from "tsdown";

export default defineConfig([
    {
        entry: ["./src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        outDir: "build",
    },
    {
        entry: ["src/index.shared.ts"],
        format: ["esm"],
        dts: true,
        outDir: "build-shared",
    },
]);

import { spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TEST_APP = join(ROOT, "scripts", "test-app");

async function exec(command: string, args: string[], cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log(`> ${command} ${args.join(" ")}`);
        const child = spawn(command, args, { cwd, stdio: "pipe" });
        let stdout = "";
        let stderr = "";

        child.stdout?.on("data", (data) => (stdout += data.toString()));
        child.stderr?.on("data", (data) => (stderr += data.toString()));

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                console.error("STDOUT:", stdout);
                console.error("STDERR:", stderr);
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on("error", reject);
    });
}

async function main() {
    // 1. Build the server
    await exec("npm", ["run", "build:server"], ROOT);

    // 2. Install test app dependencies
    await exec("npm", ["install"], TEST_APP);

    // 3. Start test app with timeout
    await new Promise<void>((resolve, reject) => {
        console.log("> starting test app...");
        const child = spawn("npm", ["start"], {
            cwd: TEST_APP,
            stdio: "pipe",
            timeout: 5000,
        });

        let stdout = "";
        let stderr = "";

        child.stdout?.on("data", (data) => {
            const line = data.toString();
            stdout += line;
            process.stdout.write(line);
            if (line.includes("test app started")) {
                child.kill();
                resolve();
            }
        });

        child.stderr?.on("data", (data) => {
            const line = data.toString();
            stderr += line;
            process.stderr.write(line);
        });

        child.on("close", (code) => {
            if (code === 0) return;
            console.error("Test app exited with code:", code);
            console.error("STDOUT:", stdout);
            console.error("STDERR:", stderr);
            reject(new Error(`Test app exited with code ${code}`));
        });

        child.on("error", reject);

        // Timeout fallback
        setTimeout(() => {
            child.kill();
            reject(new Error("Test app timed out after 5 seconds"));
        }, 5000);
    });

    console.log("\nBuild verification passed!");
}

main().catch((err) => {
    console.error("\nBuild verification FAILED:", err.message);
    process.exit(1);
});

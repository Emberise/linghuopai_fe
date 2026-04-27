var _a;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
var repositoryName = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split("/")[1];
var base = process.env.GITHUB_ACTIONS === "true" && repositoryName ? "/".concat(repositoryName, "/") : "/";
// https://vitejs.dev/config/
export default defineConfig({
    base: base,
    plugins: [react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        host: true,
        port: 5173,
    },
});

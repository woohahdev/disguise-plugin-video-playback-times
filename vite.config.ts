import DisguiseVitePlugin from "./src/vite-plugin.js";
import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  logLevel: "info",
  plugins: [DisguiseVitePlugin({ name: pkg.name }), viteSingleFile()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [".local"],
  },
});

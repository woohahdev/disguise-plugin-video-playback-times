import DisguiseVitePlugin from "./src/vite-plugin.js";
import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    DisguiseVitePlugin({ name: "video-playback-time" }),
    viteSingleFile(),
  ],
  server: {
    allowedHosts: ["woohah-0028417.local"],
  },
});

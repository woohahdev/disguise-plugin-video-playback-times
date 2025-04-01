import DisguiseVitePlugin from "./src/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [DisguiseVitePlugin({ name: "video-playback-time" })],
  server: {
    // @todo fixme
    allowedHosts: ["woohah-0028417.local"],
  },
});

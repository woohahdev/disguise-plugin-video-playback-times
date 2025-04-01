import { DisguisePlugin } from "./src/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [DisguisePlugin({ name: "video-playback-time" })],
  server: {
    // @todo fixme
    allowedHosts: ["woohah-0028417.local"],
  },
});

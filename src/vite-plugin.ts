import { MDNS } from "@matrixai/mdns";
import { Plugin } from "vite";

interface DisguisePluginOptions {
  name: string;
}

const DisguisePlugin = (options: DisguisePluginOptions): Plugin => {
  if (typeof options !== "object") throw new Error("options must be an object");
  if (typeof options.name !== "string")
    throw new Error("name must be a number");

  return {
    name: "disguise-plugin",
    configureServer: (server) => {
      if (!server.httpServer) throw new Error("No httpServer found");

      server.httpServer.on("listening", async () => {
        const address = server.httpServer!.address();
        if (!address || typeof address !== "object")
          throw new Error("Unexpected address found");

        const mdns = new MDNS();

        console.log(mdns);

        await mdns.start({});

        await mdns.registerService({
          name: options.name,
          port: address.port,
          protocol: "tcp",
          txt: {
            pluginType: "web",
            hostname: "localhost",
          },
          type: "d3plugin",
        });

        console.log(
          `Announced Disguise Plugin ${options.name} at http://${mdns.hostname}:${address.port}`,
        );
      });
    },
  };
};

export default DisguisePlugin;

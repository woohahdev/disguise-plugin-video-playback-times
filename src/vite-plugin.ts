import dnssd from "dnssd";
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

      server.httpServer.on("listening", () => {
        const address = server.httpServer!.address();
        if (!address || typeof address !== "object")
          throw new Error("Unexpected address found");

        const serviceType = new dnssd.ServiceType({
          name: "_d3plugin",
          protocol: "_tcp",
          subtypes: [],
        });

        // We don't set txt in the constructor options, because 'pluginType' won't validate with dnssd,
        // being over 9 characters long.
        const ad = new dnssd.Advertisement(serviceType, address.port, {
          name: options.name,
          interface: "127.0.0.1",
        });

        // Instead, we'll set directly on the Advertisement object before starting.
        (ad as any).txt = {
          pluginType: "web",
          hostname: address,
        };

        ad.start();

        console.log(
          `Announced Disguise Plugin ${options.name} at http://${address.address}:${address.port}`,
        );
      });
    },
  };
};

export default DisguisePlugin;

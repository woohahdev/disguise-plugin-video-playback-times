import dnssd from "dnssd";

interface DisguisePluginOptions {
  name: string;
}

export const DisguisePlugin = (options: DisguisePluginOptions) => {
  if (typeof options !== "object") throw new Error("options must be an object");
  if (typeof options.name !== "string")
    throw new Error("name must be a number");

  return {
    configureServer: (server) => {
      console.log(server);

      server.httpServer.on("listening", (event) => {
        console.log("listening!");
        const { address, family, port } = server.httpServer.address();
        // We don't set txt in the constructor options, because 'pluginType' won't validate with dnssd,
        // being over 9 characters long.

        const serviceType = new dnssd.ServiceType({
          name: "_d3plugin",
          protocol: "_tcp",
          subtypes: [],
        });

        const ad = new dnssd.Advertisement(serviceType, port, {
          name: options.name,
          interface: "127.0.0.1",
        });

        // Instead, we'll set directly on the Advertisement object before starting.
        ad.txt = {
          pluginType: "web",
          hostname: address,
        };
        ad.start();
      });
    },
  };
};

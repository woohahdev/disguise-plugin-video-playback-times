import html from "../dist/index.html" with { type: "text " };
import pkg from "../package.json";
import Bun from "bun";
import dnssd from "dnssd";

interface PluginAppOptions {
  name: string;
}

class PluginApp {
  server: Bun.Server;

  constructor(options: PluginAppOptions) {
    this.server = Bun.serve({
      fetch: () =>
        new Response(html, { headers: { "Content-Type": "text/html" } }),
    });

    const name = options.name;
    const port = this.server.port;
    const hostname = this.server.hostname;

    const serviceType = new dnssd.ServiceType({
      name: "_d3plugin",
      protocol: "_tcp",
      subtypes: [],
    });

    // We don't set txt in the constructor options, because 'pluginType' won't validate with dnssd,
    // being over 9 characters long.
    const ad = new dnssd.Advertisement(serviceType, port, {
      name: pkg.name,
      interface: "127.0.0.1",
    });

    // Instead, we'll set directly on the Advertisement object before starting.
    (ad as any).txt = {
      pluginType: "web",
      hostname: this.server.hostname,
    };

    ad.start();

    console.log(
      `Started Disguise Plugin ${name} at http://${hostname}:${port}`,
    );
  }
}

const app = new PluginApp({
  name: pkg.name,
});

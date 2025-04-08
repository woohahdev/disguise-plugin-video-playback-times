//import html from "../dist/index.html" with { type: "text " };
import pkg from "../package.json" with { type: "json" };

import { createServerAdapter } from "@whatwg-node/server";
import { createServer, Server } from "node:http";

interface PluginAppOptions {
  name: string;
}

class PluginApp {
  server: Server;
  name: string;
  port: number;

  constructor(options: PluginAppOptions) {
    this.port = 23151;
    // You can create your Node server instance by using our adapter
    this.server = createServer(
      createServerAdapter(
        () => new Response(``, { headers: { "Content-Type": "text/html" } }),
      ),
    );

    this.server.listen(this.port);

    this.name = options.name;
    this.port = this.port;
  }

  async start() {
    const { MDNS } = await import("@matrixai/mdns");

    const mdns = new MDNS();

    await mdns.start({});

    await mdns.registerService({
      name: this.name,
      port: this.port,
      protocol: "tcp",
      txt: {
        pluginType: "web",
      },
      type: "d3plugin",
    });

    console.log(
      `Announced Disguise Plugin ${this.name} at http://${mdns.hostname}:${this.port}`,
    );
  }
}

const pluginApp = new PluginApp({
  name: pkg.name,
});

pluginApp.start();

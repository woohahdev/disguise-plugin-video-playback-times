//import pkg from "../package.json" with { type: "json" };

import { createServerAdapter } from "@whatwg-node/server";
import { createServer, Server } from "node:http";
import { app, App, BrowserWindow } from "electron";

interface PluginAppOptions {
  name: string;
  electronApp: App;
}

class PluginApp {
  server: Server;
  name: string;
  port: number;
  electronApp: App;
  window: BrowserWindow;

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

    this.electronApp = options.electronApp;

    console.log(this.electronApp);

    this.window = new BrowserWindow({
      width: 200,
      height: 200,
    });

    this.start();
  }

  async start() {

    const html = await fetch("../dist/index.html");
    console.log(html);

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

    const url = new URL(`http://${mdns.hostname}:${this.port}`);
    console.log(
      `Announced Disguise Plugin ${this.name} at ${url.toString()}`,
    );

    this.window.loadURL(url.toString());

  }
}

app.whenReady().then(() => {

  console.log("Ready!");
const pluginApp = new PluginApp({
  name: 'test',//'pkg.name',
  electronApp: app
});

});


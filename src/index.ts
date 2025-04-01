import dnssd from "dnssd";

class App {
  ad: dnssd.Advertisement;

  constructor() {
    const serviceType = new dnssd.ServiceType({
      name: "_d3plugin",
      protocol: "_tcp",
      subtypes: [],
    });

    // @todo 'pluginType' won't validate, needs a source code hack.

    this.ad = new dnssd.Advertisement(serviceType, 5173, {
      name: "vite",
      interface: "127.0.0.1",
      txt: {
        pluginType: "web",
        hostname: "localhost",
      },
    });
    this.ad.start();
  }
}

new App();

export class D3Plugin {
  directorWsUrl: URL;
  directorRestUrl: URL;
  websocket!: WebSocket;

  constructor() {
    const director =
      new URL(document.location.href).searchParams.get("director") ??
      "localhost:80";
    this.directorWsUrl = new URL(`ws://${director}`);
    this.directorRestUrl = new URL(`http://${director}`);

    this.setupLiveUpdate();
  }

  setupLiveUpdate() {
    const url = new URL("/api/session/liveupdate", this.directorWsUrl);

    this.websocket = new WebSocket(url.toString());
    this.websocket.onopen = () => {
      console.log("Connection established");
    };
    this.websocket.onmessage = (event) => {
      console.log(event);
    };
    this.websocket.onerror = (error) => {
      console.error(error);
    };
  }

  async runPython(script: string) {
    if (typeof script !== "string") throw new Error("script must be a string");

    const url = new URL("/api/session/python/execute", this.directorRestUrl);

    const response = await fetch(url.toString(), {
      method: "POST",
      body: JSON.stringify({
        script,
      }),
    });

    const result = await response.json();

    let returnValue;
    try {
      returnValue = JSON.parse(result.returnValue);
    } catch (error) {
      returnValue = result.returnValue;
    }

    return {
      d3Log: result.d3Log,
      pythonLog: result.pythonLog,
      returnValue,
    };
  }
}

export class D3Plugin {
  constructor() {
    this.director =
      new URL(document.location).searchParams.get("director") ?? "localhost:80";
    const url = new URL("/api/session/liveupdate", `ws://${this.director}`);

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

  async runPython(script) {
    const url = new URL(
      "/api/session/python/execute",
      `http://${this.director}`,
    );
    const response = await fetch(url.toString(), {
      method: "POST",
      body: JSON.stringify({
        script,
      }),
    });
    const result = await response.json();
    return {
      d3Log: result.d3Log,
      pythonLog: result.pythonLog,
      returnValue: JSON.parse(result.returnValue),
    };
  }
}

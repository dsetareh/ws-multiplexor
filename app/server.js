/*jshint esversion: 6 */

const WebSocket = require("ws");

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocket.Server({ port: 8080, perMessageDeflate: true });

wss.on("connection", function connection(ws, req) {
  const ip = req.headers["x-forwarded-for"].split(/\s*,\s*/)[0];

  console.log(
    new Date(Date.now()).toLocaleString() + " - Client " + ip + " Connected"
  );

  ws.isAlive = true;
  ws.on("pong", heartbeat);
});

wss.on("error", function connection(error) {
  console.log("ERROR");
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      console.log("Terminated a Connection");
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);

wss.on("close", function wsError() {
  console.log(new Date(Date.now()).toLocaleString() + " - Client Disconnected");
  clearInterval(interval);
});

var cheat = function () {
  var ws = new WebSocket("ws://local.ip:port/websocket");
  ws.on("open", function () {
    console.log(
      new Date(Date.now()).toLocaleString() + " - Server connected to WS"
    );
  });
  ws.on("close", function () {
    console.log(
      new Date(Date.now()).toLocaleString() + " - Server disconnected from WS"
    );
    setTimeout(cheat, 1500);
  });
  ws.on("error", function () {
    console.log("error");
  });

  ws.on("message", function inc(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
};
cheat();

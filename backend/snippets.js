

// var path = require('path');
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', (req, res) => {
//   console.error('express connection');
//   res.sendFile(path.join(__dirname, 'si.html'));
// });

// io.on('connection', s => {
//   console.error('socket.io connection');
//   for (var t = 0; t < 3; t++)
//     setTimeout(() => s.emit('message', 'message from server'), 1000*t);
// });

// http.listen(3002, () => console.error('listening on http://localhost:3002/'));

// console.error('socket.io example');


const express = require("express")
const app = express()
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const port = 5000

app.listen(port, () => {
  console.log('up at 5000')
})

app.get('/', (req, res) => {
  res.status(200)
})

wss.on('connection', (ws) => {
  const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1m');
  
  binanceWs.onmessage = (event) => {
    const data = JSON.parse(event.data);
    ws.send(JSON.stringify(data)); // Forward the data to the client
  };

  ws.on('close', () => {
    binanceWs.close(); // Close the Binance WebSocket when the client disconnects
  });
});


console.log("ws server up at 8080")















// const socket = new WebSocket()

// console.log(socket)

// var path = require("path");
// var app = require("express")();
// var ws = require("express-ws")(app);

// app.get("/", (req, res) => {
//   console.error("express connection");
//   res.sendFile(path.join(__dirname, "ws.html"));
// });
// app.ws("/", (s, req) => {
//   console.error("websocket connection");
//   for (var t = 0; t < 3; t++)
//     setTimeout(() => s.send("message from server", () => {}), 1000 * t);
// });
// app.listen(3001, () => console.error("listening on http://localhost:3001/"));
// console.error("websocket example");


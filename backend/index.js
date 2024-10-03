const express = require("express")
const app = express()
const port = 5000
test = true
const baseURL = test ? `wss://testnet.binance.vision/ws-api/v3` : `wss://ws-api.binance.com:443/ws-api/v3`;
// const {}


const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 443 })


sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', data => {
      sockserver.clients.forEach(client => {
        console.log(`distributing message: ${data}`)
        client.send(`${data}`)
      })
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
   })


// app.listen(port, () => {
//     console.log('listening on server ', port)
// })

/*
webSocket = async () => {
	const instrument = "BTCUSDT";
	const interval = "15m";

	const ws = new WebSocket("wss://stream.binance.com:9443/ws/" + instrument.toLowerCase() + "@kline_" + interval);
	ws.on('message', function incoming(response) {
		let data = JSON.parse(response);
		let instrumentName = data.k.s;
		let time = moment(data.k.t).format('YYYY-MM-DD HH:mm:ss');
		let closeValue = data.k.c

		console.log(time + " - " + instrumentName + " - " + closeValue);

	});
}

webSocket()
*/
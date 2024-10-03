const express = require("express")
const app = express()
const port = 5000
test = true
const baseURL = test ? `wss://testnet.binance.vision/ws-api/v3` : `wss://ws-api.binance.com:443/ws-api/v3`;

// app.listen(port, () => {
//     console.log('listening on server ', port)
// })
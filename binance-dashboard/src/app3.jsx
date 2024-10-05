import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const options = {
  legend: "none",
  bar: { groupWidth: "100%" }, // Remove space between bars.
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
    risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
  },
};

const data = [
  ["Day", "", "", "", ""],
  ["Mon", 20, 28, 38, 45],
  ["Tue", 31, 38, 55, 66],
  ["Wed", 50, 55, 77, 80],
  ["Thu", 77, 77, 66, 50],
  ["Fri", 68, 66, 22, 15],
  // t, l, o, c, h,
];

export default function App() {
  // Initial state for candlestick chart data
  const [candlestickData, setCandlestickData] = useState([
    ["Time", "Low", "Open", "Close", "High"], // Header for chart
  ]);

  let counter = 0;

  useEffect(() => {
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/ethusdt@kline_1m"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("event loop");

      // Extracting kline (candlestick) data from the WebSocket message
      if (data.k) {
        const { o, h, l, c } = data.k; // time, open, high, low, close

        if (counter > 5) {
          ws.close();
        }
        console.log(data);
        console.log(candlestickData)
        // Format the new candlestick data
        const newCandle = [
          "Mon", // Use timestamp directly as numeric value
          parseFloat(l), // Low
          parseFloat(o), // Open
          parseFloat(c), // Close
          parseFloat(h), // High
        ];

        // Update the state with new candlestick data
        setCandlestickData(() => {
          // console.log("candlestick was called")
          setCandlestickData("changes?")
          console.log("called")
          // return [...prevData, newCandle]
        });
        // console.log(candlestickData)
        counter++;
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time ETH/USDT Candlestick Chart</h1>

      {/* <Chart
        chartType="CandlestickChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      /> */}

      {/* <ul>
        {candlestickData.map((i) => {
          return <li key={new Date().getMilliseconds}>{i.o}</li>;
        })}
      </ul> */}
    </div>
  );
}

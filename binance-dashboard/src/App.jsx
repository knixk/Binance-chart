import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

  {
const data = [
  ["Day", "", "", "", ""],
  ["Mon", 20, 28, 38, 45],
  ["Tue", 31, 38, 55, 66],
  ["Wed", 50, 55, 77, 80],
  ["Thu", 77, 77, 66, 50],
  ["Fri", 68, 66, 22, 15],
  // t, l, o, c, h,
];

const options = {
  legend: "none",
  bar: { groupWidth: "40px" }, // Remove space between bars.
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
    risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
  },
};

export default function App() {
  // Initial state for candlestick chart data
  const [candlestickData, setCandlestickData] = useState([
    ["Day", "", "", "", ""], // Header for chart
  ]);

  let count = 0;

  console.log(candlestickData);
  useEffect(() => {
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/ethusdt@kline_1m"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (count > 5) {
        ws.close();
      }
      // Extracting kline (candlestick) data from the WebSocket message
      if (data.k) {
        const { t, o, h, l, c } = data.k; // time, open, high, low, close

        count++;
        // Format the new candlestick data
        const newCandle = [
          "Mon", // Use timestamp directly as numeric value
          parseFloat(l), // Low
          parseFloat(o), // Open
          parseFloat(c), // Close
          parseFloat(h), // High
        ];

        // Log the new candle for debugging
        console.log("New Candle:", newCandle);

        // Update the state with new candlestick data
        setCandlestickData((prevData) => {
          // Check if new candle already exists
          return [...prevData, newCandle]; // Add new candle if it doesn't exist
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
      console.log("WebSocket closed");
    };
  }, []);

  return (
    <div>
      <h1>Real-Time ETH/USDT Candlestick Chart</h1>
      {/* <Chart
        width={"600px"}
        height={"400px"}
        chartType="CandlestickChart"
        loader={<div>Loading Chart...</div>}
        data={candlestickData}
        options={{
          legend: "none",
          bar: { groupWidth: "100%" }, // Make the candles thinner
          candlestick: {
            fallingColor: { strokeWidth: 0, fill: "#a52714" }, // Red for decreasing values
            risingColor: { strokeWidth: 0, fill: "#0f9d58" },  // Green for increasing values
          },
          chartArea: { width: "80%", height: "80%" },
        }}
      /> */}
      <Chart
        chartType="CandlestickChart"
        width="80%"
        height="400px"
        data={candlestickData}
        options={options}
      />
    </div>
  );
}

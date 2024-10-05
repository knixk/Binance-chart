import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const data = [
  ["Day", "", "", "", ""],
  ["Mon", 20, 28, 38, 45],
  ["Tue", 31, 38, 55, 66],
  ["Wed", 50, 55, 77, 80],
  ["Thu", 77, 77, 66, 50],
  ["Fri", 68, 66, 22, 15],
  // t, l, o, c, h,
];

function getCurrentTimeString() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // If hours is 0, set it to 12 (midnight or noon)

  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

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
    ["Day", "low", "open", "close", "high"], // Header for chart
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
        const { o, h, l, c } = data.k; // time, open, high, low, close
        count++;
        // Format the new candlestick data
        const newCandle = [
          getCurrentTimeString(), // Use timestamp directly as numeric value
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
      {/* {candlestickData.length > 1 && ( */}
      <Chart
        chartType="CandlestickChart"
        width="90%"
        height="400px"
        data={candlestickData}
        options={options}
      />
      {/* )} */}
    </div>
  );
}

/* 
  {
        candlestickData.length < 1 ? (
          <div>Fetching the data...</div>
        ) : (
          <Chart
        chartType="CandlestickChart"
        width="100%"
        height="400px"
        data={candlestickData}
        options={options}
      />
        )
      }
*/

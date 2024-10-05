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


//-- works

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

function getCurrentTimeString() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

const options = {
  legend: "none",
  bar: { groupWidth: "40px" }, // Adjust space between bars
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
    risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
  },
};

export default function App() {
  // Consolidate all candlestick data into a single state object
  const [candlestickData, setCandlestickData] = useState({
    "1m": [["Time", "low", "open", "close", "high"]],
    "3m": [["Time", "low", "open", "close", "high"]],
    "5m": [["Time", "low", "open", "close", "high"]],
  });

  const [selectedInterval, setSelectedInterval] = useState("1m"); // Default interval to 1 minute

  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value);
  };

  useEffect(() => {
    // Load initial data from local storage
    const storedData = localStorage.getItem("candlestickData");
    if (storedData) {
      setCandlestickData(JSON.parse(storedData));
    }

    let count = 0;

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/ethusdt@kline_${selectedInterval}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected for interval:", selectedInterval);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (count > 5) {
        ws.close();
      }

      if (data.k) {
        const { o, h, l, c } = data.k; // Extract open, high, low, close
        count++;

        const newCandle = [
          getCurrentTimeString(), // Time
          parseFloat(l), // Low
          parseFloat(o), // Open
          parseFloat(c), // Close
          parseFloat(h), // High
        ];

        // Update the state for the selected interval only
        setCandlestickData((prevData) => {
          const updatedData = {
            ...prevData,
            [selectedInterval]: [...prevData[selectedInterval], newCandle],
          };

          // Save updated data to local storage
          localStorage.setItem("candlestickData", JSON.stringify(updatedData));

          return updatedData;
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
      console.log("WebSocket closed");
    };
  }, [selectedInterval]);

  return (
    <div className="app__container">
      <h1 className="title">Real-Time ETH/USDT Candlestick Chart</h1>
      <small>(by kanishk shrivastava: shrivastavakanishk3@gmail.com)</small>
      <hr className="divider" />
      {/* Dropdown to select interval */}
      <select
        className="interval__dropdown"
        value={selectedInterval}
        onChange={handleIntervalChange}
      >
        <option className="interval__option" value="1m">
          1 Minute
        </option>
        <option className="interval__option" value="3m">
          3 Minutes
        </option>
        <option className="interval__option" value="5m">
          5 Minutes
        </option>
      </select>

      {candlestickData[selectedInterval].length > 1 ? (
        <div className="chart__container">
          <Chart
            className="chart"
            chartType="CandlestickChart"
            width="100%"
            height="300px"
            data={candlestickData[selectedInterval]}
            options={options}
          />
          <div className="utils__container">
            <small>Showing only 100 candlesticks at a time</small>
            <button
              onClick={() => {
                localStorage.removeItem("candlestickData");
                window.location.reload();
              }}
              className="btn"
            >
              Clear cache
            </button>
          </div>
        </div>
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
}

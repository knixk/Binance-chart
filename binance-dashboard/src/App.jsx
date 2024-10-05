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
  // State for each interval and each cryptocurrency
  const [candlestickData, setCandlestickData] = useState({
    ETHUSDT: {
      "1m": [["Time", "low", "open", "close", "high"]],
      "3m": [["Time", "low", "open", "close", "high"]],
      "5m": [["Time", "low", "open", "close", "high"]],
    },
    BNBUSDT: {
      "1m": [["Time", "low", "open", "close", "high"]],
      "3m": [["Time", "low", "open", "close", "high"]],
      "5m": [["Time", "low", "open", "close", "high"]],
    },
    DOTUSDT: {
      "1m": [["Time", "low", "open", "close", "high"]],
      "3m": [["Time", "low", "open", "close", "high"]],
      "5m": [["Time", "low", "open", "close", "high"]],
    },
  });

  const [selectedInterval, setSelectedInterval] = useState("1m"); // Default interval to 1 minute
  const [selectedSymbol, setSelectedSymbol] = useState("ETHUSDT"); // Default cryptocurrency

  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value);
  };

  const handleSymbolChange = (e) => {
    setSelectedSymbol(e.target.value);
  };

  useEffect(() => {
    // Load initial data from local storage
    const storedData = localStorage.getItem("candlestickData");
    if (storedData) {
      setCandlestickData(JSON.parse(storedData));
    }

    let count = 0;

    // Create a new WebSocket connection based on selected symbol and interval
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@kline_${selectedInterval}`
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
        const { t, o, h, l, c } = data.k; // Extract open, high, low, close
        count++;

        const newCandle = [
          t, // Time
          parseFloat(l), // Low
          parseFloat(o), // Open
          parseFloat(c), // Close
          parseFloat(h), // High
        ];

        // Update the state for the selected symbol and interval
        setCandlestickData((prevData) => {
          const updatedData = {
            ...prevData,
            [selectedSymbol]: {
              ...prevData[selectedSymbol],
              [selectedInterval]: [
                ...prevData[selectedSymbol][selectedInterval],
                newCandle,
              ],
            },
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
  }, [selectedInterval, selectedSymbol]); // Add selectedSymbol to the dependencies

  return (
    <div className="app__container">
      <h1 className="title">Real-Time {selectedSymbol} Candlestick Chart</h1>
      <small>(by kanishk shrivastava: shrivastavakanishk3@gmail.com)</small>
      <hr className="divider" />

      {/* Dropdown to select cryptocurrency symbol */}
      <select
        className="symbol__dropdown"
        value={selectedSymbol}
        onChange={handleSymbolChange}
      >
        <option className="symbol__option" value="ETHUSDT">
          ETH/USDT
        </option>
        <option className="symbol__option" value="BNBUSDT">
          BNB/USDT
        </option>
        <option className="symbol__option" value="DOTUSDT">
          DOT/USDT
        </option>
      </select>

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

      {candlestickData &&
        candlestickData[selectedSymbol] &&
        candlestickData[selectedSymbol][selectedInterval] && (
          <div className="chart__container">
            <Chart
              className="chart"
              chartType="CandlestickChart"
              width="100%"
              height="300px"
              data={candlestickData[selectedSymbol][selectedInterval]}
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
        )}

      {/* (
        <div className="loader"></div>
      ) */}
    </div>
  );
}

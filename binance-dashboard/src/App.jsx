import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Import necessary chart.js components

const App = () => {
  const [symbol, setSymbol] = useState("ethusdt");
  const [candlestickData, setCandlestickData] = useState([]);

  // Function to handle symbol change from dropdown
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  // Effect to manage WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.k) {
        const { t, o, h, l, c } = data.k; // Extract candlestick data
        setCandlestickData((prev) => [
          ...prev,
          {
            time: new Date(t).toLocaleTimeString(),
            open: o,
            high: h,
            low: l,
            close: c,
          },
        ]);
      }
    };

    // Cleanup function to close WebSocket on component unmount or symbol change
    return () => {
      // ws.close();
    };
  }, [symbol]); // Re-run the effect when the symbol changes

  // Prepare data for the chart
  const chartData = {
    labels: candlestickData.map((data) => data.time),
    datasets: [
      {
        label: `${symbol.toUpperCase()} Candlestick Data`,
        data: candlestickData.map((data) => data.close),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        borderWidth: 1,
      },
    ],
  };

  console.log(chartData);

  return (
    <div>
      <h1>Binance Market Data</h1>

      {/* Dropdown to select cryptocurrency */}
      <select onChange={handleSymbolChange} value={symbol}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

      {/* Line chart to display candlestick data */}
      <Line data={chartData}/>
    </div>
  );
};

export default App;

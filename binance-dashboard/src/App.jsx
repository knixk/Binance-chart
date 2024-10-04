import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import 'chartjs-chart-financial'; // Import the financial chart plugin

const App = () => {
  const [symbol, setSymbol] = useState('ethusdt');
  const [candlestickData, setCandlestickData] = useState([]);

  // Function to handle symbol change from dropdown
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
    setCandlestickData([]); // Reset data when switching symbols
  };

  // Effect to manage WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_1m`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.k) {
        const { t, o, h, l, c } = data.k; // Extract candlestick data
        setCandlestickData((prev) => [
          ...prev,
          { x: new Date(t), o: parseFloat(o), h: parseFloat(h), l: parseFloat(l), c: parseFloat(c) },
        ]);
      }

      console.log(data)
    };

    // Cleanup function to close WebSocket on component unmount or symbol change
    return () => {
      // ws.close();
    };
  }, [symbol]);

  // Prepare data for the candlestick chart
  const chartData = {
    datasets: [
      {
        label: `${symbol.toUpperCase()} Candlestick Data`,
        data: candlestickData,
        type: 'candlestick',
        color: {
          up: 'rgba(0, 255, 0, 0.5)',
          down: 'rgba(255, 0, 0, 0.5)',
          unchanged: 'rgba(0, 0, 255, 0.5)',
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
        ticks: {
          source: 'auto',
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div>
      <h1>Binance Market Data</h1>

      {/* Dropdown to select cryptocurrency */}
      <select onChange={handleSymbolChange} value={symbol}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

      {/* Candlestick chart */}
      {/* {<Chart type="candlestick" data={chartData} options={chartOptions} />} */}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';
import 'chartjs-chart-financial';

// Register financial chart for candlestick
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);
Chart.register(CandlestickElement, CandlestickController)

const App = () => {
  const [symbol, setSymbol] = useState('ethusdt');
  const [interval, setInterval] = useState('1m');
  const [candlestickData, setCandlestickData] = useState({});

  // Fetch historical data from Binance WebSocket
  useEffect(() => {
    const storedData = localStorage.getItem(symbol);
    if (storedData) {
      setCandlestickData(JSON.parse(storedData));
    }

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.k) {
        const { t, o, h, l, c } = data.k;
        const newCandle = {
          x: new Date(t),
          o: parseFloat(o),
          h: parseFloat(h),
          l: parseFloat(l),
          c: parseFloat(c),
        };

        setCandlestickData((prevData) => {
          const updatedData = prevData[symbol] ? [...prevData[symbol], newCandle] : [newCandle];
          localStorage.setItem(symbol, JSON.stringify(updatedData));
          return { ...prevData, [symbol]: updatedData };
        });
      }
    };

    return () => ws.close();
  }, [symbol, interval]);

  // Handle symbol change
  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  // Handle interval change
  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  // Chart data and options
  const chartData = {
    datasets: [
      {
        label: `${symbol.toUpperCase()} Candlestick Data`,
        data: candlestickData[symbol] || [],
        type: 'candlestick',
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div>
      <h1>Binance Market Data - Candlestick Chart</h1>

      {/* Dropdown to select cryptocurrency */}
      <select value={symbol} onChange={handleSymbolChange}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

      {/* Dropdown to select interval */}
      <select value={interval} onChange={handleIntervalChange}>
        <option value="1m">1 Minute</option>
        <option value="3m">3 Minutes</option>
        <option value="5m">5 Minutes</option>
      </select>

      {/* Candlestick Chart */}
      {candlestickData[symbol] && candlestickData[symbol].length > 0 && (
        <ReactChart type="candlestick" data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default App;

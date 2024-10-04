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
      ws.close();
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


// 2 -----dk------------------------------

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Import necessary chart.js components

const App = () => {
  const [symbol, setSymbol] = useState("ethusdt");
  const [candlestickData, setCandlestickData] = useState([]);
  // const [counter, setCounter] = useState(0);


  // Function to handle symbol change from dropdown
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  // console.log(counter);

  // Effect to manage WebSocket connection
  useEffect(() => {
    // if (counter > 5) {
    //   ws.close();
    // }
    const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol}@kline_1m`
  );
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
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
      // setCounter((prev) => prev + 1);

      ws.close();
    };

    // Cleanup function to close WebSocket on component unmount or symbol change
    return () => {
      ws.close();
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
      <Line className="line-chart" data={chartData} />
    </div>
  );
};

export default App;


// 3 doesnt work

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
        /* 
        t is time
        o is open
        h is highest
        l is lowest
        c is closing
        */
        const { t, o, h, l, c } = data.k; // Extract candlestick data
        setCandlestickData((prev) => [
          ...prev,
          { x: new Date(t), o: parseFloat(o), h: parseFloat(h), l: parseFloat(l), c: parseFloat(c) },
        ]);
      }

      console.log(candlestickData)
      ws.close();
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
      <Chart type="candlestick" data={chartData} options={chartOptions} />
    </div>
  );
};

export default App;

// 4 - doesn't work
import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-chart-financial'; // Candlestick chart plugin
import { Chart as ReactChart } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

Chart.register(...registerables); // Register scales, etc.

const App = () => {
  const [symbol, setSymbol] = useState('ethusdt');
  const [interval, setInterval] = useState('1m');
  const [candlestickData, setCandlestickData] = useState({}); // Store data for all coins

  // Function to handle symbol change from dropdown
  const handleSymbolChange = (event) => {
    const newSymbol = event.target.value;
    setSymbol(newSymbol);
  };

  // Function to handle interval change
  const handleIntervalChange = (event) => {
    const newInterval = event.target.value;
    setInterval(newInterval);
  };

  // Effect to manage WebSocket connection
  useEffect(() => {
    // Restore cached data if available
    if (localStorage.getItem(symbol)) {
      setCandlestickData(JSON.parse(localStorage.getItem(symbol)));
    }

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.k) { // Ensure the candlestick is closed
        const { t, o, h, l, c } = data.k; // Extract candlestick data
        setCandlestickData((prev) => {
          const newData = prev[symbol] || [];
          const updatedData = [
            ...newData,
            { x: new Date(t), o: parseFloat(o), h: parseFloat(h), l: parseFloat(l), c: parseFloat(c) },
          ];
          localStorage.setItem(symbol, JSON.stringify(updatedData)); // Cache data
          return { ...prev, [symbol]: updatedData };
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol, interval]);

  // Prepare data for the candlestick chart
  const chartData = {
    datasets: [
      {
        label: `${symbol.toUpperCase()} Candlestick Data`,
        data: candlestickData[symbol] || [],
        type: 'candlestick',
        borderColor: '#000000',
        backgroundColor: 'rgba(0,0,0,0.1)',
        color: {
          up: '#00ff00',
          down: '#ff0000',
          unchanged: '#0000ff',
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
      <select onChange={handleSymbolChange} value={symbol}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

      {/* Dropdown to select interval */}
      <select onChange={handleIntervalChange} value={interval}>
        <option value="1m">1 Minute</option>
        <option value="3m">3 Minutes</option>
        <option value="5m">5 Minutes</option>
      </select>

      {/* Candlestick chart */}
      {candlestickData[symbol] && candlestickData[symbol].length > 0 && (
        <ReactChart type="candlestick" data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default App;


// 5 - works

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
      if (data.k && data.k.x) {
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


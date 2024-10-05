import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import "chartjs-chart-financial";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);
Chart.register(CandlestickElement, CandlestickController);

const App = () => {
  const [symbol, setSymbol] = useState("ethusdt");
  const [interval, setInterval] = useState("1m");
  const [candlestickData, setCandlestickData] = useState({});
  const [currentData, setCurrentData] = useState([]);

  // Handle symbol change
  const handleSymbolChange = (event) => {
    const newSymbol = event.target.value;
    setSymbol(newSymbol);

    // Check if there's cached data for the new symbol
    if (candlestickData[newSymbol]) {
      setCurrentData(candlestickData[newSymbol]);
    } else {
      setCurrentData([]);
    }
  };

  // Handle interval change
  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  // WebSocket for Binance data
  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data)
      // Add only closed candles to avoid overlap
      if (data.k && data.k.x) {
        const { t, o, h, l, c } = data.k;
        const newCandle = {
          x: new Date(t),
          o: parseFloat(o),
          h: parseFloat(h),
          l: parseFloat(l),
          c: parseFloat(c),
        };

        setCurrentData((prevData) => {
          const updatedData = [...prevData, newCandle];

          // Cache data in-memory
          setCandlestickData((prevCache) => ({
            ...prevCache,
            [symbol]: updatedData,
          }));

          return updatedData;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [symbol, interval]);

  // On page load, restore cached data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(symbol);
    if (savedData) {
      setCurrentData(JSON.parse(savedData));
    }
  }, [symbol]);

  // Chart.js candlestick data setup
  const chartData = {
    datasets: [
      {
        label: `${symbol.toUpperCase()} Candlestick Data`,
        data: currentData,
        type: "candlestick",
        borderColor: "#000000",
        color: {
          up: "#00ff00",
          down: "#ff0000",
          unchanged: "#0000ff",
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
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
//         <option value="3m">3 Minutes</option>
//         <option value="5m">5 Minutes</option>
//       </select>

//       {/* Render candlestick chart */}
//       {currentData.length > 0 && (
//         <ReactChart
//           type="candlestick"
//           data={chartData}
//           options={chartOptions}
//         />
//       )}
//     </div>
//   );
// };

// export default App;

// //  6 --
// import { useEffect, useState } from 'react';
// import { Chart, registerables } from 'chart.js';
// import { Chart as ReactChart } from 'react-chartjs-2';
// import 'chartjs-chart-financial';
// import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// import 'chartjs-adapter-date-fns';

// Chart.register(...registerables);
// Chart.register(CandlestickElement, CandlestickController);

// const App = () => {
//   const [candlestickData, setCandlestickData] = useState([]);

//   useEffect(() => {
//     const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1m');

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log(data)

      

//       if (data.k) {
//         const { t, o, h, l, c } = data.k; // time, open, high, low, close
//         const newCandle = {
//           x: new Date(t),
//           o: parseFloat(o),
//           h: parseFloat(h),
//           l: parseFloat(l),
//           c: parseFloat(c),
//         };

//         setCandlestickData((prevData) => [...prevData, newCandle]);
//         console.log("data was set")
//       }
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   const chartData = {
//     datasets: [
//       {
//         label: 'ETH/USDT Candlestick Data',
//         data: candlestickData,
//         type: 'candlestick',
//         borderColor: '#000',
//         color: {
//           up: '#00ff00',
//           down: '#ff0000',
//           unchanged: '#999999',
//         },
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         type: 'time',
//         time: {
//           unit: 'minute',
//         },
//       },
//       y: {
//         beginAtZero: false,
//       },
//     },
//   };

//   return (
//     <div>
//       <h1>Simple Candlestick Chart</h1>
//       {candlestickData.length > 0 && (
//         <ReactChart type="candlestick" data={chartData} options={chartOptions} />
//       )}
//     </div>
//   );
// };

// export default App;
// 7 --- wide charts

import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";
import "chartjs-chart-financial";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);
Chart.register(CandlestickElement, CandlestickController);


function convertDataToArrOfArr(data) {
  const newData = data.map((i) => {
    const { x, o, h, l, c } = i;
    const nf = [
        x, l, o, c, h
    ]
    return nf;
  })

  console.log(newData)
}

export const data2 = [
  ["Day", "", "", "", ""],
  ["Mon", 20, 28, 38, 45],
  ["Tue", 31, 38, 55, 66],
  ["Wed", 50, 55, 77, 80],
  ["Thu", 77, 77, 66, 50],
  ["Fri", 68, 66, 22, 15],
  // t, l, o, c, h,
];

const data = [
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.89,
    c: 2416.89,
  },
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.89,
    c: 2416.89,
  },
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.8,
    c: 2416.81,
  },
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.8,
    c: 2416.81,
  },
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.8,
    c: 2416.8,
  },
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.8,
    c: 2416.8,
  },
  {
    x: "2024-10-05T05:51:00.000Z",
    o: 2417.29,
    h: 2417.37,
    l: 2416.8,
    c: 2416.8,
  },
];



const App = () => {
  const [candlestickData, setCandlestickData] = useState([]);

  useEffect(() => {
    let count = 0;
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/ethusdt@kline_1m"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.k) {
        const { o, h, l, c } = data.k; // time, open, high, low, close
        const newCandle = {
          x: new Date(),
          o: parseFloat(o),
          h: parseFloat(h),
          l: parseFloat(l),
          c: parseFloat(c),
        };

        setCandlestickData((prevData) => [...prevData, newCandle]);
        console.log("data was set");
        console.log(candlestickData);

        if (count > 5) {
          ws.close();
          console.log("closed");
        }
        count++;
        console.log(count);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const chartData = {
    datasets: [
      {
        label: "ETH/USDT Candlestick Data",
        data: candlestickData,
        type: "candlestick",
        borderColor: "#000",
        color: {
          up: "#00ff00",
          down: "#ff0000",
          unchanged: "#999999",
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    // scales: {
    //   x: {
    //     type: "timeseries",
    //     time: {
    //       unit: "minute",
    //     },
    //   },
    //   y: {
    //     beginAtZero: false,
    //   },
    // },
    scales: {
      x: {
        type: "timeseries",
        offset: true,
        ticks: {
          major: {
            enabled: true,
          },
          source: "data",
          maxRotation: 0,
          autoSkip: true,
          // autoSkipPadding: 75,
          sampleSize: 100,
        },
      },
      y: {
        type: "linear",
      },
    },
  };

  return (
    <div>
      <h1>Simple Candlestick Chart</h1>
      {candlestickData.length > 0 && (
        <ReactChart
          type="candlestick"
          data={chartData}
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default App;

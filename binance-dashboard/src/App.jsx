import React from "react";
import { Chart } from "react-google-charts";

const data2 = [
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

export const data = [
  ["Day", "", "", "", ""],
  ["Mon", 20, 28, 38, 45],
  ["Tue", 31, 38, 55, 66],
  ["Wed", 50, 55, 77, 80],
  ["Thu", 77, 77, 66, 50],
  ["Fri", 68, 66, 22, 15],
  // t, l, o, c, h,
];

const data3 = [
  [
    ["Date", "", "", "", ""],
    ["Mon", 2416.89, 2417.29, 2416.89, 2417.37],
    ["Tue", 2416.8, 2417.29, 2416.81, 2417.37],
  ],
];

export const options = {
  legend: "none",
  bar: { groupWidth: "100%" }, // Remove space between bars.
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
    risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
  },
};

function convertDataToArrOfArr(data) {
  // let counter = 1;
  // let day = new Date.d
  const newData = data.map((i) => {
    // don't get the date from old data
    const { x, o, h, l, c } = i;
    // let x = counter.toString();
    const nf = [x, l, o, c, h];
    // counter++;
    return nf;
  });

  return newData;
}

export default function App() {
  let newData = convertDataToArrOfArr(data2);
  console.log(newData);
  return (
    <Chart
      chartType="CandlestickChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}

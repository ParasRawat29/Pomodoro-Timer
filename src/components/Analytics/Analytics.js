import React from "react";
import { Line, Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "./analytics.css";

export default function Analytics() {
  const data = {
    datasets: [
      {
        label: "# of Votes",
        data: [
          // { x: "2021-01-25T13:00:00", y: 23 },
          // { x: "2021-01-25T13:10:00", y: 13 },
          // { x: "2021-01-25T14:00:00", y: 24 },
          // { x: "2021-01-25T14:00:00", y: 23 },
          // { x: "2021-01-25T15:10:00", y: 13 },
          // { x: "2021-01-25T16:00:00", y: 24 },
          // { x: "2021-01-25T17:00:00", y: 23 },
          // { x: "2021-01-25T18:10:00", y: 13 },
          // { x: "2021-01-25T19:00:00", y: 24 },

          { x: "2021-02-15T14:10:00", y: 20 },
          { x: "2021-02-27T15:00:00", y: 2 },
          { x: "2021-03-18T16:00:00", y: 22 },
          { x: "2021-03-20T17:00:00", y: 18 },
          { x: "2021-03-21T18:00:00", y: 45 },
          { x: "2021-04-28T19:20:00", y: 22 },
          { x: "2021-07-28T19:20:00", y: 20 },
          { x: "2021-09-28T19:20:00", y: 28 },
          { x: "2021-12-28T19:20:00", y: 12 },
          { x: "2022-01-28T19:20:00", y: 2 },
          { x: "2022-03-28T19:20:00", y: 22 },
        ],
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
        grid: {
          color: "rgba(171,171,171,0.21)",
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div className="AnalyticsContainer">
      <div className="chartContainer">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "./analytics.css";
import { DataTimeContext } from "../context/dataTime.context";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function Analytics() {
  const { data, isLoading } = useContext(DataTimeContext);
  const [dataInFormOfArray, setDataInFormOfArray] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // console.log(range.min, range.max);
  useEffect(() => {
    setDataInFormOfArray(() => {
      return data
        ? Object.keys(data).map((item) => {
            return {
              x: data[item].x,
              y: data[item].y / 60,
            };
          })
        : [];
    });
  }, [data]);

  const dataInChart = {
    datasets: [
      {
        label: "minutes",
        data: dataInFormOfArray,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        grid: {
          color: "rgba(171,171,171,0.21)",
          display: true,
        },
        ticks: {
          callback: function (value, index, values) {
            return value;
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: "false",
        },

        beginAtZero: true,
      },
    },
  };
  return (
    <div className="AnalyticsWrapper">
      <div className="chartContainer">
        <Bar data={dataInChart} options={options} />
      </div>

      <div className="navLinkWrapper">
        <ul
          className="navLinks"
          style={{
            height: `${navOpen ? "100px" : "0px"}`,
            visibility: `${navOpen ? "visible" : "hidden"}`,
          }}
        >
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Timer
          </Link>
          <Link
            to="/analytics"
            className={location.pathname.includes("/analytics") ? "active" : ""}
          >
            Analytics
          </Link>
        </ul>
        <button className="toggleBtn" onClick={() => setNavOpen((pre) => !pre)}>
          {navOpen ? <i class="bi bi-x-lg"></i> : <i class="bi bi-list"></i>}
        </button>
      </div>
    </div>
  );
}

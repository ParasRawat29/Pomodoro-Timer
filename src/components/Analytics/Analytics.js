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
  const [minT, setMinT] = useState(0);
  const [maxT, setMaxT] = useState(0);
  const location = useLocation();

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

  useEffect(() => {
    if (dataInFormOfArray) {
      setMaxT(() => dataInFormOfArray.length - 1);
      setMinT(() => dataInFormOfArray.length - 6);
    }
  }, [dataInFormOfArray]);

  const dataInChart = {
    datasets: [
      {
        label: "minutes",
        data: dataInFormOfArray,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            const d = new Date(context[0].raw.x);
            const formattedDate = d.toLocaleString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return formattedDate;
          },
        },
      },
    },
    scales: {
      x: {
        min: minT ? new Date(dataInFormOfArray[minT].x + "T00:00:00") : null,
        max: maxT ? new Date(dataInFormOfArray[maxT].x + "T00:00:00") : null,
        type: "time",
        time: {
          unit: "day",
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
        ticks: {
          display: "false",
        },

        beginAtZero: true,
      },
    },
  };

  const nextData = (start, end) => {
    let mint = minT + start;
    let maxt = maxT + end;
    if (mint <= 0) {
      mint = 0;
      maxt = mint + 5;
    }

    if (maxt >= dataInFormOfArray.length - 1) {
      maxt = dataInFormOfArray.length - 1;
      mint = maxt - 5;
    }
    console.log(mint, maxt);
    setMaxT(maxt);
    setMinT(mint);
  };

  const NextBtnStyles = {
    color: maxT === dataInFormOfArray.length - 1 ? "grey" : "#4dc07d",
    cursor: maxT === dataInFormOfArray.length - 1 ? "auto" : "pointer",
  };
  const PreBtnStyles = {
    color: minT === 0 ? "grey" : "#4dc07d",
    cursor: minT === 0 ? "auto" : "pointer",
  };
  return (
    <div className="AnalyticsWrapper">
      <div className="chartContainer">
        <Bar data={dataInChart} options={options} />
        <div className="chartNavigationButton">
          <button onClick={() => nextData(-6, -6)} style={PreBtnStyles}>
            <i class="bi bi-arrow-left-circle"></i>previous
          </button>
          <button onClick={() => nextData(6, 6)} style={NextBtnStyles}>
            next
            <i class="bi bi-arrow-right-circle"></i>
          </button>
        </div>
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
          {navOpen ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </button>
      </div>
    </div>
  );
}

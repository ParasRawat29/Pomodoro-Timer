import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "./analytics.css";
import { DataTimeContext } from "../../context/dataTime.context";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function Analytics() {
  const { data, isLoading } = useContext(DataTimeContext);
  const [studyDataInFormOfArray, setstudyDataInFormOfArray] = useState(null);
  const [BreakDataInFormOfArray, setBreakDataInFormOfArray] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [minT, setMinT] = useState(0);
  const [maxT, setMaxT] = useState(0);

  const location = useLocation();

  useEffect(() => {
    setstudyDataInFormOfArray(() => {
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
    setBreakDataInFormOfArray(() => {
      return data
        ? Object.keys(data).map((item) => {
            return {
              x: data[item].x,
              y: data[item].z / 60,
            };
          })
        : [];
    });
  }, [data]);

  useEffect(() => {
    if (studyDataInFormOfArray) {
      setMaxT(() => studyDataInFormOfArray.length - 1);
      setMinT(() =>
        studyDataInFormOfArray.length - 6 < 0
          ? 0
          : studyDataInFormOfArray.length - 6
      );
    }
  }, [studyDataInFormOfArray]);

  const dataInChart = {
    datasets: [
      {
        label: "Study Time (minutes)",

        data: studyDataInFormOfArray,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Break Time (minutes)",
        data: BreakDataInFormOfArray,
        backgroundColor: "#2c9da3",
        borderColor: "rgba(25, 99, 122, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#d4dad6",
          font: {
            size: 14,
          },
        },
      },
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
        type: "time",
        time: {
          unit: "day",
        },

        grid: {
          color: "rgba(171,171,171,0.21)",
          display: true,
        },
        min:
          minT && studyDataInFormOfArray.length >= 1
            ? new Date(studyDataInFormOfArray[minT].x + "T00:00:00")
            : null,
        max:
          maxT && studyDataInFormOfArray.length >= 1
            ? new Date(studyDataInFormOfArray[maxT].x + "T00:00:00")
            : null,
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: "false",
        },
        title: {
          display: true,
          text: "Time in Minutes",
          color: "#c3c3c3",
          fontFamily: "Segoe UI",
        },

        beginAtZero: true,
      },
    },
  };

  const nextData = (start, end) => {
    let mint = minT + start;
    let maxt = maxT + end;

    if (mint < 0) {
      mint = 0;
      maxt = mint + 5;
    }
    if (maxt >= studyDataInFormOfArray.length - 1) {
      maxt = studyDataInFormOfArray.length - 1;
      mint = maxt - 5;
      if (mint < 0) {
        mint = 0;
      }
    }

    setMaxT(maxt);
    setMinT(mint);
  };

  const NextBtnStyles = {
    color: studyDataInFormOfArray
      ? maxT === studyDataInFormOfArray.length - 1
        ? "grey"
        : "#4dc07d"
      : null,
    cursor: studyDataInFormOfArray
      ? maxT === studyDataInFormOfArray.length - 1
        ? "auto"
        : "pointer"
      : null,
  };
  const PreBtnStyles = {
    color: minT === 0 ? "grey" : "#4dc07d",
    cursor: minT === 0 ? "auto" : "pointer",
  };

  return (
    <div className="AnalyticsWrapper">
      <div className="chartContainer">
        {isLoading ? (
          <h1 style={{ color: "whitesmoke", textAlign: "center" }}>
            Loading ...
          </h1>
        ) : studyDataInFormOfArray && studyDataInFormOfArray.length > 0 ? (
          <>
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
          </>
        ) : (
          <h1
            style={{
              color: "whitesmoke",
              textAlign: "center",
            }}
          >
            No Data to Show
          </h1>
        )}
      </div>

      <div className="navLinkWrapper">
        <ul
          className="navLinks"
          style={{
            height: `${navOpen ? "80px" : "0px"}`,
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

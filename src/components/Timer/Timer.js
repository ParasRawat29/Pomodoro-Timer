import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SettingsSidebar from "../Sidebar/SettingsSidebar";
import settingIcon from "../../vector/settings.png";
import "./timer.css";
import { database } from "../../config/firebase";
import { set, ref, update, child, get } from "firebase/database";
import { ProfileContext } from "../../context/profile.context";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function Timer({ isTimerStarted, setisTimerStarted }) {
  const { profiles } = useContext(ProfileContext);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const audioElement = useRef(null);
  const [timerVal, setTimerVal] = useState({
    sessionVal: "25",
    breakVal: "2",
  });
  const [timerLength, setTimerLength] = useState({
    sessionlenth: parseInt(timerVal.sessionVal, 10) * 60,
    breaklength: parseInt(timerVal.breakVal, 10) * 60,
  });
  const [sidebarIsOpen, setSidebarIsOpen] = useState(0);
  var [timeLeft, setTimeLeft] = useState(timerLength.sessionlenth);
  var [intervalId, setintervalId] = useState(null);
  var [timeLeftInMin, setTimeLeftInMin] = useState(timeLeft / 60);
  var [timeLeftInSec, setTimeLeftInSec] = useState(timeLeft % 60);
  var [timerType, setTimerType] = useState("session");
  var [startTime, setStartTime] = useState(timerLength.sessionlenth);

  const setTimerTime = useCallback(
    function setTimerTime() {
      setTimeLeftInMin(() => Math.floor(timeLeft / 60));
      setTimeLeftInSec(() => timeLeft % 60);
    },
    [timeLeft]
  );
  const changeTitle = useCallback((text) => {
    document.title = text;
  }, []);

  const startTimer = useCallback(() => {
    if (!isTimerStarted) {
      setisTimerStarted(1);
      const intervalId = setInterval(() => {
        setTimeLeft((pre) => pre - 1);
      }, 1);
      changeTitle("PomoTime");
      setintervalId(() => intervalId);
    }
  }, [changeTitle, isTimerStarted, setisTimerStarted]);

  const resetTimer = () => {
    if (timerType === "session") {
      setisTimerStarted(0);
      // console.log(
      //   timeLeft <= 0.6 * parseInt(timerVal.sessionVal, 10) * 60,
      //   timeLeft,
      //   parseInt(timerVal.sessionVal, 10) * 60
      // );
      clearInterval(intervalId);
      changeTitle("PomoTime");
      if (timeLeft <= 0.6 * parseInt(timerVal.sessionVal, 10) * 60) {
        const day = new Date(Date.now()).toLocaleDateString("en-ca");
        const timespent = timeLeft;
        const data = {
          x: day,
          y: timespent,
        };
        putTodatabase(data, day, timerType).then(() => {});
      } else {
        alert("time less than 60% of what you set . it wont be considered");
      }
      setTimeLeft(() => timerLength.sessionlenth);
    } else {
      setisTimerStarted(0);
      clearInterval(intervalId);
      setTimerType("session");
      setTimeLeft(() => timerLength.sessionlenth);
      setStartTime(() => timerLength.sessionlenth);
      changeTitle("PomoTime");
    }
  };

  function pauseTimer() {
    if (isTimerStarted) {
      setisTimerStarted(false);
      clearInterval(intervalId);
      intervalId = 0;
    }
  }

  const toggleSettingSideBar = useCallback(() => {
    setSidebarIsOpen((pre) => !pre);
  }, []);

  const putTodatabase = useCallback(
    async (data, day, type) => {
      get(child(ref(database), `profiles/${profiles.uid}/data/${day}`))
        .then(async (snap) => {
          if (snap.exists()) {
            //if that day data is already present in database
            if (type === "session") {
              const preBreakTime = snap.val().z ? snap.val().z : 0;
              const preSessionTime = snap.val().y;
              const newSessionTime = preSessionTime + data.y;
              const newdata = {
                x: data.x,
                y: newSessionTime,
                z: preBreakTime,
              };
              await update(
                ref(database, `profiles/${profiles.uid}/data/${day}`),
                newdata
              );
            } else if (type === "break") {
              const preSessionTime = snap.val().y ? snap.val().y : 0;
              const preBreakTime = snap.val().z ? snap.val().z : 0;
              const newBreakTime = preBreakTime + data.z;
              const newdata = {
                x: data.x,
                y: preSessionTime,
                z: newBreakTime,
              };

              await update(
                ref(database, `profiles/${profiles.uid}/data/${day}`),
                newdata
              );
            }
          } else {
            //if the day is not present in the database.

            await set(
              ref(database, `profiles/${profiles.uid}/data/${day}`),
              data
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [profiles.uid]
  );

  useEffect(() => {
    setTimerTime();
  }, [
    timeLeft,
    timerLength.sessionlenth,
    timerLength.breaklength,
    timerVal.sessionVal,
    timerVal.breakVal,
  ]);

  useEffect(() => {
    if (isTimerStarted) {
      changeTitle(
        `${timeLeftInMin < 10 ? "0" + timeLeftInMin : timeLeftInMin}:${
          timeLeftInSec < 10 ? "0" + timeLeftInSec : timeLeftInSec
        }`
      );
    } else {
      changeTitle("PomoTime");
    }
  }, [timeLeftInMin, timeLeftInSec]);

  useEffect(() => {
    setTimerLength((pre) => {
      return {
        ...pre,
        sessionlenth: parseInt(timerVal.sessionVal, 10) * 60,
        breaklength: parseInt(timerVal.breakVal, 10) * 60,
      };
    });
    // setSessionLength(() => parseInt(timerVal.sessionVal, 10) * 60);
    // setBreakLength(() => parseInt(timerVal.breakVal, 10) * 60);
    setTimeLeft(() => {
      return timerType === "session"
        ? timerLength.sessionlenth
        : timerLength.breaklength;
    });
    setTimeLeftInMin(() => timeLeft / 60);
    setTimeLeftInSec(() => timeLeft % 60);
    setStartTime(() => {
      return timerType === "session"
        ? timerLength.sessionlenth
        : timerLength.breaklength;
    });
  }, [
    timerVal.sessionVal,
    timerVal.breakVal,
    timerLength.sessionlenth,
    timerLength.breaklength,
  ]);

  useEffect(() => {
    if (timeLeft === 0) {
      setisTimerStarted(0);
      const playPromise = audioElement.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            //beep sound started
          })
          .catch((error) => {
            console.log(error);
          });
      }
      clearInterval(intervalId);

      if (timerType === "session") {
        const day = new Date(Date.now()).toLocaleDateString("en-ca");
        const timespent = timerLength.sessionlenth;
        const data = {
          x: day,
          y: timespent,
        };

        putTodatabase(data, day, timerType)
          .then(() => {
            setTimerType(() => "break");
            setTimeLeft(() => timerLength.breaklength);
            setStartTime(() => timerLength.breaklength);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (timerType === "break") {
        const day = new Date(Date.now()).toLocaleDateString("en-ca");
        const timespent = timerLength.breaklength;
        const data = {
          x: day,
          z: timespent,
        };
        putTodatabase(data, day, timerType)
          .then(() => {
            setTimerType(() => "session");
            setTimeLeft(() => timerLength.sessionlenth);
            setStartTime(() => timerLength.sessionlenth);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [timeLeft, timerLength.sessionlenth, timerLength.breaklength]);

  return (
    <div className="timerComponentWrapper">
      <SettingsSidebar
        toggleSettingSideBar={toggleSettingSideBar}
        sidebarIsOpen={sidebarIsOpen}
        setTimerVal={setTimerVal}
        sessionVal={timerVal.sessionVal}
        breakVal={timerVal.breakVal}
        isTimerStarted={isTimerStarted}
      />
      <button
        className="settingBtn"
        onClick={() => {
          setSidebarIsOpen((pre) => !pre);
        }}
      >
        <img src={settingIcon} alt="" />
      </button>
      <div className="TimerContainer">
        <h2 className="timertype">{timerType}</h2>
        <div className="circularProgressContainer">
          <CircularProgressbar //see the library here: https://www.npmjs.com/package/react-circular-progressbar
            maxValue={startTime}
            value={startTime - timeLeft}
            styles={{
              root: { width: "100%", minWidth: "300px", maxWidth: "450px" },
            }}
            text={`${
              timeLeftInMin < 10 ? "0" + timeLeftInMin : timeLeftInMin
            } : 
                ${timeLeftInSec < 10 ? "0" + timeLeftInSec : timeLeftInSec}`}
          />
        </div>
        <div className="timebtnContainer">
          <button
            style={
              isTimerStarted
                ? {
                    boxShadow: "0 1px rgba(253, 253, 253, 0.919)",
                    transform: "translateY(4px)",
                  }
                : {}
            }
            type="button"
            className="timebtn"
            onClick={() => {
              startTimer();
            }}
          >
            Start
          </button>
          <button
            type="button"
            className="timebtn"
            onClick={() => pauseTimer()}
          >
            Pause
          </button>
          <button
            type="button"
            className="timebtn"
            onClick={() => resetTimer()}
          >
            {timerType == "session" ? "Reset" : "Skip"}
          </button>
        </div>
      </div>
      <audio id="beep" ref={audioElement}>
        <source
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          type="audio/mpeg"
        />
      </audio>

      <div className="navLinkWrapper">
        <ul
          className="navLinks"
          style={{
            height: `${navOpen ? "80px" : "0px"}`,
            visibility: `${navOpen ? "visible" : "hidden"}`,
          }}
        >
          <Link to={`${isTimerStarted ? "" : "/"}`}>
            <button
              className={location.pathname == "/" ? "active" : ""}
              style={{
                outline: "none",
                backgroundColor: "inherit",
              }}
              disabled={isTimerStarted}
            >
              Timer
            </button>
          </Link>

          <Link
            to={`${isTimerStarted ? "" : "/analytics"}`}
            disabled={isTimerStarted}
          >
            <button
              className={
                location.pathname.includes("/analytics") ? "active" : ""
              }
              style={{
                outline: "none",
                backgroundColor: "inherit",
              }}
              disabled={isTimerStarted}
            >
              Analytics
            </button>
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

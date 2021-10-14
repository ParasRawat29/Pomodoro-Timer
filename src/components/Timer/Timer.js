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
import { ProfileContext } from "../context/profile.context";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function Timer({ isTimerStarted, setisTimerStarted }) {
  const { profiles } = useContext(ProfileContext);
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const audioElement = useRef(null);
  var [sessionVal, setSessionVal] = useState("25");
  var [breakVal, setBreakVal] = useState("2");
  var [sessionlenth, setSessionLength] = useState(
    parseInt(sessionVal, 10) * 60
  );
  var [breaklength, setBreakLength] = useState(parseInt(breakVal, 10) * 60);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(0);
  var [timeLeft, setTimeLeft] = useState(sessionlenth);
  var [intervalId, setintervalId] = useState(null);
  var [timeLeftInMin, setTimeLeftInMin] = useState(timeLeft / 60);
  var [timeLeftInSec, setTimeLeftInSec] = useState(timeLeft % 60);
  var [timerType, setTimerType] = useState("session");
  var [startTime, setStartTime] = useState(sessionlenth);

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

  function startTimer() {
    if (!isTimerStarted) {
      setisTimerStarted(1);
      const intervalId = setInterval(() => {
        setTimeLeft((pre) => pre - 1);
      }, 1000);
      changeTitle("PomoTime");
      setintervalId(() => intervalId);
    }
  }

  function resetTimer() {
    setisTimerStarted(0);
    clearInterval(intervalId);
    setTimeLeft(() => sessionlenth);
    changeTitle("PomoTime");
  }

  function pauseTimer() {
    if (isTimerStarted) {
      setisTimerStarted(false);
      clearInterval(intervalId);
      intervalId = 0;
    }
  }
  function toggleSettingSideBar() {
    setSidebarIsOpen((pre) => !pre);
  }

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
  }, [timeLeft, sessionlenth, breaklength, sessionVal, breakVal]);

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
    setSessionLength(() => parseInt(sessionVal, 10) * 60);
    setBreakLength(() => parseInt(breakVal, 10) * 60);
    setTimeLeft(() => {
      return timerType == "session" ? sessionlenth : breaklength;
    });
    setTimeLeftInMin(() => timeLeft / 60);
    setTimeLeftInSec(() => timeLeft % 60);
    setStartTime(() => {
      return timerType == "session" ? sessionlenth : breaklength;
    });
  }, [sessionVal, breakVal, sessionlenth, breaklength]);

  useEffect(() => {
    if (timeLeft == 0) {
      setisTimerStarted(0);
      const playPromise = audioElement.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            // Automatic playback started!
            // Show playing UI.
          })
          .catch((error) => {
            console.log(error);
          });
      }
      clearInterval(intervalId);

      if (timerType === "session") {
        const day = new Date(Date.now()).toLocaleDateString("en-ca");
        const timespent = sessionlenth;
        const data = {
          x: day,
          y: timespent,
        };

        putTodatabase(data, day, timerType)
          .then(() => {
            setTimerType(() => "break");
            setTimeLeft(() => breaklength);
            setStartTime(() => breaklength);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (timerType === "break") {
        const day = new Date(Date.now()).toLocaleDateString("en-ca");
        const timespent = breaklength;
        const data = {
          x: day,
          z: timespent,
        };
        putTodatabase(data, day, timerType)
          .then(() => {
            setTimerType(() => "session");
            setTimeLeft(() => sessionlenth);
            setStartTime(() => sessionlenth);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [timeLeft, sessionlenth, breaklength]);

  return (
    <div className="timerComponentWrapper">
      <SettingsSidebar
        toggleSettingSideBar={toggleSettingSideBar}
        sidebarIsOpen={sidebarIsOpen}
        setSessionVal={setSessionVal}
        setBreakVal={setBreakVal}
        sessionVal={sessionVal}
        breakVal={breakVal}
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
            Reset
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

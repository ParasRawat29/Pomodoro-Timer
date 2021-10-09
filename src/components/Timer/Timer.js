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

export default function Timer() {
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
  var [isTimerStarted, setisTimerStarted] = useState(false);

  const setTimerTime = useCallback(
    function setTimerTime() {
      setTimeLeftInMin(() => Math.floor(timeLeft / 60));
      setTimeLeftInSec(() => timeLeft % 60);
    },
    [timeLeft]
  );

  function startTimer() {
    if (!isTimerStarted) {
      setisTimerStarted(1);
      const intervalId = setInterval(() => {
        setTimeLeft((pre) => pre - 1);
      }, 1000);
      setintervalId(() => intervalId);
    }
  }

  function resetTimer() {
    setisTimerStarted(0);
    clearInterval(intervalId);
    setTimeLeft(() => sessionlenth);
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
    async (data, day) => {
      get(child(ref(database), `profiles/${profiles.uid}/data/${day}`))
        .then(async (snap) => {
          if (snap.exists()) {
            const preTime = snap.val().y;
            const newTime = preTime + data.y;
            const newdata = {
              x: data.x,
              y: newTime,
            };

            await update(
              ref(database, `profiles/${profiles.uid}/data/${day}`),
              newdata
            );
          } else {
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
    setSessionLength(() => parseInt(sessionVal, 10) * 60);
    setBreakLength(() => parseInt(breakVal, 10) * 60);
    setTimeLeft(() => sessionlenth);
    setTimeLeftInMin(() => timeLeft / 60);
    setTimeLeftInSec(() => timeLeft % 60);
    setStartTime(() => sessionlenth);
  }, [sessionVal, breakVal, sessionlenth]);

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

        putTodatabase(data, day)
          .then(() => {
            console.log("data putted");
            setTimerType(() => "break");
            setTimeLeft(() => breaklength);
            setStartTime(() => breaklength);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (timerType === "break") {
        setTimerType(() => "session");
        setTimeLeft(() => sessionlenth);
        setStartTime(() => sessionlenth);
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

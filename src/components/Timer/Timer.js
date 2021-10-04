import React, { useContext, useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SettingsSidebar from "../Sidebar/SettingsSidebar";
import settingIcon from "../../vector/settings.png";
import "./timer.css";
import { database } from "../../config/firebase";
import { set, ref, push, update, child, get } from "firebase/database";
import { ProfileContext } from "../context/profile.context";

export default function Timer(props) {
  const { profiles, isLoading } = useContext(ProfileContext);

  var [sessionlenth, setSessionLength] = useState(
    parseInt(props.sessionVal, 10) * 60
  );
  var [breaklength, setBreakLength] = useState(
    parseInt(props.breakVal, 10) * 60
  );

  const [sidebarIsOpen, setSidebarIsOpen] = useState(0);
  var [timeLeft, setTimeLeft] = useState(sessionlenth);
  var [intervalId, setintervalId] = useState(null);
  var [timeLeftInMin, setTimeLeftInMin] = useState(timeLeft / 60);
  var [timeLeftInSec, setTimeLeftInSec] = useState(timeLeft % 60);
  var [timerType, setTimerType] = useState("session");
  var [startTime, setStartTime] = useState(sessionlenth);
  var [isTimerStarted, setisTimerStarted] = useState(false);

  function setTimerTime() {
    setTimeLeftInMin(() => Math.floor(timeLeft / 60));
    setTimeLeftInSec(() => timeLeft % 60);
  }

  function startTimer() {
    if (!isTimerStarted) {
      setisTimerStarted(1);
      const intervalId = setInterval(() => {
        setTimeLeft((pre) => pre - 1);
      }, 1);
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
  const putTodatabase = async (data, day) => {
    get(child(ref(database), `profiles/${profiles.uid}/data/${day}`))
      .then(async (snap) => {
        if (snap.exists()) {
          //checking if date is already present
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
          console.log("nodata");
          await update(
            ref(database, `profiles/${profiles.uid}/data/${day}`),
            data
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setTimerTime();
  }, [timeLeft, sessionlenth, breaklength, props.sessionVal, props.breakVal]);

  useEffect(() => {
    setSessionLength(() => parseInt(props.sessionVal, 10) * 60);
    setBreakLength(() => parseInt(props.breakVal, 10) * 60);
    setTimeLeft(() => sessionlenth);
    setTimeLeftInMin(() => timeLeft / 60);
    setTimeLeftInSec(() => timeLeft % 60);
    setStartTime(() => sessionlenth);
  }, [, props.sessionVal, props.breakVal, sessionlenth]);

  useEffect(() => {
    if (timeLeft == 0) {
      setisTimerStarted(0);
      const audioEl = document.getElementsByClassName("audio-element")[0];
      audioEl.play();
      clearInterval(intervalId);
      if (timerType == "session") {
        const day = new Date(Date.now()).toLocaleDateString("en-ca");
        const timespent = sessionlenth;
        const data = {
          x: day,
          y: timespent,
        };
        // console.log(data, day);
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
      } else if (timerType == "break") {
        setTimerType(() => "session");
        setTimeLeft(() => sessionlenth);
        setStartTime(() => sessionlenth);
      }
    }
  }, [timeLeft, sessionlenth, breaklength]);

  return (
    <div className="container-fluid timerComponentWrapper">
      <SettingsSidebar
        toggleSettingSideBar={toggleSettingSideBar}
        sidebarIsOpen={sidebarIsOpen}
        setSessionVal={props.setSessionVal}
        setBreakVal={props.setBreakVal}
        sessionVal={props.sessionVal}
        breakVal={props.breakVal}
        isTimerStarted={isTimerStarted}
      />
      <button
        onClick={() => {
          setSidebarIsOpen((pre) => !pre);
        }}
      >
        <img src={settingIcon} alt="" />
      </button>
      <div className="quote">Little more left keeping going</div>
      <div className="TimerContainer">
        <h2 className="timertype">{timerType}</h2>
        <div className="circularProgressContainer">
          <CircularProgressbar //see the library here: https://www.npmjs.com/package/react-circular-progressbar
            maxValue={startTime}
            value={startTime - timeLeft}
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
            onClick={() => startTimer()}
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
      <audio className="audio-element">
        <source
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/
              build/testable-projects-fcc/audio/BeepSound.wav"
        ></source>
      </audio>
    </div>
  );
}

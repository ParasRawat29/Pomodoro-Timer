import React, { useEffect,useState } from 'react'
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import './timer.css'

export default function Timer(props) {
    console.log(props);

     var [sessionlenth,setSessionLength] = useState(parseInt(props.sessionVal,10) *60);
     var[breaklength,setBreakLength] = useState(parseInt(props.breakVal,10) *60);

    var [timeLeft,setTimeLeft]=useState(sessionlenth);
    var [isStarted, setisStarted] = useState(0);
    var [intervalId , setintervalId] = useState(null);
    var [timeLeftInMin ,setTimeLeftInMin] = useState(timeLeft/60);
    var [timeLeftInSec ,setTimeLeftInSec] = useState(timeLeft%60);
    var [timerType , setTimerType] = useState('session');   
    var [startTime,setStartTime] = useState(sessionlenth);

    function setTimerTime(){
        setTimeLeftInMin(()=>Math.floor(timeLeft/60));
        setTimeLeftInSec(()=>timeLeft%60);
    }

    function startTimer(){
        if(!isStarted){
            setisStarted(1);
            const intervalId= setInterval(() => {
                setTimeLeft((pre)=>pre-1); 
            }, 100);
            setintervalId(()=>intervalId);
        }
    }

    function resetTimer(){
            setisStarted(0);
            clearInterval(intervalId);
            setTimeLeft(()=>sessionlenth);
        
    }

    function pauseTimer(){
        if(isStarted){
            setisStarted(0);
            clearInterval(intervalId);
            intervalId=0;
        }
    }

    useEffect(() => {
        setTimerTime();
    }, [timeLeft,sessionlenth,breaklength,props.sessionVal,props.breakVal]);

    useEffect(() => {
        setSessionLength(()=>parseInt(props.sessionVal,10) *60);
        setBreakLength(()=>parseInt(props.breakVal,10) *60);
        setTimeLeft(()=>sessionlenth);
        setTimeLeftInMin(()=>timeLeft/60);
        setTimeLeftInSec(()=>timeLeft%60);
        setStartTime(()=>sessionlenth);
    }, [,props.sessionVal,props.breakVal,sessionlenth,])

    useEffect(() => {
        if(timeLeft==0)
        {
            setisStarted(0);
            const audioEl = document.getElementsByClassName("audio-element")[0]
            audioEl.play()
            clearInterval(intervalId);
            if(timerType=='session')
            {
             setTimerType(()=>'break');
             setTimeLeft(()=>breaklength);
             setStartTime(()=>breaklength);
            }
            else if(timerType=='break')
            {
             setTimerType(()=>'session');
             setTimeLeft(()=>sessionlenth);
             setStartTime(()=>sessionlenth);
            }
          
        }
    }, [timeLeft,sessionlenth,breaklength])
    return (
        
        <div className="container-fluid timerComponentWrapper">
            <div className="quote">
                Little more left keeping going
            </div>
            <div className="TimerContainer">
                <h2 className="timertype">{timerType}</h2>
                <div className="circularProgressContainer">
                <CircularProgressbar //see the library here: https://www.npmjs.com/package/react-circular-progressbar
                 maxValue={startTime}
                value={startTime - timeLeft}
                text={`${timeLeftInMin <10 ? "0" +timeLeftInMin:timeLeftInMin} : 
                ${timeLeftInSec < 10 ? "0" + timeLeftInSec : timeLeftInSec}`} 
          />
          </div>
                <div className="timebtnContainer">
                    <button type="button" className="timebtn" 
                    onClick={()=>startTimer()}>Start</button>
                    <button type="button" className="timebtn" 
                    onClick={()=>pauseTimer()}>Pause</button>
                    <button type="button" className="timebtn" 
                    onClick={()=>resetTimer()}>Reset</button>
                </div>
            </div>
        <audio className="audio-element">
              <source src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/
              build/testable-projects-fcc/audio/BeepSound.wav">
              </source>
        </audio>
        </div>
    )
}

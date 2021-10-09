import { React } from "react";
import "./sidebar.css";
import close from "../../vector/close.png";
export default function SettingsSidebar(props) {
  var sidebarCss = {
    transform: props.sidebarIsOpen == 1 ? "translateX(0)" : "translateX(100%)",
  };

  return (
    <div className="sidebarContainer" style={sidebarCss}>
      <div className="sidebarHeader">
        <button className="closeBtn" onClick={props.toggleSettingSideBar}>
          <img src={close} alt="closebtn" className="closeBtnIcon" />
        </button>
      </div>
      <div className="inputsContainer">
        <div className="inputDiv">
          <label>Session</label>
          <input
            value={props.sessionVal}
            type="number"
            min="1"
            max="90"
            onChange={(e) => props.setSessionVal(e.target.value)}
            disabled={props.isTimerStarted}
          />
        </div>
        <div className="inputDiv">
          <label>Break</label>
          <input
            value={props.breakVal}
            type="number"
            min="1"
            max="30"
            onChange={(e) => props.setBreakVal(e.target.value)}
            disabled={props.isTimerStarted}
          />
        </div>
      </div>
    </div>
  );
}

import { React, useState } from "react";
import "./sidebar.css";

export default function SettingsSidebar(props) {
  console.log(props);
  var sidebarCss = {
    transform: props.sidebarIsOpen == 1 ? "translateX(0)" : "translateX(100%)",
    // marginLeft :  props.sidebarIsOpen==1 ? "0" : "100px" ,
    // opacity :  props.sidebarIsOpen==1 ? "1" : "0"
  };

  return (
    <div className="sidebarContainer" style={sidebarCss}>
      <div className="sidebarHeader">
        <button
          className="closeBtn"
          onClick={() => props.toggleSettingSideBar()}
        >
          X
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
          />
        </div>
        <br />
        <div className="uploadBtnWapper">
          <label>Music</label>
          <input type="file" name="musicfile" placeholder="ioi" />
        </div>
      </div>
    </div>
  );
}

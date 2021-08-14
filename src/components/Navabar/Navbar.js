import React, { useState } from "react";
import settingIcon from "../../vector/settings.png";
import "./navbar.css";
export default function Navbar(props) {
  return (
    <nav class="navbar">
      <div class="container-fluid justify-content-center">
        <button
          className={props.active == "timer" ? "tabBtn activetab" : "tabBtn"}
          type="button"
          onClick={() => props.handleActiveTab("timer")}
        >
          Timer
        </button>
        <button
          class={props.active == "analytics" ? "tabBtn activetab" : "tabBtn"}
          type="button"
          onClick={() => props.handleActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className="settingBtn"
          onClick={() => props.toggleSettingSideBar()}
          type="button"
        >
          <img src={settingIcon} />
        </button>
      </div>
      <br />
      <br />
      <div className="line"></div>
    </nav>
  );
}

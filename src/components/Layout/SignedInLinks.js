import React from "react";
import { Link } from "react-router-dom";

function SignedInLinks(props) {
  return (
    <div className="signedInLinksWrapper">
      <div className="tabbtnsWrapper">
        <Link to="/" exact>
          <button
            className={props.active == "timer" ? "tabBtn activetab" : "tabBtn"}
            type="button"
            onClick={() => props.handleActiveTab("timer")}
          >
            Timer
          </button>
        </Link>
        <Link to="/analytics" exact>
          <button
            class={props.active == "analytics" ? "tabBtn activetab" : "tabBtn"}
            type="button"
            onClick={() => props.handleActiveTab("analytics")}
          >
            Analytics
          </button>
        </Link>
      </div>
      <button className="signoutBtn">Signout</button>
    </div>
  );
}

export default SignedInLinks;

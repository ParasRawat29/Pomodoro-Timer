import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

function SignedInLinks(props) {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("signed out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <button className="signoutBtn" onClick={handleSignOut}>
        Signout
      </button>
    </div>
  );
}

export default SignedInLinks;

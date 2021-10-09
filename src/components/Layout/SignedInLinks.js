import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useLocation } from "react-router";

function SignedInLinks({ isTimerStarted }) {
  const location = useLocation();

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
        <Link to={`${isTimerStarted ? "" : "/"}`} exact>
          <button
            className={
              location.pathname === "/" ? "tabBtn activetab" : "tabBtn"
            }
            disabled={isTimerStarted}
          >
            Timer
          </button>
        </Link>
        <Link to={`${isTimerStarted ? "" : "/analytics"}`} exact>
          <button
            className={
              location.pathname.includes("/analytics")
                ? "tabBtn activetab"
                : "tabBtn"
            }
            disabled={isTimerStarted}
          >
            Analytics
          </button>
        </Link>
      </div>
      <button className="signoutBtn" onClick={handleSignOut}>
        Logout
      </button>
    </div>
  );
}

export default SignedInLinks;

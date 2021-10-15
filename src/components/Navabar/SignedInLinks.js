import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useLocation } from "react-router";
import noProfilePic from "../../vector/noProfilePic.png";

function SignedInLinks({ isTimerStarted, profiles }) {
  const location = useLocation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
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
      <img
        src={profiles.photoUrl ? profiles.photoUrl : noProfilePic}
        alt=""
        width="40px"
        height="40px"
        className="profilePic"
      />
      <button
        className="signoutBtn"
        onClick={handleSignOut}
        disabled={isTimerStarted}
      >
        Logout
      </button>
    </div>
  );
}

export default SignedInLinks;

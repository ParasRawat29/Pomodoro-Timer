import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useLocation } from "react-router";

function SignedInLinks(props) {
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
        <Link to="/" exact>
          <button
            className={location.pathname == "/" ? "tabBtn activetab" : "tabBtn"}
            type="button"
          >
            Timer
          </button>
        </Link>
        <Link to="/analytics" exact>
          <button
            className={
              location.pathname.includes("/analytics")
                ? "tabBtn activetab"
                : "tabBtn"
            }
            type="button"
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

import React from "react";
import { Link } from "react-router-dom";

function SignedOutLinks() {
  return (
    <div className="signedOutLinksWrapper">
      <Link to="/login" exact>
        <button className="loginBtn">Login</button>
      </Link>
      <Link to="/signup" exact>
        <button className="signupBtn">SignUp</button>
      </Link>
    </div>
  );
}

export default SignedOutLinks;

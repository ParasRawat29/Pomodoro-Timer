import React, { useContext } from "react";
import { ProfileContext } from "../context/profile.context";
import SignedInLinks from "../Layout/SignedInLinks";
import SignedOutLinks from "../Layout/SignedOutLinks";

import "./navbar.css";

export default function Navbar(props) {
  const { profiles, isLoading } = useContext(ProfileContext);

  return (
    <nav className="navbarWrapper">
      <h1 className="logo">PomoTime</h1>
      {profiles ? <SignedInLinks {...props} /> : <SignedOutLinks />}
    </nav>
  );
}

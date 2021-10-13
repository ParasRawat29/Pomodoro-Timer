import React, { useContext } from "react";
import { ProfileContext } from "../context/profile.context";
import SignedInLinks from "../Layout/SignedInLinks";
import SignedOutLinks from "../Layout/SignedOutLinks";
import PomoTime from "../../vector/PomoTime.png";
import "./navbar.css";

export default function Navbar(props) {
  const { profiles, isLoading } = useContext(ProfileContext);

  return (
    <nav className="navbarWrapper">
      <img
        src={PomoTime}
        alt="Logo"
        width="50px"
        height="50px"
        className="logo"
      />

      {profiles ? (
        <SignedInLinks {...props} profiles={profiles} />
      ) : (
        <SignedOutLinks />
      )}
    </nav>
  );
}

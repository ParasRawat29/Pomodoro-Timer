import React, { useContext, useState } from "react";
import settingIcon from "../../vector/settings.png";
import { ProfileContext } from "../context/profile.context";
import SignedInLinks from "../Layout/SignedInLinks";
import SignedOutLinks from "../Layout/SignedOutLinks";

import "./navbar.css";

export default function Navbar(props) {
  const { profiles, isLoading } = useContext(ProfileContext);
  // console.log("isloading: ", isLoading, "profiles", profiles);
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
      <h1 style={{ display: "inline" }}>AppName</h1>
      {profiles ? <SignedInLinks {...props} /> : <SignedOutLinks />}
    </nav>
  );
}

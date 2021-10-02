import React, { useState } from "react";
import settingIcon from "../../vector/settings.png";
import SignedInLinks from "../Layout/SignedInLinks";
import SignedOutLinks from "../Layout/SignedOutLinks";
import "./navbar.css";

export default function Navbar(props) {
  return (
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <h1 style={{ display: "inline" }}>AppName</h1>
        <SignedInLinks {...props} />
        <SignedOutLinks />
      </div>
    </nav>
  );
}

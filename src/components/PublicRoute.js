import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { ProfileContext } from "./context/profile.context";

function PublicRoute({ children, path, ...rest }) {
  const { profiles, isLoading } = useContext(ProfileContext);
  // console.log("inPublicRoute", "isloading: ", isLoading, "profiles", profiles);

  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  if (!isLoading && profiles) {
    return <Redirect to="/" />;
  }

  return (
    <Route path={path} {...rest}>
      {children}
    </Route>
  );
}

export default PublicRoute;

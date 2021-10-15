import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { ProfileContext } from "../context/profile.context";

function PrivateRoute({ children, path, ...rest }) {
  const { profiles, isLoading } = useContext(ProfileContext);

  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  if (!isLoading && !profiles) {
    return <Redirect to="/login" />;
  }
  return (
    <Route path={path} {...rest}>
      {children}
    </Route>
  );
}

export default PrivateRoute;

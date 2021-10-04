import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { ProfileContext } from "./context/profile.context";

function PrivateRoute({ children, path, ...rest }) {
  const { profiles, isLoading } = useContext(ProfileContext);
  // console.log("inPrivateRoute", "isloading: ", isLoading, "profiles", profiles);

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

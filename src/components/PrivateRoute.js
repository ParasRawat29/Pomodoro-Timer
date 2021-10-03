import React from "react";
import { Redirect, Route } from "react-router";

function PrivateRoute({ children, path, ...rest }) {
  const isUser = true;
  if (!isUser) {
    return <Redirect to="/login" />;
  }
  return (
    <Route path={path} {...rest}>
      {children}
    </Route>
  );
}

export default PrivateRoute;

import React from "react";
import { Redirect, Route } from "react-router";

function PublicRoute({ children, path, ...rest }) {
  const isUser = false;
  if (isUser) {
    return <Redirect to="/" />;
  }
  return (
    <Route path={path} {...rest}>
      {children}
    </Route>
  );
}

export default PublicRoute;

// PrivateRoute.js
import React from 'react';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : null}
    />
  );
};

export default PrivateRoute;

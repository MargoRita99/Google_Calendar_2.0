import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
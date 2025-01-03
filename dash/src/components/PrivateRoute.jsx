import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, authToken }) => {
  if (!authToken) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;

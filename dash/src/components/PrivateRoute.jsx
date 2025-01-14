import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, authToken, authTokenMember }) => {
  if (!authToken && !authTokenMember) {
    return <Navigate to="/login" />;
   

  }
  console.log('User token:', authToken);
  console.log('Member token:', authTokenMember);
  return children;
};

export default PrivateRoute;

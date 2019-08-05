import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';

const LoginRequiredComponent = () => {
  const token = localStorage.getItem('Token');

  // check if token exist.
  if (!token) {
    return <Redirect to='/account/login' />;
  }

  // tslint:disable-next-line:no-string-literal
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return <React.Fragment />;
};

export default LoginRequiredComponent;

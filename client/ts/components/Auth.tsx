import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';

const LoginRequiredComponent = () => {
  const key = localStorage.getItem('Token');
  if (!key) {
    return <Redirect to='/account/login' />;
  } else {
    return <React.Fragment />;
  }
};

export default LoginRequiredComponent;

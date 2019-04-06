import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';

import {
  Home,
  SignIn,
} from './pages/Pages';

class App extends Component {
  public render(): React.ReactNode {
    return (
      <Router>
        <div className='page-container'>
          <Route path='/account/login' component={SignIn} />
          <Route path='/home' component={Home} />
          <Redirect from='/' to='/home' />
        </div>
      </Router>
    );
  }
}

export default hot(App);

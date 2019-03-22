import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import {
  Home,
  SignIn,
} from './pages/Pages';

class App extends Component {
  public render(): React.ReactNode {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/account/login' component={SignIn} />
        </div>
      </Router>
    );
  }
}

export default hot(App);

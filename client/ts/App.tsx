import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter as Router, Route } from 'react-router-dom';
import AnimatedSwitch from './components/Switch';

import {
  Home,
  SignIn,
} from './pages';

class App extends Component {
  public render(): React.ReactNode {
    return (
      <Router>
        <div className='page-container'>
          <AnimatedSwitch>
            <Route path='/account/login' component={SignIn} />
            <Route path='/' component={Home} />
          </AnimatedSwitch>
        </div>
      </Router>
    );
  }
}


export default hot(App);

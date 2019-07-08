import AnimatedSwitch from 'Component/Switch';
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import SignIn from './SignIn';

class App extends PureComponent {
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

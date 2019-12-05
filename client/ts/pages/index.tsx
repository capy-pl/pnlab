import { Switch } from 'Component/route';
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home';
import NotFound from './NotFound';
import SignIn from './SignIn';

class App extends PureComponent {
  public render(): React.ReactNode {
    return (
      <Router>
        <div className='page-container'>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path='/account/login' component={SignIn} />
              <Route path='/' component={Home} />
            </Switch>
          </React.Suspense>
        </div>
      </Router>
    );
  }
}

const PApp: typeof React.PureComponent = ENV === 'production' ? App : hot(App);

export default PApp;

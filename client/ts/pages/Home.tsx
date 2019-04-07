import React, { PureComponent as Component } from 'react';
import { Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Container } from 'semantic-ui-react';
import Navbar from '../components/menu/Navbar';

import Setting from './Setting';

export default class Home extends Component {
  public render() {
    return (
      <div>
        <Navbar />
        <Container>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
          >
            <Route path='/settings' component={Setting} />
          </AnimatedSwitch>
        </Container>
      </div>
    );
  }
}

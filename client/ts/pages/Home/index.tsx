import React, { PureComponent as Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Navbar from '../../components/menu/Navbar';

import Setting from './Setting';

export default class Home extends Component {
  public render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Switch>
            <Route path='/home/settings' component={Setting} />
          </Switch>
        </Container>
      </div>
    );
  }
}

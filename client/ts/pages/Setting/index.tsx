import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';

import { SettingMenu } from 'Component/menu';
import AnimatedSwitch from 'Component/Switch';
import Group from './Group';
import Profile from './Profile';
import Promotion from './Promotion';

export default class Setting extends PureComponent {
  public render() {
    return (
      <Container>
        <Grid>
          <Grid.Column width={3} >
            <SettingMenu />
          </Grid.Column>
          <Grid.Column width={13} >
            <Segment>
              <AnimatedSwitch>
                <Route exact path='/settings/profile' component={Profile} />
                <Route exact path='/settings/deleteitem' component={Group} />
                <Route exact path='/settings/promotion' component={Promotion} />
              </AnimatedSwitch>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

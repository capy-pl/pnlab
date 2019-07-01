import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';

import { SettingMenu } from '../../components/menu';
import AnimatedSwitch from '../../components/Switch';
import Profile from './Profile';

export default class Setting extends PureComponent {
  public render() {
    return (
      <Container>
        <Grid>
          <Grid.Column width={5} >
            <SettingMenu />
          </Grid.Column>
          <Grid.Column width={11} >
            <Segment>
              <AnimatedSwitch>
                <Route exact path='/settings/profile' component={Profile} />
              </AnimatedSwitch>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

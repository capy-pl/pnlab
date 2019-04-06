import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import { SettingMenu } from '../../components/menu';
import AnimatedSwitch from '../../components/Switch';

const Profile = () => (
  <div>
    Profile
  </div>
);

export default class Setting extends PureComponent {
  public render() {
    return (
      <Grid>
        <Grid.Column width={5}>
          <SettingMenu />
        </Grid.Column>
        <Grid.Column width={11}>
          <Segment>
            <AnimatedSwitch>
              <Route path='/settings/profile' component={Profile} />
            </AnimatedSwitch>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

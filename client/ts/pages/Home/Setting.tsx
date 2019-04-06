import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, Segment } from 'semantic-ui-react';
import { SettingMenu } from '../../components/menu';

const Profile = () => (
  <div>
    Profile
  </div>
);

export default class Setting extends PureComponent {
  public render() {
    return (
      <Grid>
        <Grid.Column width={4}>
          <SettingMenu />
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Switch>
              <Route path='/home/settings/profile' component={Profile} />
            </Switch>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

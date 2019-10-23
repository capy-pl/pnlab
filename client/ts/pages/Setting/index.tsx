import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { Container, Grid, Segment } from 'semantic-ui-react';

import { SettingMenu } from 'Component/menu';
import { Switch } from 'Component/route';
import Profile from './Profile';
import Promotion from './Promotion';
import UploadFormat from './UploadFormat';

export default class Setting extends PureComponent {
  public render() {
    return (
      <Container>
        <Grid>
          <Grid.Column width={3}>
            <SettingMenu />
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment padded='very'>
              <Switch>
                <Route exact path='/settings/profile' component={Profile} />
                <Route exact path='/settings/promotion' component={Promotion} />
                <Route exact path='/settings/uploadformat' component={UploadFormat} />
                <Route render={() => <div>404 Page Not Found.</div>} />
              </Switch>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

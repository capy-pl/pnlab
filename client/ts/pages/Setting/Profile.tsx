import React, { PureComponent } from 'react';
import { Form, Header } from 'semantic-ui-react';

import { getCurrentUser } from '../../PnApp/Helper';
import { User } from '../../PnApp/model';

type State = {
  user?: User;
};

export default class Profile extends PureComponent<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: getCurrentUser(),
    };
  }

  public render() {
    if (this.state.user) {
      return (
        <React.Fragment>
          <Header size='large' dividing>
            個人資訊
          </Header>
          <Form>
            <Form.Field width={10}>
              <label>電子信箱</label>
              <input placeholder='電子信箱' readOnly value={this.state.user.email} />
            </Form.Field>
            <Form.Field width={10}>
              <label>組織名稱</label>
              <input readOnly value={this.state.user.org.name} />
            </Form.Field>
          </Form>
        </React.Fragment>
      );
    }
    return <React.Fragment></React.Fragment>;
  }
}

import FormProfile from 'Component/form/FormProfile';
import React, { PureComponent } from 'react';
import { getCurrentUser } from '../../PnApp/Helper';

export default class Profile extends PureComponent {
  public render() {
    return <FormProfile user={getCurrentUser()}/>;
  }
}

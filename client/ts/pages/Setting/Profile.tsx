import ProfileForm from 'Component/form/ProfileForm';
import React, { PureComponent } from 'react';
import { getCurrentUser } from '../../PnApp/Helper';

export default class Profile extends PureComponent {
  public render() {
    return <ProfileForm user={getCurrentUser()}/>;
  }
}

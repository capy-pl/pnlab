import React, { PureComponent } from 'react';
import ProfileForm from '../../components/form/ProfileForm';
import { getCurrentUser } from '../../PnApp/helper';

export default class Profile extends PureComponent {
  public render() {
    return <ProfileForm user={getCurrentUser()}/>;
  }
}

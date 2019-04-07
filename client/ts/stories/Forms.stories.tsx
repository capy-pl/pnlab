import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import FilterForm from '../components/FilterForm';
import ProfileForm from '../components/form/ProfileForm';
import LoginForm from '../components/LoginForm';

const stories = storiesOf('Forms', module);

stories
  .add(
    'Filter Form', () => (
      <FilterForm />
    ))
  .add('Login Form', () => (
    <LoginForm />
  ))
  .add('Profile Form', () => {
    const fakeUser = {
      __v: 0,
      _id: '5ca837c0a50908f29c7fa3ed',
      email: 'admin@gmail.com',
      org: {
        __v: 0,
        _id: '5ca837c0a50908f29c7fa3ec',
        dbName: 'nccu',
        name: 'nccu',
      },
    };
    return <ProfileForm user={fakeUser} />;
  });

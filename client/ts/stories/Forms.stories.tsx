import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import FilterForm from '../components/form/FilterForm';
import LoginForm from '../components/form/LoginForm';
import ProfileForm from '../components/form/ProfileForm';
import { ConditionType } from '../PnApp/Model/Report';

const stories = storiesOf('Forms', module);

stories
  .add(
    'Filter Form', () => {
      const conditions = [
        {
          name: '餐別帶',
          type: 'string' as ConditionType,
          values: ['早餐時間帶', '中餐時間帶', '午餐時間帶', '一般時間帶'],
        },
      ];
      return <FilterForm conditions={conditions} />;
    })
  .add('Login Form', () => (
    <LoginForm />
  ))
  .add('Profile Form', () => {
    const fakeUser = {
      __v: 0,
      id: '5ca837c0a50908f29c7fa3ed',
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

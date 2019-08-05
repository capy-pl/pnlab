import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import FormAddReport from 'Component/form/FormAddReport';
import FormLogin from 'Component/form/FormLogin';
import FormProfile from 'Component/form/FormProfile';
import { ConditionType } from '../PnApp/model/Report';

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
      return <FormAddReport conditions={conditions} />;
    })
  .add('Login Form', () => (
    <FormLogin />
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
    return <FormProfile user={fakeUser} />;
  });

import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import FilterForm from '../components/FilterForm';
import LoginForm from '../components/LoginForm';

const stories = storiesOf('Forms', module);

stories
  .add(
    'Filter Form', () => (
      <FilterForm />
    ))
  .add('Login Form', () => (
    <LoginForm />
  ));

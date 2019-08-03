import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import { DatetimeInput } from '../components/input';

const stories = storiesOf('Input', module);

stories
  .add(
    'DatetimeInput', () => {
      const onChange = (date: Date) => {
        console.log(date.toISOString());
      };
      return <DatetimeInput onChange={onChange}/>;
    },
  );

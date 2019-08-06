import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import { DatetimeInput } from '../components/input';

const stories = storiesOf('Input', module);

stories
  .add(
    'DatetimeInput', () => {
      const onChange = (e, date: Date) => {
        console.log(date.toISOString());
      };
      const start = new Date(2017, 11, 1);
      const end = new Date(2017, 11, 31);
      return (
        <DatetimeInput
          min={start}
          max={end}
          onChange={onChange}
        />
      );
    },
  );

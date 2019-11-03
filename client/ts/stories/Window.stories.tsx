import { storiesOf } from '@storybook/react';
import { Window } from 'Component/';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

const stories = storiesOf('Window', module);

stories
  .add('window', () => (
    <Window show={true} title='Test'>
      <p>
        ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest
        ContentTest Content apple is good to eat
      </p>
    </Window>
  ))
  .add('multiple window', () => (
    <React.Fragment>
      <Window show={true} title='Window1'>
        Test
      </Window>
      <Window show={true} defaultX={250} title='Window2'>
        Test
      </Window>
    </React.Fragment>
  ));

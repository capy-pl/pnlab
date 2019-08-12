import { storiesOf } from '@storybook/react';
import { Window } from 'Component/';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

const stories = storiesOf('Window', module);

stories
  .add('window', () => (
  <Window
    show={true}
    title='Test'
  >
    <p>
      Test ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest ContentTest Content
    </p>
  </Window>));

import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import Graph from '../pages/GraphView';
import { data } from '../PnApp/global';

const stories = storiesOf('Graph', module);

stories
  .add(
    'Graph', () => (
      <Graph data={data} />
    ));

import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import Graph from '../components/graph';
import data from './samples/default.json';

const stories = storiesOf('Graph', module);

stories
  .add(
    'Graph', () => (
      <Graph nodes={data.nodes} edges={data.edges} />
    ));

import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import Graph from 'Component/graph';
import data from './samples/default.json';

const stories = storiesOf('Graph', module);

stories
  .add('Communities', () => <Graph nodes={data.nodes} edges={data.edges} comm={true} />)
  .add('ProductNetwork', () => (
    <Graph nodes={data.nodes} edges={data.edges} comm={false} />
  ));

import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import SideBar from '../pages/Report/SideBar';

const stories = storiesOf('Sidebar', module);

stories
  .add(
    'Sidebar', () => {
      return <SideBar />;
    },
  );

import { storiesOf } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import {
  DropdownMenu,
  Navbar,
  SecondaryNavbar,
  SettingMenu,
} from 'Component/menu';

const stories = storiesOf('Menu', module);

stories
  .addDecorator((story) => {
    return (
      <MemoryRouter>
        {story()}
      </MemoryRouter>
    );
  })
  .add(
    'Navigation Bar', () => (
      <Navbar />
    ))
  .add('Setting Menu', () => (
    <SettingMenu />
  ))
  .add(
    'Secondary Navigation Bar', () => (
      <SecondaryNavbar />
  ))
  .add(
    'Dropdown Menu', () => (
      <DropdownMenu />
  ));

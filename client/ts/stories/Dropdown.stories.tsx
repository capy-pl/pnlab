import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { DropdownProps } from 'semantic-ui-react';

import SearchDropdown from '../components/dropdown/SearchDropdown';

const stories = storiesOf('Dropdown', module);

stories
  .add(
    'Drop down', () => {
      const countryOptions = [
        { key: 'af', value: 'af', text: 'Afghanistan' },
        { key: 'ax', value: 'ax', text: 'Aland Islands' },
        { key: 'al', value: 'al', text: 'Albania' },
        { key: 'dz', value: 'dz', text: 'Algeria' },
        { key: 'as', value: 'as', text: 'American Samoa' },
        { key: 'ad', value: 'ad', text: 'Andorra' },
        { key: 'ao', value: 'ao', text: 'Angola' },
        { key: 'ai', value: 'ai', text: 'Anguilla' },
        { key: 'ag', value: 'ag', text: 'Antigua' },
        { key: 'ar', value: 'ar', text: 'Argentina' },
        { key: 'am', value: 'am', text: 'Armenia' },
        { key: 'aw', value: 'aw', text: 'Aruba' },
        { key: 'au', value: 'au', text: 'Australia' },
        { key: 'at', value: 'at', text: 'Austria' },
        { key: 'az', value: 'az', text: 'Azerbaijan' },
      ];

      function onChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
        console.log(data.value);
      }

      const placeholder = 'Please select a country';

      return <SearchDropdown placeholder={placeholder} options={countryOptions} onChange={onChange} />
    }
  );
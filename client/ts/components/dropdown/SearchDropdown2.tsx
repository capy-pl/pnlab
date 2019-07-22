import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const SearchDropdown2 = (props) => (
  <Dropdown
    clearable
    placeholder='State'
    fluid
    multiple
    search
    selection
    options={props.options}
  />
);

export default SearchDropdown2;

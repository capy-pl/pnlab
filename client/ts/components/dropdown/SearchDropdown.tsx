import React from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';

interface Option {
  key: string;
  value: string;
  text: string;
}

interface SearchDropDownProps {
  options: Option[];
  placeholder: string;
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const SearchDropdown = ({ placeholder, options, onChange }: SearchDropDownProps) => (
  <Dropdown
    placeholder={placeholder}
    fluid
    search
    selection
    icon=''
    onChange={onChange}
    options={options}
  />
);

export default SearchDropdown;

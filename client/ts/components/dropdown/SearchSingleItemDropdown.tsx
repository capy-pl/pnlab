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

const SearchSingleItemDropdown = ({ placeholder, options, onChange }: SearchDropDownProps) => (
  <Dropdown
    clearable
    placeholder={placeholder}
    search
    selection
    onChange={onChange}
    options={options}
    // style={{minWidth: '18%'}}
    style={{width: '100%'}}
  />
);

export default SearchSingleItemDropdown;

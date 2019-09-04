import React from 'react';
import { Dropdown, DropdownProps, Icon } from 'semantic-ui-react';

interface Option {
  key: string;
  value: string;
  text: string;
}

interface SearchDropDownProps {
  options: Option[];
  placeholder: string;
  onChange: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
}

const SearchSingleItemDropdown = ({
  placeholder,
  options,
  onChange,
}: SearchDropDownProps) => (
  <Dropdown
    clearable
    fluid
    placeholder={placeholder}
    search
    selection
    onChange={onChange}
    options={options}
    icon={<Icon name='search' style={{ padding: '10px' }} />}
  />
);

export default SearchSingleItemDropdown;

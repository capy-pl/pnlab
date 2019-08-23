import React from 'react';
import { Dropdown, DropdownProps, Icon } from 'semantic-ui-react';

interface Option {
  key: string;
  value: string | number;
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
    fluid={typeof options[0].value === 'string'}
    placeholder={placeholder}
    search
    selection
    onChange={onChange}
    options={options}
    icon={<Icon name='search' style={{ padding: '10px' }} />}
    noResultsMessage='無相關產品。'
    style={{ borderRadius: '18px' }}
  />
);

export default SearchSingleItemDropdown;

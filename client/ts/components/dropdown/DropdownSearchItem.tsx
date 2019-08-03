import React from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';

interface Option {
  key: string;
  value: string;
  text: string;
}

interface DropdownSearchProps {
  options: Option[];
  placeholder: string;
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const DropdownSearchItem = ({ placeholder, options, onChange }: DropdownSearchProps) => (
  <Dropdown
    // clearable
    placeholder={placeholder}
    multiple
    search
    selection
    onChange={onChange}
    options={options}
    style={{width: '100%'}}
  />
);

export default DropdownSearchItem;

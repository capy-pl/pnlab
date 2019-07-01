import React, { PureComponent } from 'react';
import { Dropdown, DropdownProps, Header, Segment } from 'semantic-ui-react';
import { Checkbox } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';

import { Condition } from '../../PnApp/Model/Report';

interface FilterFormProps {
  conditions: Condition[];
  onChange: (name: string, type: string) =>
  ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

interface FilterFormInputProps {
  condition: Condition;
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const FilterFormInput = ({ condition, onChange }: FilterFormInputProps) => {
  if (condition.type === 'string') {
    const options = condition.values.map((value) => {
      return {
        text: value,
        value,
      };
    });

    return (
      <Segment color='teal'>
        <Header block>{condition.name}</Header>
        <Dropdown
          onChange={onChange}
          placeholder={`Please select ${condition.name}`}
          fluid
          multiple
          search
          selection
          options={options}
        />
      </Segment>
    );
  } else {
    return <React.Fragment />;
  }
};

const FilterForm = ({ conditions, onChange }: FilterFormProps) => {
  const inputs = conditions.map((condition) => (
  <FilterFormInput
    key={condition.name}
    condition={condition}
    onChange={onChange(condition.name, condition.type)}
  />));
  return (
    <React.Fragment>
      {inputs}
    </React.Fragment>
  );
};

export default FilterForm;

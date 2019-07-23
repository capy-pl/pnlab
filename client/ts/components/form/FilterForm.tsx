import React, { PureComponent } from 'react';
import { Dropdown, DropdownProps, Header, Segment } from 'semantic-ui-react';

import { Condition } from '../../PnApp/model/Report';

interface FilterFormProps {
  conditions: Condition[];
  onChange: (name: string) =>
  ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

interface FilterFormInputProps {
  condition: Condition;
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const FilterFormInput = ({ condition, onChange }: FilterFormInputProps) => {
  if (condition.type === 'string' || condition.type === 'promotion') {
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
    onChange={onChange(condition.name)}
  />));
  return (
    <React.Fragment>
      {inputs}
    </React.Fragment>
  );
};

export default FilterForm;

import React from 'react';
import { Dropdown, DropdownProps, Header, Segment } from 'semantic-ui-react';

import { AddReportTime } from 'Component/input';
import { Condition } from '../../../../PnApp/model/Report';

interface FormAddReportInputProps {
  condition: Condition;
  defaultValue: string[];
  onChange: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
}

const FormAddReportInput = ({
  condition,
  onChange,
  defaultValue,
}: FormAddReportInputProps) => {
  if (condition.type === 'string' || condition.type === 'promotion') {
    const options = (condition.values as string[]).map((value) => {
      return {
        text: value,
        value,
      };
    });

    return (
      <Segment color='teal'>
        <Header block>{condition.name}</Header>
        <Dropdown
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={`請選擇${condition.name}`}
          fluid
          multiple
          search
          selection
          options={options}
        />
      </Segment>
    );
  } else if (condition.type === 'date') {
    return (
      <AddReportTime
        onChange={onChange}
        condition={condition}
        defaultValues={defaultValue}
      />
    );
  } else if (condition.type === 'method') {
    const options = (condition.values as string[]).map((value) => ({
      value,
      text: value,
    }));
    return (
      <Segment>
        <Header block>{condition.name}</Header>
        <Dropdown
          placeholder='預設是frequency'
          onChange={onChange}
          fluid
          selection
          search
          options={options}
          defaultValue={defaultValue}
        />
      </Segment>
    );
  } else {
    return <React.Fragment />;
  }
};

export default FormAddReportInput;

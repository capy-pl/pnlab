import React from 'react';
import { Button, DropdownProps, Segment } from 'semantic-ui-react';

import Input from './Input';
import { Condition } from '../../../../PnApp/model/Report';

export type PartType = 'add' | 'remove' | 'time' | 'method' | 'confirm';

interface Part {
  type: PartType;
  conditions: Condition[];
}

interface PartProps {
  type: PartType;
  onAdd: () => void;
  conditions: Condition[];
  defaultValues: { [key: string]: string[] };
  onChange: (
    name: string,
  ) => (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const Part = ({ conditions, onChange, type, defaultValues, onAdd }: PartProps) => {
  if (type === 'confirm') {
    return (
      <Segment textAlign='center'>
        <Button color='blue' fluid onClick={onAdd}>
          確認新增
        </Button>
      </Segment>
    );
  }

  const inputs = conditions.map((condition) => (
    <Input
      defaultValue={condition.name in defaultValues ? defaultValues[condition.name] : []}
      key={condition.name}
      condition={condition}
      onChange={onChange(condition.name)}
    />
  ));
  return <React.Fragment>{inputs}</React.Fragment>;
};

export default Part;

import React from 'react';
import { Label } from 'semantic-ui-react';

const ConditionBar = (props) => {
  const conditions: any[] = [];
  for (const condition of props.conditions) {
    condition.values.forEach((value) => {
      conditions.push(<Label key={value}>{value}</Label>);
    });
  }
  return (
    conditions
  );
};

export default ConditionBar;

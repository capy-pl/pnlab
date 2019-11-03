import React from 'react';
import { Icon } from 'semantic-ui-react';

interface StatusIconProps {
  status: 'success' | 'error' | 'pending';
}

const StatusIcon = ({ status }: StatusIconProps) => {
  let name: 'checkmark' | 'exclamation' | 'spinner';
  let color: 'green' | 'red' | 'grey';
  if (status === 'success') {
    name = 'checkmark';
    color = 'green';
  } else if (status === 'error') {
    name = 'exclamation';
    color = 'red';
  } else {
    name = 'spinner';
    color = 'grey';
  }
  return (
    <React.Fragment>
      <Icon
        size='large'
        name={name}
        color={color}
        loading={status === 'pending' ? true : false}
      />
    </React.Fragment>
  );
};

export default StatusIcon;

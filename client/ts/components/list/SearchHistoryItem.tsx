import React from 'react';
import { Button, Icon, Label, SemanticCOLORS, Table } from 'semantic-ui-react';
import { ProjectedReport } from '../../PnApp/Model/Report';

interface ItemProps {
  item: ProjectedReport;
  onLinkClick: () => void;
}

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

const COLORS = [
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black',
];

const Item = ({ item, onLinkClick }: ItemProps) => {
  const tagList = item.conditions
  // flatten all string condition values into single array.
  .reduce<string[]>((previous, currentValue) => {
    if (currentValue.type === 'string') {
      return previous.concat(currentValue.values as string[]);
    }
    return previous;
  }, [])
  .map((tag, index) => {
    return (
      <Label
        key={tag}
        color={COLORS[index % COLORS.length] as SemanticCOLORS}
        basic
      >
        {tag}
      </Label>
    );
  });

  return (
    <Table.Row
      style={{ clear: 'both' }}
    >
      <Table.Cell textAlign='center'>
        <StatusIcon status={item.status}/>
      </Table.Cell>
      <Table.Cell textAlign='center'>{item.startTime.toLocaleString()}</Table.Cell>
      <Table.Cell textAlign='center'>{item.endTime.toLocaleString()}</Table.Cell>
      <Table.Cell>{tagList}</Table.Cell>
      <Table.Cell>
        <Button
          content='View Detail'
          color='blue'
          icon='right arrow'
          labelPosition='right'
          disabled={item.status === 'success' ? false : true}
          onClick={onLinkClick}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;

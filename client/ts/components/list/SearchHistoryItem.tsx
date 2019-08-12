import React from 'react';
import { Button, Icon, Label, SemanticCOLORS, Table } from 'semantic-ui-react';
import {
  dateToString,
  stringToDate,
} from '../../PnApp/Helper';
import {
  Condition,
  ProjectedReport,
} from '../../PnApp/model/Report';

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

function extractDate(conditions: Condition[]): string[] | undefined {
  const time = conditions.filter((condition) => condition.type === 'date');
  if (time.length > 0) {
    return time[0].values;
  }
}

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
  const dateCondition = extractDate(item.conditions);
  return (
    <Table.Row
      style={{ clear: 'both' }}
      error={item.status === 'error'}
    >
      <Table.Cell textAlign='center'>
        <StatusIcon status={item.status}/>
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {dateCondition ? dateToString(stringToDate(dateCondition[0])) : 'All'}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {dateCondition ? dateToString(stringToDate(dateCondition[1])) : 'All'}
      </Table.Cell>
      <Table.Cell>{tagList}</Table.Cell>
      <Table.Cell>
        <Button
          content='View Detail'
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

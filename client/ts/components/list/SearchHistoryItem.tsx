import React from 'react';
import { Button, Label, SemanticCOLORS, Table } from 'semantic-ui-react';
import { dateToString, stringToDate } from '../../PnApp/Helper';
import { Condition, ReportPreview } from '../../PnApp/model/Report';

import { StatusIcon } from 'Component/icon';

interface ItemProps {
  item: ReportPreview;
  onLinkClick: () => void;
}

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
    return time[0].values as string[];
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
        <Label key={tag} color={COLORS[index % COLORS.length] as SemanticCOLORS} basic>
          {tag}
        </Label>
      );
    });
  const dateCondition = extractDate(item.conditions);
  return (
    <Table.Row style={{ clear: 'both' }} error={item.status === 'error'}>
      <Table.Cell textAlign='center'>
        <StatusIcon status={item.status} />
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {dateCondition ? dateToString(stringToDate(dateCondition[0])) : 'All'}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {dateCondition ? dateToString(stringToDate(dateCondition[1])) : 'All'}
      </Table.Cell>
      <Table.Cell>{tagList}</Table.Cell>
      <Table.Cell textAlign='center'>{item.created.toLocaleString()}</Table.Cell>
      <Table.Cell textAlign='center'>
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

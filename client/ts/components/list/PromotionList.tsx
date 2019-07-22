import React from 'react';
import { Label, SemanticCOLORS, Table } from 'semantic-ui-react';
import Promotion from '../../PnApp/Model/Promotion';

interface PromotionItemProps {
  item: Promotion;
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

const PromotionList = ({ item }: PromotionItemProps) => {
  const productAList = item.groupOne
  .map((tag, index) => {
    return (
      <Label
        key={tag}
        basic
      >
        {tag}
      </Label>
    );
  });

  const productBList = item.groupTwo
  .map((tag, index) => {
    return (
      <Label
        key={tag}
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
        {item.name}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.startTime.toLocaleString() === 'Invalid Date' ? 'All' : item.startTime.toLocaleString()}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.startTime.toLocaleString() === 'Invalid Date' ? 'All' : item.endTime.toLocaleString()}
      </Table.Cell>
      <Table.Cell>{productAList}</Table.Cell>
      <Table.Cell>{productBList}</Table.Cell>
    </Table.Row>
  );
};

export default PromotionList;

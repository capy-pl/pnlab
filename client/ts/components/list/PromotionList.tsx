import React from 'react';
import { Button, Label, SemanticCOLORS, Table } from 'semantic-ui-react';
import Promotion from '../../PnApp/Model/Promotion';

interface PromotionItemProps {
  item: Promotion;
  onButtonClick: () => void;
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

const PromotionList = ({ item, onButtonClick }: PromotionItemProps) => {
  return (
    <Table.Row
      style={{ clear: 'both' }}
    >
      <Table.Cell textAlign='center'>
        {item.name}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.startTime.toLocaleDateString() === 'Invalid Date' ? 'All' : item.startTime.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.endTime.toLocaleDateString() === 'Invalid Date' ? 'All' : item.endTime.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.type}
      </Table.Cell>
    </Table.Row>
  );
};

export default PromotionList;

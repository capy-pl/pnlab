import React from 'react';
import { Button, Icon, Label, SemanticCOLORS, Table } from 'semantic-ui-react';
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
        color={COLORS[index % COLORS.length] as SemanticCOLORS}
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
        {item.name}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.startTime}
      </Table.Cell>
      <Table.Cell textAlign='center'>
        {item.endTime}
      </Table.Cell>
      <Table.Cell>{productAList}</Table.Cell>
      <Table.Cell>{productBList}</Table.Cell>
    </Table.Row>
  );
};

export default PromotionList;

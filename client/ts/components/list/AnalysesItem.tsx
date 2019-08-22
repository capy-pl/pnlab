import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { AnalysisPreview } from '../../PnApp/Model/Analysis';

interface AnalysisItemProps {
  item: AnalysisPreview;
  onButtonClick: () => void;
}

const Item = ({ item, onButtonClick }: AnalysisItemProps) => {
  return (
    <Table.Row style={{ clear: 'both' }} textAlign='center'>
      <Table.Cell>{item.title}</Table.Cell>
      <Table.Cell>{item.created.toLocaleString()}</Table.Cell>
      <Table.Cell>
        <Button onClick={onButtonClick}>Detail</Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;

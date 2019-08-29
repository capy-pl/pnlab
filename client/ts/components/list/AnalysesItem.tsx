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
      <Table.Cell textAlign='center'>{item.title}</Table.Cell>
      <Table.Cell textAlign='center'>{item.created.toLocaleString()}</Table.Cell>
      <Table.Cell>
        <Button
          icon='right arrow'
          color='blue'
          labelPosition='right'
          content='View Detail'
          onClick={onButtonClick}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;
import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Analysis from '../../PnApp/Model/Analysis';

interface AnalysisItemProps {
  item: Analysis;
  onButtonClick: () => void;
}

const Analyses = ({ item, onButtonClick }: AnalysisItemProps) => {

  return (
    <Table.Row
      style={{ clear: 'both' }}
      textAlign='center'
    >
      <Table.Cell>
        {item.title}
      </Table.Cell>
      <Table.Cell>
        {item.created}
      </Table.Cell>
      <Table.Cell>
        <Button onClick={onButtonClick}>Detail</Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default Analyses;

import React from 'react';
import { Button, Icon, Popup, Table } from 'semantic-ui-react';
import { AnalysisPreview } from '../../PnApp/Model/Analysis';

interface AnalysisItemProps {
  item: AnalysisPreview;
  onButtonClick: () => void;
  onCheck: () => void;
  selected?: boolean;
  compareList: string[];
}

const Item = ({
  compareList,
  item,
  onButtonClick,
  onCheck,
  selected,
}: AnalysisItemProps) => {
  return (
    <Table.Row style={{ clear: 'both' }} textAlign='center' positive={selected}>
      <Table.Cell textAlign='center'>{item.title}</Table.Cell>
      <Table.Cell textAlign='center'>{item.created.toLocaleString()}</Table.Cell>
      <Table.Cell>
        <Popup
          content='勾選數量已達上限，請先取消已勾選項目'
          on='click'
          basic
          trigger={
            <Icon
              name='check circle'
              size='large'
              onClick={onCheck}
              style={{ cursor: 'pointer', color: selected ? '#00a3a3' : 'lightgrey' }}
            />
          }
          disabled={compareList.length !== 2}
        />
      </Table.Cell>
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

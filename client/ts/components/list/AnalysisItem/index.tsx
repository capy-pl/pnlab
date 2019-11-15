import React from 'react';
import { Icon, Popup, Table } from 'semantic-ui-react';
import { AnalysisPreview } from '../../../PnApp/Model/Analysis';

interface AnalysisItemProps {
  item: AnalysisPreview;
  click: (event: any) => void;
  dbclick: (event: any) => void;
  onCheck: (event: any) => void;
  selected?: boolean;
  compareList: string[];
  active: boolean;
}

const Item = ({
  compareList,
  item,
  click,
  dbclick,
  onCheck,
  selected,
  active,
}: AnalysisItemProps) => {
  return (
    <Table.Row
      active={!selected && active}
      onClick={click}
      onDoubleClick={dbclick}
      style={{ clear: 'both' }}
      textAlign='center'
      positive={selected}
    >
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
    </Table.Row>
  );
};

export default Item;

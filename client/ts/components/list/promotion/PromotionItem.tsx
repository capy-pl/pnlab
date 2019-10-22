import { ModalDeletePromotion, ModalEditPromotion } from 'Component/modal';
import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Promotion, { PromotionType } from '../../../PnApp/Model/Promotion';

interface PromotionItemProps {
  promotion: Promotion;
  onSave: () => Promise<void>;
}

function toVerbose(str: PromotionType) {
  switch (str) {
    case 'combination':
      return '合併刪除';
    case 'direct':
      return '直接刪除';
    default:
      return '';
  }
}

const PromotionItem = ({ promotion, onSave }: PromotionItemProps) => {
  return (
    <Table.Row style={{ clear: 'both' }}>
      <Table.Cell textAlign='center' width='3'>
        {promotion.name}
      </Table.Cell>
      <Table.Cell textAlign='center' width='3'>
        {promotion.startTime.toLocaleDateString() === 'Invalid Date'
          ? 'All'
          : promotion.startTime.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell textAlign='center' width='3'>
        {promotion.endTime.toLocaleDateString() === 'Invalid Date'
          ? 'All'
          : promotion.endTime.toLocaleDateString()}
      </Table.Cell>
      <Table.Cell textAlign='center' width='3'>
        {toVerbose(promotion.type)}
      </Table.Cell>
      <Table.Cell textAlign='center' width='4'>
        <Button.Group>
          <ModalEditPromotion onSave={onSave} model={promotion} />
          <ModalDeletePromotion onSave={onSave} model={promotion} />
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  );
};

export default PromotionItem;

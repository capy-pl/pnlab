import React from 'react';
import { Button, DropdownProps, Header, Icon, Modal } from 'semantic-ui-react';

import Analysis from '../../PnApp/model/Analysis';
import FormAnalysis from '../form/FormAnalysis';

interface ModalAddCompareProps {
  header: string;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  analyses: Analysis[];
  dropChangeA?: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
  dropChangeB?: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
}

const ModalAddCompare = ({
  header,
  onConfirm,
  onCancel,
  open,
  children,
  analyses,
  dropChangeA,
  dropChangeB,
}: ModalAddCompareProps) => {
  return (
    <React.Fragment>
      {children}
      <Modal basic size='small' open={open}>
        <Header content={header} />
        <Modal.Content>
          <FormAnalysis
            analysesA={analyses}
            analysesB={analyses}
            dropChangeA={dropChangeA}
            dropChangeB={dropChangeB}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' inverted onClick={onCancel}>
            <Icon name='remove' /> 取消
          </Button>
          <Button inverted onClick={onConfirm}>
            <Icon name='checkmark' /> 繼續
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default ModalAddCompare;

import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

import SaveGraphForm from '../form/FormAddAnalysis';

interface ModalAddAnalysisProps {
  header: string;
  content?: string;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const ModalAddAnalysis = ({ header, onConfirm, onCancel, open, children }: ModalAddAnalysisProps) => {
  return (
    <React.Fragment>
      {children}
      <Modal
        basic
        size='small'
        open={open}
      >
        <Header content={header} />
        <Modal.Content>
          <SaveGraphForm />
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color='red'
            inverted
            onClick={onCancel}
          >
            <Icon name='remove' /> 取消
          </Button>
          <Button
            color='green'
            inverted
            onClick={onConfirm}
          >
            <Icon name='checkmark' /> 確定儲存
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>);
};

export default ModalAddAnalysis;

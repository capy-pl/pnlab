import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

import FormAddAnalysis from '../form/FormAddAnalysis';

interface ModalAddAnalysisProps {
  header: string;
  content?: string;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  updateFormAdd: (title, note) => void;
}

const ModalAddAnalysis = ({ header, onConfirm, onCancel, open, children, updateFormAdd }: ModalAddAnalysisProps) => {
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
          <FormAddAnalysis updateFormAdd={updateFormAdd}/>
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

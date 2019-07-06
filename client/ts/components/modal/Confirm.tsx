import React, { useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface ModalConfirmProps {
  header: string;
  content: string;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const ModalConfirm = ({ header, content, onConfirm, onCancel, open, children }: ModalConfirmProps) => {
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
          <p>
            {content}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color='red'
            inverted
            onClick={onCancel}
          >
            <Icon name='remove' /> No
          </Button>
          <Button
            color='green'
            inverted
            onClick={onConfirm}
          >
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>);
};

export default ModalConfirm;

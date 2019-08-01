import React, { useState } from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface CompareAddProps {
  header: string;
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

const CompareAdd = ({ header, onConfirm, onCancel, open, children }: CompareAddProps) => {
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

export default CompareAdd;

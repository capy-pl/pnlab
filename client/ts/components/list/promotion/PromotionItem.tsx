import { ModalDeletePromotion, ModalEditPromotion } from 'Component/modal';
import React from 'react';
import { Button, Table, Icon, Popup } from 'semantic-ui-react';
import Promotion, { PromotionType } from '../../../PnApp/Model/Promotion';

interface Props {
  promotion: Promotion;
  onSave: () => Promise<void>;
}

interface State {
  modal: string;
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
export default class PromotionItem extends React.PureComponent<Props, State> {
  public state = {
    modal: '',
  };

  private close = () => {
    this.setState({
      modal: '',
    });
  };

  private open(name: string): () => void {
    return () => {
      document.body.click();
      this.setState({
        modal: name,
      });
    };
  }

  public render() {
    return (
      <Table.Row style={{ clear: 'both' }}>
        <Table.Cell textAlign='center' width='4'>
          {this.props.promotion.name}
        </Table.Cell>
        <Table.Cell textAlign='center' width='3'>
          {this.props.promotion.startTime.toLocaleDateString() === 'Invalid Date'
            ? 'All'
            : this.props.promotion.startTime.toLocaleDateString()}
        </Table.Cell>
        <Table.Cell textAlign='center' width='3'>
          {this.props.promotion.endTime.toLocaleDateString() === 'Invalid Date'
            ? 'All'
            : this.props.promotion.endTime.toLocaleDateString()}
        </Table.Cell>
        <Table.Cell textAlign='center' width='3'>
          {toVerbose(this.props.promotion.type)}
        </Table.Cell>
        <Table.Cell textAlign='center' width='3'>
          <Popup
            on='click'
            hideOnScroll
            hoverable
            trigger={
              <Button basic size='tiny' icon>
                <Icon name='ellipsis horizontal' />
              </Button>
            }
          >
            <Button.Group vertical basic>
              <Button
                color='blue'
                size='mini'
                onClick={this.open('edit')}
                icon='edit'
                style={{ marginBottom: '5px' }}
                content='編輯'
              />
              <Button
                color='red'
                size='mini'
                onClick={this.open('delete')}
                icon='delete'
                style={{ marginBottom: '5px' }}
                content='刪除'
              />
            </Button.Group>
          </Popup>
          <ModalEditPromotion
            close={this.close}
            show={this.state.modal === 'edit'}
            onSave={this.props.onSave}
            model={this.props.promotion}
          />
          <ModalDeletePromotion
            show={this.state.modal === 'delete'}
            onSave={this.props.onSave}
            model={this.props.promotion}
            close={this.close}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

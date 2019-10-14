import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';

import Promotion from '../../PnApp/model/Promotion';

interface State {
  show: boolean;
  loading: boolean;
  error: boolean;
}

interface Props {
  onSave: () => Promise<void>;
  model: Promotion;
}

export default class ModalDeletePromotion extends React.PureComponent<Props, State> {
  public state: State = {
    show: false,
    loading: false,
    error: false,
  };

  public show = () => {
    this.setState({
      show: true,
    });
  };

  public close = () => {
    this.setState({
      show: false,
    });
  };

  public delete = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.props.model.delete();
        await this.props.onSave();
        this.close();
      },
    );
  };

  public render() {
    return (
      <React.Fragment>
        <Button
          color='red'
          onClick={this.show}
          icon='delete'
          style={{ marginBottom: '5px' }}
          content='刪除'
        />
        <Modal open={this.state.show} closeOnDimmerClick={false} basic>
          <Header content={`刪除促銷「${this.props.model.name}」`} />
          <Modal.Content>
            <h3>確認是否要刪除促銷{this.props.model.name}?</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='grey'
              loading={this.state.loading}
              onClick={this.close}
              content='取消'
            />
            <Button
              color='red'
              loading={this.state.loading}
              onClick={this.delete}
              content='確認'
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

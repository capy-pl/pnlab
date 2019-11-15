import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';

import Promotion from '../../PnApp/model/Promotion';

interface State {
  loading: boolean;
  error: boolean;
}

interface Props {
  onSave: () => Promise<void>;
  close: () => void;
  model: Promotion;
  show: boolean;
}

export default class ModalDeletePromotion extends React.PureComponent<Props, State> {
  public state: State = {
    loading: false,
    error: false,
  };

  public delete = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.props.model.delete();
        await this.props.onSave();
        this.props.close();
      },
    );
  };

  public render() {
    return (
      <React.Fragment>
        <Modal open={this.props.show} closeOnDimmerClick={false} basic>
          <Header content={`刪除促銷「${this.props.model.name}」`} />
          <Modal.Content>
            <h3>確認是否要刪除促銷{this.props.model.name}?</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='grey'
              loading={this.state.loading}
              onClick={this.props.close}
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

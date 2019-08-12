import React from 'react';
import {
  Button,
  Header,
  Icon,
  Modal,
} from 'semantic-ui-react';

import Analysis from '../../PnApp/model/Analysis';
import {Comments} from '../../PnApp/model/Analysis';

interface ModalDeleteCommentState {
  show: boolean;
  loading: boolean;
  error: boolean;
}

interface ModalDeleteCommentProps {
  onSave: () => Promise<void>;
  model: Analysis;
  comment: Comments;
}

export default class ModalDeleteComment
  extends React.PureComponent<ModalDeleteCommentProps, ModalDeleteCommentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      error: false,
    };

    this.delete = this.delete.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  public show(): void {
    this.setState({
      show: true,
    });
  }

  public close(): void {
    this.setState({
      show: false,
      loading: false,
    });
  }

  public async delete(): Promise<void> {
    this.setState({
      loading: true,
    }, async () => {
      await this.props.model.deleteComment(this.props.comment._id);
      await this.props.onSave();
      this.close();
    });
  }

  public render() {
    return (
      <React.Fragment>
        <Button
          color='red'
          onClick={this.show}
          icon='delete'
          content='刪除'
          size='mini'
        />
        <Modal
          open={this.state.show}
          closeOnDimmerClick={false}
          basic
        >
          <Header content={`刪除留言`}/>
          <Modal.Content>
            <h3>確認是否要刪除留言「{this.props.comment.content}」?</h3>
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

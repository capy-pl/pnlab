import React from 'react';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';

import Analysis from '../../PnApp/model/Analysis';
import { Comments } from '../../PnApp/model/Analysis';

interface ModalAddCommentState {
  show: boolean;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  newComment: string;
}

interface ModalAddCommentProps {
  onSave: () => Promise<void>;
  model: Analysis;
}

export default class ModalAddComment extends React.PureComponent<
  ModalAddCommentProps,
  ModalAddCommentState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      error: false,
      errorMessage: '',
      newComment: '',
    };

    this.add = this.add.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.onChange = this.onChange.bind(this);
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

  public onChange(e, data: { [key: string]: any }): void {
    this.setState({
      newComment: data.value,
    });
  }

  public async add(): Promise<void> {
    if (!(this.state.newComment === '')) {
      try {
        this.setState({ loading: true }, async () => {
          await this.props.model.addComment(this.state.newComment);
          this.setState({
            loading: false,
            show: false,
          });
          this.props.onSave();
        });
      } catch (error) {
        this.setState({
          error: true,
          errorMessage: 'Bad Request',
          show: false,
        });
      }
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Button color='blue' onClick={this.show} icon='add' content='新增' size='mini' />
        <Modal open={this.state.show} closeOnDimmerClick={false} basic>
          <Modal.Header content={`新增留言`} />
          <Modal.Content>
            <div style={{ backgroundColor: 'white', padding: '20px' }}>
              <Form reply>
                <Form.TextArea onChange={this.onChange} />
              </Form>
            </div>
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
              onClick={this.add}
              content='確認'
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

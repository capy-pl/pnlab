import React from 'react';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';

import Analysis from '../../PnApp/model/Analysis';
import { Comments } from '../../PnApp/model/Analysis';

interface ModalAddCommentState {
  show: boolean;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  newContent: string;
}

interface ModalAddCommentProps {
  onSave: () => Promise<void>;
  model: Analysis;
  comment: Comments;
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
      newContent: '',
    };

    this.update = this.update.bind(this);
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
      newContent: data.value,
    });
  }

  public async update(): Promise<void> {
    if (!(this.state.newContent === '')) {
      try {
        const newComment: Comments = {
          userId: this.props.comment.userId,
          _id: this.props.comment._id,
          content: this.state.newContent,
        };
        this.setState({ loading: true }, async () => {
          await this.props.model.updateComment(newComment);
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
        <Button color='blue' onClick={this.show} icon='add' content='修改' size='mini' />
        <Modal open={this.state.show} closeOnDimmerClick={false} basic>
          <Modal.Header content={`編輯留言`} />
          <Modal.Content>
            <div style={{ backgroundColor: 'white', padding: '20px' }}>
              <Form reply>
                <Form.TextArea
                  onChange={this.onChange}
                  defaultValue={this.props.comment.content}
                />
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
              onClick={this.update}
              content='儲存修改'
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

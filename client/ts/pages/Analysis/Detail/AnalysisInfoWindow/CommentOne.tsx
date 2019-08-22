import React from 'react';
import { Comment, Form, Message, TextArea, TextAreaProps } from 'semantic-ui-react';

import { getCurrentUser } from '../../../../PnApp/Helper';
import { User } from '../../../../PnApp/model';
import Analysis, { Comment as CommentModel } from '../../../../PnApp/model/Analysis';

interface State {
  editMode: boolean;
  content: string;
  loading: boolean;
  err: boolean;
  errMessage: string;
}
interface Props {
  comment: CommentModel;
  model: Analysis;
  onSave: () => void;
}

export default class CommentOne extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content: props.comment.content,
      editMode: false,
      err: false,
      errMessage: '',
      loading: false,
    };
  }

  public toggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode,
      content: this.props.comment.content,
      err: false,
      errMessage: '',
    });
  };

  public onChange = (e, data: TextAreaProps) => {
    this.setState({
      content: data.value as string,
    });
  };

  public save = () => {
    if (!this.state.content) {
      this.setState({
        err: true,
        errMessage: '回覆不得為空。',
      });
    }
    this.setState(
      {
        err: false,
        errMessage: '',
        loading: true,
      },
      async () => {
        await this.props.model.updateComment({
          _id: this.props.comment._id,
          content: this.state.content,
        });
        this.setState({
          loading: false,
          editMode: false,
          err: false,
        });
        this.props.onSave();
      },
    );
  };

  public delete = async () => {
    await this.props.model.deleteComment(this.props.comment._id);
    await this.props.onSave();
  };

  public render() {
    const valid = (getCurrentUser() as User).id === this.props.comment.userId;
    return (
      <Comment key={this.props.comment._id}>
        <Comment.Content>
          <Comment.Author style={{ display: 'inline-block' }}>
            {this.props.comment.name as string}
          </Comment.Author>
          <Comment.Metadata>
            {`新增於 ${this.props.comment.created.toLocaleString()}`}
          </Comment.Metadata>
          <Comment.Text>
            <Form loading={this.state.loading} error={this.state.err}>
              {this.state.editMode ? (
                <TextArea onChange={this.onChange} value={this.state.content} />
              ) : (
                this.props.comment.content
              )}
              <Message error content={this.state.errMessage} />
            </Form>
          </Comment.Text>
          <Comment.Actions style={{ display: valid ? 'block' : 'none' }}>
            {this.state.editMode ? (
              <React.Fragment>
                <Comment.Action onClick={this.toggleEdit}>取消</Comment.Action>
                <Comment.Action onClick={this.save}>儲存</Comment.Action>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Comment.Action onClick={this.toggleEdit}>編輯</Comment.Action>
                <Comment.Action onClick={this.delete}>刪除</Comment.Action>
              </React.Fragment>
            )}
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    );
  }
}

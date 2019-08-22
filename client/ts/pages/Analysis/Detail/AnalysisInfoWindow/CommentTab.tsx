import React from 'react';
import {
  Button,
  Comment,
  Divider,
  Form,
  Message,
  TextAreaProps,
} from 'semantic-ui-react';

import { Comment as CommentModel } from '../../../../PnApp/model/Analysis';
import { Analysis } from '../../../../PnApp/model';
import CommentOne from './CommentOne';

interface Props {
  active: boolean;
  model: Analysis;
  onSaved: () => void;
  comments: CommentModel[];
}

interface State {
  err: boolean;
  errMessage: string;
  content: string;
  loading: boolean;
}

export default class CommentTab extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      err: false,
      errMessage: '',
      content: '',
      loading: false,
    };
  }

  public add = () => {
    if (!this.state.content) {
      this.setState({
        err: true,
        errMessage: '回應內容不得為空。',
      });
      return;
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.props.model.addComment(this.state.content);
        await this.props.model.reload();
        await this.props.onSaved();
        this.setState({
          loading: false,
          content: '',
          err: false,
        });
      },
    );
  };

  public onChange = (
    event: React.FormEvent<HTMLTextAreaElement>,
    data: TextAreaProps,
  ) => {
    const { value } = data;
    this.setState({
      err: false,
      content: value as string,
    });
  };

  public getComments = () => {
    return this.props.comments.map((comment) => (
      <CommentOne
        onSave={this.props.onSaved}
        key={comment._id}
        comment={comment}
        model={this.props.model}
      />
    ));
  };

  public render() {
    if (this.props.active) {
      return (
        <Comment.Group>
          <Form loading={this.state.loading} error={this.state.err} reply>
            <Form.TextArea onChange={this.onChange} value={this.state.content} rows='3' />
            <Button
              onClick={this.add}
              content='新增留言'
              labelPosition='left'
              icon='edit'
              primary
            />
            <Message error content={this.state.errMessage} />
          </Form>
          <Divider />
          {this.getComments()}
        </Comment.Group>
      );
    }
    return <React.Fragment />;
  }
}

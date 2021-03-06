import React, { ChangeEvent, PureComponent } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';

import { User } from '../../PnApp/model';

interface FormProfileProps {
  user: User;
}

interface FormProfileState {
  email: string;
  isError: boolean;
  errorMessage: string;
}

export default class FormProfile extends PureComponent<
  FormProfileProps,
  FormProfileState
> {
  state = {
    email: '',
    errorMessage: 'test',
    isError: false,
  };

  public componentDidMount() {
    this.setState({ email: this.props.user.email });
  }

  public onChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  public onClick = () => {
    this.setState({ isError: !this.state.isError });
  };

  public render() {
    return (
      <Form error={this.state.isError}>
        <Form.Field width={10}>
          <label>Email</label>
          <input placeholder='Email' value={this.state.email} onChange={this.onChange} />
        </Form.Field>
        <Message error content={this.state.errorMessage} />
        <Form.Field width={10}>
          <label>Organization</label>
          <input disabled={true} value={this.props.user.org.name} />
        </Form.Field>
        <Button onClick={this.onClick}>Update</Button>
      </Form>
    );
  }
}

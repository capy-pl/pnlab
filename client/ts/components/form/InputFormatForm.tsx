import React, { PureComponent } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';

export default class InputFormatForm extends PureComponent<> {
  constructor(props: ProfileFormProps) {
    super(props);
    this.state = {
      email: '',
      errorMessage: 'test',
      isError: false,
    };
  }

  public render() {
    return (
      <Form error={this.state.isError}>
        <Form.Field width={10}>
          <label>Email</label>
          <input placeholder='Email' value={this.state.email} onChange={this.onChange} />
        </Form.Field>
        <Message
          error
          content={this.state.errorMessage}
        />
        <Form.Field width={10}>
          <label>Organization</label>
          <input disabled={true} value={this.props.user.org.name} />
        </Form.Field>
        <Button onClick={this.onClick}>
          Update
        </Button>
      </Form>
    );
  }
}

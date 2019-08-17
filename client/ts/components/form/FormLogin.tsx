import axios from 'axios';
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

import { Auth } from '../../PnApp';
import { updateCurrentUser } from '../../PnApp/Helper';

interface FormLoginState {
  email: string;
  password: string;
  loading: boolean;
  error: boolean;
  redirect: boolean;
}

class FormLogin extends PureComponent<{}, FormLoginState> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: false,
      loading: false,
      password: '',
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  public handleChange(keyName: 'email' | 'password', value: string): void {
    if (keyName === 'email') {
      this.setState({ email: value });
    } else {
      this.setState({ password: value });
    }
  }

  public async onClick() {
    this.setState({ loading: true });
    try {
      const token = await Auth.login(this.state.email, this.state.password);
      localStorage.setItem('Token', token);
      this.setState({ redirect: true });
      // tslint:disable-next-line:no-string-literal
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await updateCurrentUser();
    } catch (err) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  }

  public render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    } else {
      return (
        <Segment style={{ width: '35%' }}
padded
raised>
          <Grid textAlign='center'
style={{ height: '100%' }}
verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2'
color='teal'
textAlign='center'>
                Login
            </Header>
              <Form size='large'
loading={this.state.loading}
error={this.state.error}>
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='E-mail address'
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={(e, { value }) => { this.handleChange('email', value as string); }}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={(e, { value }) => { this.handleChange('password', value as string); }}
                  />
                  <Button color='teal'
fluid
size='large'
disabled={this.state.loading}
onClick={this.onClick}>
                    Login
                  </Button>
                </Segment>
                <Message
                  error
                  header='Error'
                  content='Wrong email or password.'
                />
              </Form>
              <Message>
                New to us? <a href='#'>Sign Up</a>
              </Message>
            </Grid.Column>
          </Grid>
        </Segment>
      );
    }
  }
}

export default FormLogin;

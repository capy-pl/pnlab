import LoginForm from 'Component/form/LoginForm';
import React, { PureComponent } from 'react';

const outerStyle = {
  height: '100%',
  position: 'fixed',
  width: '100%',
  zIndex: '100',
};

const style = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
  zIndex: 50,
};

class SignInPage extends PureComponent {
  public render(): React.ReactNode {
    return (
      <div style={outerStyle}>
        <div style={style}>
          <LoginForm />
        </div>
      </div>
    );
  }
}

export default SignInPage;

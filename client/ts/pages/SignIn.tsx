import FormLogin from 'Component/form/FormLogin';
import React, { PureComponent } from 'react';

const outerStyle: React.CSSProperties = {
  height: '100%',
  position: 'fixed',
  width: '100%',
  zIndex: 100,
};

const style: React.CSSProperties = {
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
          <FormLogin />
        </div>
      </div>
    );
  }
}

export default SignInPage;

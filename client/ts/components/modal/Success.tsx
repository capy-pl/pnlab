import React from 'react';
import { Message } from 'semantic-ui-react';

const MessageSuccessSaveReport = () => (
  <Message positive style={{textAlign: 'center'}}>
    <Message.Header>You are eligible for a reward</Message.Header>
    <p>
      Go to your <b>special offers</b> page to see now.
    </p>
  </Message>
);

export default MessageSuccessSaveReport;

import React from 'react';
import { Container, Message } from 'semantic-ui-react';

const NotFound = () => (
  <Container textAlign='center'>
    <Message negative>
      <Message.Header>404 Pages Not Found</Message.Header>
    </Message>
  </Container>
);

export default NotFound;

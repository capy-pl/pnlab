import React from 'react';
import { Container, Dimmer, Loader, SemanticSIZES } from 'semantic-ui-react';

interface LoaderProps {
  size: SemanticSIZES;
}

const XLoader = ({ size }: LoaderProps) => (
  <div>
    <Container>
      <Dimmer active>
        <Loader size={size}>Loading...</Loader>
      </Dimmer>
    </Container>
  </div>
);

export default XLoader;

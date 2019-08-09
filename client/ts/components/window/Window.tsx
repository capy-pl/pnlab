import React from 'react';
import {
  Card,
} from 'semantic-ui-react';
export default class Window extends React.PureComponent {
  public render() {
    return (
      <Card raised>
        <Card.Content
          style={{ padding: '5px' }}
        >
          <Card.Description
            textAlign='center'
          >
            Some title.
          </Card.Description>
        </Card.Content>
        <Card.Content>
          I am a cool window.          I am a cool window.
          I am a cool window.
          I am a cool window.
          I am a cool window.
          I am a cool window.
          I am a cool window.
          I am a cool window.
        </Card.Content>
      </Card>
    );
  }
}

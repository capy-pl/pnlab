import React, { Component } from 'react';
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react';

export default class SidebarExampleSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
  }

  public handleToggleSidebar() {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  public render() {
    return (
      <div>
        <Button onClick={this.handleToggleSidebar}>
          條件
        </Button>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            direction='right'
            icon='labeled'
            inverted
            vertical
            visible={this.state.visible}
            width='thin'
          >
            <Menu.Item as='a'>
              <Icon name='home' />
              Home
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Segment basic>
              <Header as='h3'>Application Content</Header>
              <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

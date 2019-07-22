import React, { PureComponent } from 'react';
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react';

interface SidebarState {
  visible: boolean;
}

export default class SidebarExampleSidebar extends PureComponent<{}, SidebarState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);
  }

  public handleHideClick(): void {
    this.setState({ visible: false });
  }
  public handleShowClick(): void {
    this.setState({ visible: true });
  }
  public handleSidebarHide(): void {
    this.setState({ visible: false });
  }

  public render() {
    const { visible } = this.state;

    return (
      <div>
        <Button.Group>
          <Button disabled={visible} onClick={this.handleShowClick}>
            Show sidebar
          </Button>
          <Button disabled={!visible} onClick={this.handleHideClick}>
            Hide sidebar
          </Button>
        </Button.Group>

        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={visible}
            width='thin'
          >
            <Menu.Item as='a'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Segment basic />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

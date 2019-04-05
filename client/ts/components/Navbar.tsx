import React, { Component } from 'react';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import LoginRequiredComponent from '../components/Auth';
import { Auth } from '../PnApp';

interface MenuState {
  activeItem: string;
}

export default class Navbar extends Component<{}, MenuState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
    };
    this.logout = this.logout.bind(this);
  }

  public logout(): void {
    Auth.logout();
    this.forceUpdate();
  }

  public render() {
    const { activeItem } = this.state;

    return (
      <Segment inverted>
        <LoginRequiredComponent />
        <Menu inverted secondary pointing>
          <Menu.Item
            name='Home'
            active={activeItem === 'home'}
          />
          <Menu.Menu position='right'>
            <Dropdown item text='User Name'>
              <Dropdown.Menu>
                <Dropdown.Item>Setting</Dropdown.Item>
                <Dropdown.Item onClick={this.logout}>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}

import React, { Component } from 'react';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import { Auth } from '../../PnApp';
import { getCurrentUser, hasToken, updateCurrentUser } from '../../PnApp/helper';
import { User } from '../../PnApp/model';
import LoginRequiredComponent from '../Auth';

interface MenuState {
  activeItem: string;
  user: User | null;
}

export default class Navbar extends Component<{}, MenuState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
      user: null,
    };
    this.logout = this.logout.bind(this);
  }

  public async componentDidMount() {
    if (hasToken()) {
      await updateCurrentUser();
      this.setState({ user: getCurrentUser() });
    }
  }

  public logout(): void {
    Auth.logout();
    this.forceUpdate(); // After use log out, need to forceUpdate the component to trigger LoginRequred Component.
  }

  public render() {
    const { activeItem } = this.state;

    return (
      <Segment inverted>
        <LoginRequiredComponent />
        <Menu inverted secondary>
          <Menu.Item
            href='/#/'
            name='Home'
            active={activeItem === 'home'}
          />
          <Menu.Menu position='right'>
            <Dropdown item text={this.state.user ? this.state.user.email : ''}>
              <Dropdown.Menu>
                <Dropdown.Item href='/#/settings/profile'>
                  Setting
                </Dropdown.Item>
                <Dropdown.Item onClick={this.logout}>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}

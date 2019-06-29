import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import { Auth } from '../../PnApp';
import { User } from '../../PnApp/Model';

import { getCurrentUser, urlPrefix } from '../../PnApp/Helper';

interface MenuState {
  activeItem: string;
  user: User | undefined;
}

class Navbar extends Component<RouteComponentProps, MenuState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
      user: getCurrentUser(),
    };
    this.logout = this.logout.bind(this);
  }

  public logout(): void {
    Auth.logout();
    const { history } = this.props;
    history.push('/account/login');
  }

  public render() {
    const { activeItem } = this.state;

    return (
      <Segment inverted>
        <Menu inverted secondary>
          <Menu.Item
            href={urlPrefix('/')}
            name='Home'
            active={activeItem === 'home'}
          />
          <Menu.Menu position='right'>
            <Dropdown item text={this.state.user ? this.state.user.email : ''}>
              <Dropdown.Menu>
                <Dropdown.Item href={urlPrefix('/settings/profile')}>
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

const NavbarComponent = withRouter(Navbar);
export default NavbarComponent;

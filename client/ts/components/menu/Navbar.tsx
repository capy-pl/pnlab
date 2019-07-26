import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import { Auth } from '../../PnApp';
import { getCurrentUser } from '../../PnApp/Helper';
import { User } from '../../PnApp/model';
import { Link } from '../route';

interface MenuState {
  activeItem: string;
  user: User | undefined;
}

class Navbar extends PureComponent<RouteComponentProps, MenuState> {
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
            active={activeItem === 'home'}
          >
            <Link to='/'>Home</Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Dropdown item text={this.state.user ? this.state.user.email : ''}>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link style={{color: 'black'}} to='/settings/profile'>Setting</Link>
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

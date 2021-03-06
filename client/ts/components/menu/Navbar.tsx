import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dropdown, Menu, MenuItemProps, Segment } from 'semantic-ui-react';
import { Auth } from '../../PnApp';
import { getCurrentUser } from '../../PnApp/Helper';
import { User } from '../../PnApp/model';

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
    this.onClick = this.onClick.bind(this);
  }

  public logout(): void {
    Auth.logout();
    const { history } = this.props;
    history.push('/account/login');
  }

  public onClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    { name }: MenuItemProps,
  ): void {
    this.setState({ activeItem: name as string });
  }

  public render() {
    const { activeItem } = this.state;

    return (
      <Segment inverted>
        <Menu inverted secondary>
          <Menu.Item
            name={'home'}
            onClick={this.onClick}
            to={'/'}
            as={Link}
            active={activeItem === 'home'}
          >
            首頁
          </Menu.Item>
          <Menu.Item
            name={'analysis'}
            onClick={this.onClick}
            to={'/analysis'}
            as={Link}
            active={activeItem === 'analysis'}
          >
            過去儲存圖庫與比較
          </Menu.Item>
          <Menu.Menu position='right'>
            <Dropdown item text={this.state.user ? this.state.user.email : ''}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to='/upload'>
                  上傳資料
                </Dropdown.Item>
                <Dropdown.Item as={Link} to='/settings/profile'>
                  設定
                </Dropdown.Item>
                <Dropdown.Item onClick={this.logout}>登出</Dropdown.Item>
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

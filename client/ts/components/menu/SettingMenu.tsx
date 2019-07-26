import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItemProps } from 'semantic-ui-react';

interface SettingMenuState {
  activeItem: string | undefined;
}
export default class SettingMenu extends PureComponent<{}, SettingMenuState> {
    constructor(props) {
      super(props);
      this.state = {
        activeItem: 'Profile',
      };
      this.onClick = this.onClick.bind(this);
    }

  public onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps): void {
      this.setState({ activeItem: name });
    }

    public render() {
      return (
        <Menu vertical tabular fluid>
          <Menu.Item
            name='Profile'
            active={this.state.activeItem === 'Profile'}
            onClick={this.onClick}
          >
              <Link to='/settings/profile'>Profile</Link>
          </Menu.Item>
          <Menu.Item
            name='Setting'
            active={this.state.activeItem === 'Setting'}
            onClick={this.onClick}
          >
            <Link to='/settings/profile'>Setting</Link>
          </Menu.Item>
          <Menu.Item
            name='Manage Group'
            active={this.state.activeItem === 'Manage Group'}
            onClick={this.onClick}
          >
            <Link to='/settings'>Manage Group</Link>
          </Menu.Item>
      </Menu>
      );
    }
}

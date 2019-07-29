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
        activeItem: 'Setting',
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
            name='Setting'
            as={Link}
            to={'/settings'}
            active={this.state.activeItem === 'Setting'}
            onClick={this.onClick}
          >
            Setting
          </Menu.Item>
          <Menu.Item
            name='Profile'
            active={this.state.activeItem === 'Profile'}
            onClick={this.onClick}
            to='/settings/profile'
            as={Link}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            name='Manage Group'
            as={Link}
            to={'/settings'}
            active={this.state.activeItem === 'Manage Group'}
            onClick={this.onClick}
          >
            Manage Group
          </Menu.Item>
      </Menu>
      );
    }
}

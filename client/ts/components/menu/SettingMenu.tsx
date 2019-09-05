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

  public onClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    { name }: MenuItemProps,
  ): void {
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
          設定
        </Menu.Item>
        <Menu.Item
          name='Profile'
          active={this.state.activeItem === 'Profile'}
          onClick={this.onClick}
          to='/settings/profile'
          as={Link}
        >
          個人資訊
        </Menu.Item>
        <Menu.Item
          name='Promotion'
          as={Link}
          to='/settings/promotion'
          active={this.state.activeItem === 'Promotion'}
          onClick={this.onClick}
        >
          促銷
        </Menu.Item>
      </Menu>
    );
  }
}

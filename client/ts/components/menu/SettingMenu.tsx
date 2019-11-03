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
          name='Profile'
          active={this.state.activeItem === 'Profile'}
          onClick={this.onClick}
          to='/settings/profile'
          as={Link}
        >
          個人資訊
        </Menu.Item>
        <Menu.Item
          name='UploadFormat'
          active={this.state.activeItem === 'UploadFormat'}
          onClick={this.onClick}
          to='/settings/uploadformat'
          as={Link}
        >
          上傳格式
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

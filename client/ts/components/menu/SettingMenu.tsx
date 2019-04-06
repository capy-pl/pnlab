import React, { PureComponent } from 'react';
import { Menu, MenuItemProps } from 'semantic-ui-react';

interface SettingMenuState {
  activeItem: string | undefined;
}
export default class SettingMenu extends PureComponent<{}, SettingMenuState> {
    constructor(props) {
      super(props);
      this.state = {
        activeItem: undefined,
      };
      this.onClick = this.onClick.bind(this);
    }

  public onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps): void {
      this.setState({ activeItem: name });
    }

    public render() {
      return (
      <Menu pointing vertical>
        <Menu.Item
          href='/#/home/settings/profile'
          name='Profile'
          active={this.state.activeItem === 'Profile'}
          onClick={this.onClick}
        />
        <Menu.Item
          name='Setting'
          active={this.state.activeItem === 'Setting'}
          onClick={this.onClick}
        />
      </Menu>
      );
    }
}

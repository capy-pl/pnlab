import React, { PureComponent } from 'react';
import { Menu, MenuItemProps } from 'semantic-ui-react';
import { urlPrefix } from '../../PnApp/Helper';

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
          href={urlPrefix('/settings/profile')}
          name='Profile'
          active={this.state.activeItem === 'Profile'}
          onClick={this.onClick}
        />
        <Menu.Item
          name='Setting'
          href={urlPrefix('/settings')}
          active={this.state.activeItem === 'Setting'}
          onClick={this.onClick}
        />
        <Menu.Item
          name='Import Format'
          href={urlPrefix('/settings')}
          active={this.state.activeItem === 'Import Format'}
          onClick={this.onClick}
        />
        <Menu.Item
          name='Manage Group'
          href={urlPrefix('/settings')}
          active={this.state.activeItem === 'Manage Group'}
          onClick={this.onClick}
        />
      </Menu>
      );
    }
}

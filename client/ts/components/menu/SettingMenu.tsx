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
          name='Delete Item'
          href={urlPrefix('/settings/deleteitem')}
          active={this.state.activeItem === 'Delete Item'}
          onClick={this.onClick}
        />
        <Menu.Item
          name='Promotion'
          href={urlPrefix('/settings/promotion')}
          active={this.state.activeItem === 'Promotion'}
          onClick={this.onClick}
        />
      </Menu>
      );
    }
}

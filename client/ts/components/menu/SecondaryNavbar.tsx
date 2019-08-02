import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {  Dropdown, Menu, MenuItemProps } from 'semantic-ui-react';

interface SecondaryMenuState {
  activeItem: string | undefined;
}

class SecondaryNavbar extends PureComponent<RouteComponentProps, SecondaryMenuState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  public handleItemClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps): void {
    this.setState({ activeItem: name });
  }

  public render() {
    const { activeItem } = this.state;

    return (
      <Menu pointing secondary>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item
          name='messages'
          active={activeItem === 'messages'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='friends'
          active={activeItem === 'friends'}
          onClick={this.handleItemClick}
        />
      </Menu>
    );
  }
}

const SecondaryNavbarComponent = withRouter(SecondaryNavbar);
export default SecondaryNavbarComponent;

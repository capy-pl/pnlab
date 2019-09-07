import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Sidebar, SidebarProps } from 'semantic-ui-react';

interface AnalysisSidebarState {
  activeItem?: string | undefined;
}

interface AnalysisSidebarProps {
  visible: boolean;
}

const sidebarStyle: React.CSSProperties = {
  zIndex: 100,
  height: '100%',
  width: '15%',
  position: 'absolute',
  left: 0,
};

export default class AnalysisSidebar extends PureComponent<
  AnalysisSidebarProps,
  AnalysisSidebarState
> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Description',
    };
    this.onClick = this.onClick.bind(this);
  }

  public onClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    { name }: SidebarProps,
  ): void {
    this.setState({ activeItem: name });
  }

  public render() {
    return (
      <div>
        <Sidebar.Pushable style={sidebarStyle}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            vertical
            visible={this.props.visible}
            width='thin'
          >
            <Menu.Item
              as='a'
              name='Description'
              active={this.state.activeItem === 'Description'}
              onClick={this.onClick}
            >
              Description
            </Menu.Item>
            <Menu.Item
              as='a'
              name='Comment'
              active={this.state.activeItem === 'Comment'}
              onClick={this.onClick}
            >
              Comment
            </Menu.Item>
          </Sidebar>
        </Sidebar.Pushable>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import { Menu, MenuItemProps, Message, Segment, Table } from 'semantic-ui-react';
import { isUndefined } from 'lodash';

import { Window } from 'Component/';
import Report from '../../../PnApp/model/Report';

interface Props {
  close: () => void;
  show: boolean;
  report: Report;
}

interface State {
  activeIndex: number;
}

export default class CommunityCharacterWindow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };

    this.onClickMenu = this.onClickMenu.bind(this);
  }

  public onClickMenu(e, props: MenuItemProps) {
    const { index } = props;
    this.setState({
      activeIndex: index as number,
    });
  }

  public getCoreList(): JSX.Element[] {
    return this.props.report.communities
      .filter((community) => !isUndefined(community.core))
      .map((community) => (
        <Table.Row key={community.id}>
          <Table.Cell>{community.core}</Table.Cell>
          <Table.Cell>{community.id}</Table.Cell>
        </Table.Row>
      ));
  }

  public getHookList(): JSX.Element[] {
    return this.props.report.hooks.map((hook) => {
      const connectedCommunitiesIds = hook.connectTo.join(', ');
      return (
        <Table.Row key={hook.name}>
          <Table.Cell>{hook.name}</Table.Cell>
          <Table.Cell>{Math.round(hook.weight)}</Table.Cell>
          <Table.Cell>{connectedCommunitiesIds}</Table.Cell>
        </Table.Row>
      );
    });
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    const coreList = this.getCoreList();
    const hookList = this.getHookList();
    return (
      <Window
        title='Community角色列表'
        defaultX={260}
        onClickX={this.props.close}
        defaultHeight={400}
        defaultWidth={400}
      >
        <React.Fragment>
          <Menu attached='top' tabular>
            <Menu.Item
              onClick={this.onClickMenu}
              index={0}
              active={this.state.activeIndex === 0}
            >
              Core
            </Menu.Item>
            <Menu.Item
              onClick={this.onClickMenu}
              index={1}
              active={this.state.activeIndex === 1}
            >
              Hooks
            </Menu.Item>
          </Menu>
          <Segment hidden={this.state.activeIndex !== 0} attached='bottom'>
            <Message info content='僅列出產品數大於4之產品群的core' />
            <Table selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>產品名稱</Table.HeaderCell>
                  <Table.HeaderCell>產品所屬Communnity</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{coreList.length ? coreList : '無Core資訊。'}</Table.Body>
            </Table>
          </Segment>
          <Segment hidden={this.state.activeIndex !== 1} attached='bottom'>
            <Table selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>產品名稱</Table.HeaderCell>
                  <Table.HeaderCell>產品權重</Table.HeaderCell>
                  <Table.HeaderCell>連接的產品群</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{hookList.length ? hookList : '無Hook資訊。'}</Table.Body>
            </Table>
          </Segment>
        </React.Fragment>
      </Window>
    );
  }
}

import React, { PureComponent } from 'react';
import { Message, Tab } from 'semantic-ui-react';
import { Community, Hook } from '../../PnApp/Model/Report';

interface CharacterMessageProps {
  communitiesInfo?: Community[];
  hookInfo?: Hook[];
}

interface MessageState {
  visible: boolean;
}

export default class CharacterMessage extends PureComponent<CharacterMessageProps, MessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  public handleDismiss() {
    this.setState({ visible: false });
  }

  public render() {
    const TabPanel = () => {
      let cores;
      if (this.props.communitiesInfo) {
        cores = this.props.communitiesInfo.map((community) => {
          if (community.core) {
            return(
              <tr key={community.id} className='center aligned'>
                <td>{community.id}</td>
                <td>{community.core}</td>
              </tr>
            );
          }
        });
      }

      let hooks;
      if (this.props.hookInfo) {
        hooks = this.props.hookInfo.map((hook) => {
          return(
            <tr key={hook.name} className='center aligned'>
              <td>{hook.name}</td>
              <td>{hook.connectTo.join(', ')}</td>
            </tr>
          );
        });
      }
      const panes = [
        { menuItem: 'Core', render: () => {
            return(
              <Tab.Pane>
                <table className='ui very basic table'>
                  <thead>
                    <tr className='center aligned'>
                      <th className='six wide'>Community</th>
                      <th>Core</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cores}
                  </tbody>
                </table>
              </Tab.Pane>
            );
          },
        },
        { menuItem: 'Hook', render: () => {
            return(
              <Tab.Pane>
                <table className='ui very basic table'>
                  <thead>
                    <tr className='center aligned'>
                      <th>Possible Hook</th>
                      <th>連結商品群</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hooks}
                  </tbody>
                </table>
              </Tab.Pane>
            );
          },
        },
        { menuItem: 'Add-on', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
      ];
      return(
        <Tab panes={panes} />
      );
    };
    if (this.state.visible) {
      return (
        <Message onDismiss={this.handleDismiss}>
          <TabPanel />
        </Message>
      );
    }

    return (
      <p />
    );
  }
}

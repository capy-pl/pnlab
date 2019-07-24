import React, { PureComponent } from 'react';
import { Message, Tab } from 'semantic-ui-react';
import { Community } from '../../PnApp/Model/Report';

interface CharacterMessageProps {
  communitiesInfo?: Community[];
  hookInfo?: {};
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

  public handleDismiss(): void {
    this.setState({ visible: false });
  }

  public render() {
    const TabPanel = () => {
      const cores = this.props.communitiesInfo.map((community) => {
        if (community.core) {
          return(
            <tr key={community.id} className='center aligned'>
              <td>{community.id}</td>
              <td>{community.core}</td>
            </tr>
          );
        }
      });
      const hooks = this.props.hookInfo.map((data) => {
        return(
          <tr key={data} className='center aligned'>
            <td>{data}</td>
          </tr>
        );
      });
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
                      <th>Possible Hooks</th>
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

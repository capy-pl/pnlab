import React, { PureComponent } from 'react';
import { Message, Tab } from 'semantic-ui-react';
import { Community, Hook } from '../../PnApp/model/Report';

interface CharacterMessageProps {
  communitiesInfo?: Community[];
  hookInfo?: Hook[];
  getCurrentContent: (content) => void;
}

interface MessageState {
  visible: boolean;
  content: string;
}

export default class CharacterMessage extends PureComponent<
  CharacterMessageProps,
  MessageState
> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      content: 'character',
    };
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  public async handleDismiss() {
    await this.setState({ visible: false, content: '' });
    this.props.getCurrentContent(this.state.content);
  }

  public render() {
    if (this.state.visible) {
      const TabPanel = () => {
        let cores;
        if (this.props.communitiesInfo) {
          if (this.props.communitiesInfo.length !== 0) {
            cores = this.props.communitiesInfo.map((community) => {
              if (community.core) {
                return (
                  <tr key={community.id} className='center aligned'>
                    <td>{community.id}</td>
                    <td>{community.core}</td>
                  </tr>
                );
              }
            });
          } else {
            cores = (
              <tr className='center aligned'>
                <td />
                <td>There are no cores</td>
              </tr>
            );
          }
        }

        let hooks;
        if (this.props.hookInfo) {
          if (this.props.hookInfo.length !== 0) {
            hooks = this.props.hookInfo.map((hook) => {
              return (
                <tr key={hook.name} className='center aligned'>
                  <td>{hook.name}</td>
                  <td>{hook.connectTo.join(', ')}</td>
                </tr>
              );
            });
          } else {
            hooks = (
              <tr className='center aligned'>
                <td>No possible hooks</td>
              </tr>
            );
          }
        }
        const panes = [
          {
            menuItem: 'Core',
            render: () => {
              return (
                <Tab.Pane>
                  <table className='ui very basic table'>
                    <thead>
                      <tr className='center aligned'>
                        <th className='six wide'>Community</th>
                        <th>Core</th>
                      </tr>
                    </thead>
                    <tbody>{cores}</tbody>
                  </table>
                </Tab.Pane>
              );
            },
          },
          {
            menuItem: 'Hook',
            render: () => {
              return (
                <Tab.Pane>
                  <table className='ui very basic table'>
                    <thead>
                      <tr className='center aligned'>
                        <th>Possible Hook</th>
                        <th>連結商品群</th>
                      </tr>
                    </thead>
                    <tbody>{hooks}</tbody>
                  </table>
                </Tab.Pane>
              );
            },
          },
        ];
        return <Tab panes={panes} />;
      };

      return (
        <Message className='report-message' onDismiss={this.handleDismiss}>
          <TabPanel />
        </Message>
      );
    }

    return <React.Fragment />;
  }
}

import React, { PureComponent } from 'react';
import { Message, Tab } from 'semantic-ui-react';

// import TabPanel from './TabPanel';

interface CharacterMessageProps {
  coreInfo?: {};
  hookInfo?: {};
}

interface MessageState {
  visible: boolean;
  coreInfo?: {};
  hookInfo?: {};
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
    setTimeout(() => {
      this.setState({ visible: true });
    }, 2000);
  }

  public render() {
    const TabPanel = () => {
      const cores = this.props.coreInfo.map((data) => {
        return(
          <tr key={data.community} className='center aligned'>
            <td>{data.community}</td>
            <td>{data.core}</td>
          </tr>
        );
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
        <Message onDismiss={this.handleDismiss} coreInfo={this.props.coreInfo} hookInfo={this.props.hookInfo}>
          <TabPanel />
        </Message>
      );
    }

    return (
      <p>
        <br />
        <i>The message will return in 2s</i>
        <br />
        <br />
      </p>
    );
  }
}

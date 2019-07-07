import React, { PureComponent } from 'react';
import { Message } from 'semantic-ui-react';
import CommunitiesCheckbox from './CommunitiesCheckbox';

// import TabPanel from './TabPanel';

interface CommunitiesMessageProps {
  communitiesInfo: {};
}

interface CommunitiesMessageState {
  visible: boolean;
  content: string;
}

export default class CommunitiesMessage extends PureComponent<CommunitiesMessageProps, CommunitiesMessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      content: 'rank',
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  public handleDismiss(): void {
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ visible: true });
    }, 2000);
  }

  public onClick(): void {
    this.setState({content: 'communityDetail'});
  }

  public render() {
    const communitiesRank = this.props.communitiesInfo.map((community) => {
      return (
        <div key={community.name}>
          <CommunitiesCheckbox communityRank={community.rank} communityName={community.name} onClick={this.onClick}/>
        </div>
      );
    });

    if (this.state.visible) {
      return (
        <Message onDismiss={this.handleDismiss}>
          <h3>Communities排名</h3>
          {communitiesRank}
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

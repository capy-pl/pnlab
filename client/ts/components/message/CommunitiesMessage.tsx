import React, { PureComponent } from 'react';
import { Checkbox, Message, Table, TableBody } from 'semantic-ui-react';
import { Community } from '../../PnApp/Model/Report';
import CommunitiesRankList from './CommunitiesRankList';

// import TabPanel from './TabPanel';

interface CommunitiesMessageProps {
  communitiesInfo: Community[];
}

interface CommunitiesMessageState {
  visible: boolean;
  content: string;
  communities?: [];
}

export default class CommunitiesMessage extends PureComponent<CommunitiesMessageProps, CommunitiesMessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      content: 'rank',
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleCommClick = this.handleCommClick.bind(this);
  }

  public handleDismiss(): void {
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ visible: true });
    }, 2000);
  }

  public handleCommClick(community): void {
    console.log(community.id);
    console.log(community.items);
    this.setState({content: 'communityDetail'});
  }

  public render() {
    if (this.state.visible) {
      return (
        <CommunitiesRankList
          communitiesInfo={this.props.communitiesInfo}
          onDismiss={this.handleDismiss}
          onCommClick={this.handleCommClick}
        />
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

import React, { PureComponent } from 'react';
import { Community } from '../../PnApp/Model/Report';
import CommunitiesRankList from './CommunitiesRankList';
import CommunityDetail from './CommunityDetail';
import SelectedCommunities from './SelectedCommunities';

interface CommunitiesMessageProps {
  communitiesInfo: Community[];
  updateCommunitiesGraph: (communitiesList) => void;
}

interface CommunitiesMessageState {
  visible: boolean;
  content: string;
  clickedCommunity?: number;
  checkedCommunities?: [];
  backTo?: string;
}

export default class CommunitiesMessage extends PureComponent<CommunitiesMessageProps, CommunitiesMessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      content: 'communitiesRank',
      checkedCommunities: [],
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleCommClick = this.handleCommClick.bind(this);
    this.handleCommDetailClick = this.handleCommDetailClick.bind(this);
    this.checkExistance = this.checkExistance.bind(this);
    this.handleCommCheck = this.handleCommCheck.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleBacktoCommunitiesRank = this.handleBacktoCommunitiesRank.bind(this);
    this.handleBacktoSelectedCommunities = this.handleBacktoSelectedCommunities.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
  }

  public handleDismiss(): void {
    this.setState({ visible: false });
  }

  public handleCommClick(community): void {
    console.log(community.id);
    console.log(community.items);
    this.setState({content: 'communityDetail'});
    this.setState({clickedCommunity: community}, () => {
      this.props.updateCommunitiesGraph([this.state.clickedCommunity]);
    });
    this.setState({backTo: 'communitiesRankList'});
  }

  public handleCommDetailClick(community): void {
    console.log(community.id);
    console.log(community.items);
    this.setState({content: 'communityDetail'});
    this.setState({clickedCommunity: community}, () => {
      this.props.updateCommunitiesGraph([this.state.clickedCommunity]);
    });
    this.setState({backTo: 'selectedCommunities'});
  }

  public checkExistance(community) {
    return this.state.checkedCommunities.some((checkedCommunity) => checkedCommunity.id === community.id);
  }

  public handleCommCheck(community) {
    console.log(community.id);
    this.checkExistance(community) ?
      this.setState({checkedCommunities: this.state.checkedCommunities.filter(checkedCommunity => checkedCommunity.id !== community.id)}):
      this.setState({checkedCommunities: [...this.state.checkedCommunities, community]});
  }

  public updateGraph() {
    this.props.updateCommunitiesGraph(this.state.checkedCommunities);
  }

  public handleSend() {
    this.setState({content: 'selectedCommunities'});
    this.updateGraph();
  }

  public handleBacktoCommunitiesRank() {
    this.setState({content: 'communitiesRank'});
    this.setState({checkedCommunities: []}, () => {
      this.updateGraph();
    });
    this.setState({backTo: ''});
  }

  public handleBacktoSelectedCommunities() {
    this.setState({content: 'selectedCommunities'});
    this.setState({backTo: ''});
    this.updateGraph();
  }

  public render() {
    if (this.state.visible) {
      if (this.state.content === 'communitiesRank') {
        return (
          <CommunitiesRankList
            communitiesInfo={this.props.communitiesInfo}
            onDismiss={this.handleDismiss}
            onCommClick={this.handleCommClick}
            onCommCheck={this.handleCommCheck}
            onSend={this.handleSend}
          />
        );
      } else if (this.state.content === 'communityDetail') {
        return (
          <CommunityDetail
            community={this.state.clickedCommunity}
            onDismiss={this.handleDismiss}
            onBacktoCommunitiesRank={this.handleBacktoCommunitiesRank}
            onBacktoSelectedCommunities={this.handleBacktoSelectedCommunities}
            backTo={this.state.backTo}
          />
        );
      } else if (this.state.content === 'selectedCommunities') {
        return (
          <SelectedCommunities
            onDismiss={this.handleDismiss}
            selectedCommunities={this.state.checkedCommunities}
            onCommDetailClick={this.handleCommDetailClick}
            onBacktoCommunitiesRank={this.handleBacktoCommunitiesRank}
          />
        );
      }
    }

    return (
      <p />
    );
  }
}

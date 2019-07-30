import React, { PureComponent } from 'react';
import { Community } from '../../PnApp/model/Report';
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
  clickedCommunity?: Community;
  checkedCommunities?: Community[];
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
    this.handleCommCheck = this.handleCommCheck.bind(this);
    this.goToSelectedCommunities = this.goToSelectedCommunities.bind(this);
    this.handleBacktoCommunitiesRank = this.handleBacktoCommunitiesRank.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.goToCommunityDetail = this.goToCommunityDetail.bind(this);
  }

  public handleDismiss() {
    this.setState({ visible: false });
  }

  public goToCommunityDetail(community: Community) {
    this.setState({content: 'communityDetail'});
    this.setState({clickedCommunity: community}, () => {
      this.props.updateCommunitiesGraph([this.state.clickedCommunity]);
    });
  }

  public handleCommClick(community: Community) {
    this.goToCommunityDetail(community);
    this.setState({backTo: 'communitiesRankList'});
  }

  public handleCommDetailClick(community: Community) {
    this.goToCommunityDetail(community);
    this.setState({backTo: 'selectedCommunities'});
  }

  public handleCommCheck(community: Community) {
    if (this.state.checkedCommunities) {
      this.state.checkedCommunities.some((checkedCommunity) => checkedCommunity.id === community.id) ?
        this.setState({checkedCommunities: [...this.state.checkedCommunities]
          .filter((checkedCommunity) => checkedCommunity.id !== community.id)}) :
        this.setState({checkedCommunities: [...this.state.checkedCommunities, community]});
    } else {
      this.setState({checkedCommunities: [community]});
    }
  }

  public updateGraph() {
    this.props.updateCommunitiesGraph(this.state.checkedCommunities);
  }

  public goToSelectedCommunities() {
    this.setState({content: 'selectedCommunities'});
    this.updateGraph();
    this.setState({backTo: 'communitiesRankList'});
  }

  public handleBacktoCommunitiesRank() {
    this.setState({content: 'communitiesRank'});
    this.setState({checkedCommunities: undefined, clickedCommunity: undefined}, this.updateGraph);
    this.setState({backTo: ''});
  }

  public render() {
    if (this.state.visible) {
      let message;
      switch (this.state.content) {
        case 'communitiesRank':
          message = (
            <CommunitiesRankList
              communitiesInfo={this.props.communitiesInfo}
              onDismiss={this.handleDismiss}
              onCommClick={this.handleCommClick}
              onCommCheck={this.handleCommCheck}
              onSend={this.goToSelectedCommunities}
            />
          );
          break;
        case 'communityDetail':
          message = (
            <CommunityDetail
              community={this.state.clickedCommunity}
              onDismiss={this.handleDismiss}
              onBacktoCommunitiesRank={this.handleBacktoCommunitiesRank}
              onBacktoSelectedCommunities={this.goToSelectedCommunities}
              backTo={this.state.backTo}
            />
          );
          break;
        case 'selectedCommunities':
          message = (
            <SelectedCommunities
              onDismiss={this.handleDismiss}
              selectedCommunities={this.state.checkedCommunities}
              onCommDetailClick={this.handleCommDetailClick}
              onBacktoCommunitiesRank={this.handleBacktoCommunitiesRank}
            />
          );
          break;
        default:
          message = (
            <React.Fragment>
              No Result
            </React.Fragment>
          );
      }
      return (
        message
      );
    }

    return (
      <React.Fragment />
    );
  }
}

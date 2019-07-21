import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import { DropdownMenu } from '../../components/menu';
import { CharacterMessage, CommunitiesMessage, ProductRank } from '../../components/message';
// import CommunitiesMessage from '../../components/message/CommunitiesMessage';
// import ProductRank from '../../components/message/ProductRank';
import ReportAPI from '../../PnApp/Model/Report' ;
interface ReportProps extends RouteComponentProps<{ id: string }> {
}

interface ReportState {
  loading: boolean;
  report?: ReportAPI;
  coreInfo?: {};
  hookInfo?: {};
  productRankInfo?: {};
  showCommunity?: boolean;
  content: string;
  communitiesInfo?: {};
  selectedCommunities?: [];
}

export default class Report extends PureComponent<ReportProps, ReportState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = {
      loading: true,
      showCommunity: false,
      content: '',
    };
    this.onClickP = this.onClickP.bind(this);
    this.onClickC = this.onClickC.bind(this);
    this.onShowCharacter = this.onShowCharacter.bind(this);
    this.onShowProductRank = this.onShowProductRank.bind(this);
    this.onShowCommunities = this.onShowCommunities.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
  }

  public async componentDidMount() {
    const report = await ReportAPI.get(this.props.match.params.id);
    this.setState({
      report,
      loading: false,
      coreInfo: [
        {community: '1', core: 'A'},
        {community: '2', core: 'B'},
      ],
      hookInfo: [
        'milk',
        'egg',
      ],
      productRankInfo: [
        {rank: '1', name: '鮪魚飯糰'},
        {rank: '2', name: '茶葉蛋'},
      ],
      selectedCommunities: [],
    });
  }

  public onClickP() {
    this.setState({showCommunity: false});
    this.setState({content: ''});
    this.setState({selectedCommunities: []});
  }

  public onClickC() {
    this.setState({showCommunity: true});
    this.setState({content: ''});
    this.setState({selectedCommunities: []});

  }

  public onShowCharacter(event) {
    event.stopPropagation();
    this.setState({content: 'character'});
  }

  public onShowProductRank(event) {
    event.stopPropagation();
    this.setState({content: 'productRank'});
  }

  public onShowCommunities(event) {
    event.stopPropagation();
    this.setState({content: 'communities'});
  }

  public updateGraph(communitiesList): void {
    console.log('got', communitiesList);
    this.setState({selectedCommunities: communitiesList});
  }

  public render() {
    let message;

    if (this.state.content === 'character') {
      message =  <CharacterMessage communitiesInfo={this.state.report.communities} hookInfo={this.state.hookInfo} />;
    } else if (this.state.content === 'productRank') {
      message = <ProductRank productRankInfo={this.state.productRankInfo} />;
    } else if (this.state.content === 'communities') {
      message = <CommunitiesMessage communitiesInfo={this.state.report.communities} updateGraph={this.updateGraph} />;
    }
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        return (
          <React.Fragment>
            <DropdownMenu
              reportId={this.state.report.id}
              onClickP={this.onClickP}
              onClickC={this.onClickC}
              onShowCharacter={this.onShowCharacter}
              onShowProductRank={this.onShowProductRank}
              onShowCommunities={this.onShowCommunities}
            />
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100%', position: 'absolute' }}>
                <Graph
                  nodes={this.state.report.nodes}
                  edges={this.state.report.edges}
                  showCommunity={this.state.showCommunity}
                  selectedCommunities={this.state.selectedCommunities}
                />
              </div>
              <div style={{ width: '20%', position: 'absolute' }}>
                {message}
              </div>
            </div>
          </React.Fragment>
        );
      }
    }
  }
}

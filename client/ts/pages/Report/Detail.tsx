import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import DropdownMenu from '../../components/menu/DropdownMenu';
import CharacterMessage from '../../components/message/CharacterMessage';
import ProductRank from '../../components/message/ProductRank';
import ReportAPI from '../../PnApp/Model/Report' ;
interface ReportProps extends RouteComponentProps<{ id: string }> {
}

interface ReportState {
  loading: boolean;
  report?: ReportAPI;
  coreInfo?: {};
  hookInfo?: {};
  productRankInfo?: {};
  comm?: boolean;
  content: string;
  // mode: string;
}

export default class Report extends PureComponent<ReportProps, ReportState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = {
      loading: true,
      comm: false,
      content: '',
      // mode: 'productNetwork',
    };
    this.onClickP = this.onClickP.bind(this);
    this.onClickC = this.onClickC.bind(this);
    this.onShowCharacter = this.onShowCharacter.bind(this);
    this.onShowProductRank = this.onShowProductRank.bind(this);
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
    });
  }

  public onClickP() {
    this.setState({comm: false});
    // this.setState({mode: 'productNetwork'});
    this.setState({content: ''});
  }

  public onClickC() {
    this.setState({comm: true});
    // this.setState({mode: 'communities'});
    this.setState({content: ''});
  }

  public onShowCharacter(event) {
    event.stopPropagation();
    this.setState({content: 'character'});
  }

  public onShowProductRank(event) {
    event.stopPropagation();
    this.setState({content: 'productRank'});
  }

  public render() {
    let message;

    if (this.state.content === 'character') {
      message =  <CharacterMessage coreInfo={this.state.coreInfo} hookInfo={this.state.hookInfo} />;
    }
    if (this.state.content === 'productRank') {
      message = <ProductRank productRankInfo={this.state.productRankInfo} />;
    }
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        return (
          <div>
            <DropdownMenu
              reportId={this.state.report.id}
              onClickP={this.onClickP}
              onClickC={this.onClickC}
              onShowCharacter={this.onShowCharacter}
              onShowProductRank={this.onShowProductRank}
            />
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100%', position: 'absolute' }}>
                <Graph
                  nodes={this.state.report.nodes}
                  edges={this.state.report.edges}
                  comm={this.state.comm}
                />
              </div>
              <div style={{ width: '20%', position: 'absolute' }}>
                {message}
              </div>
            </div>
          </div>
        );
      }
    }
  }
}

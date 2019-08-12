import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Divider, DropdownProps, Label } from 'semantic-ui-react';

import AnalysisAccordion from 'Component/accrodion/AnalysisAccordion';
import { DropdownSearchItem } from 'Component/dropdown';
import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import { CharacterMessage, CommunitiesMessage, ProductRank } from '../../components/message';
import AnalysisAPI from '../../PnApp/model/Analysis';
import ReportAPI, {SimpleNode} from '../../PnApp/model/Report';
import { Community } from '../../PnApp/model/Report';


interface AnalysisProps extends RouteComponentProps<{ id: string }> {
}

interface AnalysisState {
  loading: boolean;
  analysis?: AnalysisAPI;
  report?: ReportAPI;
  visible: boolean;
  showCommunity: boolean;
  content: string;
  communitiesInfo?: Community[];
  selectedCommunities?: Community[];
  selectedProduct?: SimpleNode;
  searchItems?: number[];
}

export default class Analysis extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      visible: true,
      showCommunity: false,
      content: '',
    };
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.load = this.load.bind(this);
    this.onShowProductNetwork = this.onShowProductNetwork.bind(this);
    this.onShowCommunities = this.onShowCommunities.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.onShowProductRank = this.onShowProductRank.bind(this);
    this.getMessageComponent = this.getMessageComponent.bind(this);
    this.getDropdownSearch = this.getDropdownSearch.bind(this);
    this.updateCommunitiesGraph = this.updateCommunitiesGraph.bind(this);
    this.updateProductGraph = this.updateProductGraph.bind(this);
    this.onItemSearch = this.onItemSearch.bind(this);
    this.onShowCommunitiesRank = this.onShowCommunitiesRank.bind(this);
    this.onShowCharacter = this.onShowCharacter.bind(this);
  }

  public async componentDidMount() {
    await this.load();
  }

  public async load() {
    const analysis = await AnalysisAPI.get(this.props.match.params.id);
    const report = await ReportAPI.get(analysis.report);
    this.setState({
      analysis,
      report,
      loading: false,
    });
  }

  public handleToggleSidebar() {
      this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  public clearSelected() {
    this.setState(
      {
        content: '',
        selectedCommunities: undefined,
        selectedProduct: undefined,
      });
  }

  public onShowProductNetwork() {
    this.setState({showCommunity: false});
    this.clearSelected();
  }

  public onShowCommunities() {
    this.setState({showCommunity: true});
    this.clearSelected();
    this.setState({searchItems: undefined});
  }

  public onShowProductRank(event) {
    event.stopPropagation();
    this.setState({content: 'productRank'});
  }

  public getMessageComponent(): React.ReactChild {
    let message: React.ReactChild;
    const report = this.state.report as ReportAPI;
    switch (this.state.content) {
      case 'character':
        message = (
          <CharacterMessage
            communitiesInfo={report.communities}
            hookInfo={report.hooks}
          />
        );
        break;
      case 'productRank':
        message = (
          <ProductRank
            productRankInfo={report.rank}
            updateProductGraph={this.updateProductGraph}
            nodes={report.nodes}
            edges={report.edges}
          />
        );
        break;
      case 'communitiesRank':
        message = (
          <CommunitiesMessage
            communitiesInfo={report.communities}
            updateCommunitiesGraph={this.updateCommunitiesGraph}
          />
        );
        break;
      default:
        return <React.Fragment />;
    }
    return message;
  }

  public getDropdownSearch(): React.ReactChild {
    let searchItemDropdown: React.ReactChild;
    const report = this.state.report as ReportAPI;
    const dropdownOptions = report.nodes.map((node) => {
      return ({
        key: node.name,
        value: node.id,
        text: node.name,
      });
    });
    // if (!this.state.showCommunity) {
    searchItemDropdown = (
      <DropdownSearchItem
        options={dropdownOptions}
        placeholder='搜尋商品：請輸入商品名稱'
        onChange={this.onItemSearch}
      />
    );
    // } else {
    //   return <React.Fragment />;
    // }
    return searchItemDropdown;
  }

  public updateCommunitiesGraph(communitiesList: Community[] | undefined) {
    this.setState({
      selectedCommunities: communitiesList,
      selectedProduct: undefined,
    });
  }

  public updateProductGraph(product: SimpleNode | undefined) {
      if (this.state.report) {
        this.setState({
          selectedProduct: product,
          selectedCommunities: undefined,
        });
      }
  }

  public onItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    this.setState({
      searchItems: data.value as number[],
    });
  }

  public onShowCommunitiesRank(event) {
    event.stopPropagation();
    this.setState({content: 'communitiesRank'});
  }

  public onShowCharacter(event) {
    event.stopPropagation();
    this.setState({content: 'character'});
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        const message: React.ReactChild = this.getMessageComponent();
        const searchItemDropdown: React.ReactChild = this.getDropdownSearch();
        return (
          <React.Fragment>
            <Button
              onClick={this.handleToggleSidebar}
              icon='chevron circle left'
            />
            {message}
              <AnalysisAccordion
                analysis={this.state.analysis}
                report={this.state.report}
                onSave={this.load}
                visible={this.state.visible}
                onShowProductNetwork={this.onShowProductNetwork}
                onShowCommunities={this.onShowCommunities}
                showCommunity={this.state.showCommunity}
                onShowProductRank={this.onShowProductRank}
                onShowCommunitiesRank={this.onShowCommunitiesRank}
                onShowCharacter={this.onShowCharacter}
              />
            <Graph
              nodes={this.state.report.nodes}
              edges={this.state.report.edges}
              showCommunity={this.state.showCommunity}
              selectedCommunities={this.state.selectedCommunities}
              selectedProduct={this.state.selectedProduct}
              searchItems={this.state.searchItems}
            />
          </React.Fragment>
        );
      }
    }
  }
}

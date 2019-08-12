import React, { PureComponent } from 'react';
import { Button, Checkbox, Dropdown, DropdownProps, Grid, Header, Menu } from 'semantic-ui-react';

import { SearchSingleItemDropdown } from '../../components/dropdown';
import { GraphViewCompare } from '../../components/graph2/index';
import Loader from '../../components/Loader';
import ComparePortal from '../../components/portal/index';
import SingleProductComparePortal from '../../components/portal/SingleProductCompare';
import AnalysisAPI from '../../PnApp/model/Analysis' ;
import ReportAPI from '../../PnApp/model/Report';

interface AnalysisProps {
  analysisA: string;
  analysisB: string;
}

interface AnalysisState {
  loading: boolean;
  analysisA?: AnalysisAPI;
  analysisB?: AnalysisAPI;
  reportA?: ReportAPI;
  reportB?: ReportAPI;
  shareNodes?: string[];
  openCompare: boolean;
  openSingleCompare: boolean;
  selectedProduct?: string[];
  showCommunity: boolean;
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      openCompare: false,
      openSingleCompare: false,
      selectedProduct: [],
      showCommunity: false,
    };
    this.handleOpenCompare = this.handleOpenCompare.bind(this);
    this.handleOpenSingleCompare = this.handleOpenSingleCompare.bind(this);
    this.handleCloseCompare = this.handleCloseCompare.bind(this);
    this.handleCloseSingleCompare = this.handleCloseSingleCompare.bind(this);
    this.onSingleItemSearch = this.onSingleItemSearch.bind(this);
    this.toggleShowCommunity = this.toggleShowCommunity.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
  }

  public async componentDidMount() {
    const analysisA = await AnalysisAPI.get(this.props.location.state.analysisA);
    const analysisB = await AnalysisAPI.get(this.props.location.state.analysisB);
    const reportA = await ReportAPI.get(analysisA.report);
    const reportB = await ReportAPI.get(analysisB.report);
    const shareNodes: string[] = [];
    for (const nodeA of reportA.nodes) {
      for (const nodeB of reportB.nodes) {
        if (nodeA.name === nodeB.name) {
          shareNodes.push(nodeA.name);
        }
      }
    }
    this.setState({
      analysisA,
      analysisB,
      reportA,
      reportB,
      shareNodes,
      loading: false,
    });
  }

  public handleCloseCompare() {
    this.setState({ openCompare: false });
  }

  public handleCloseSingleCompare() {
    this.setState({ openSingleCompare: false });
  }

  public handleOpenCompare() {
    this.setState({ openCompare: true });
  }

  public handleOpenSingleCompare() {
    this.setState({ openSingleCompare: true });
  }

  public getAllProducts() {
    if (this.state.reportA && this.state.reportB) {
      const reportANodesNames = this.state.reportA.nodes.map((node) => {
        return node.name;
      });
      const reportBNodesNames = this.state.reportB.nodes.map((node) => {
        return node.name;
      });
      const allProducts = reportANodesNames.concat(reportBNodesNames.filter((node) => {
        return reportANodesNames.indexOf(node) < 0;
      }));
      return allProducts;
    }
    return [];
  }

  public onSingleItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    const allProducts = this.getAllProducts();
    for (const product of allProducts) {
      if (product === data.value) {
        this.setState({selectedProduct: [product]});
      }
    }
    if (!data.value) {
      this.setState({selectedProduct: []});
    }
  }

  public toggleShowCommunity() {
    this.state.showCommunity ? this.setState({showCommunity: false}) : this.setState({showCommunity: true});
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.reportA && this.state.reportB && this.state.analysisA && this.state.analysisB) {
        const allProducts = this.getAllProducts();
        const dropdownOption = allProducts.map((node) => {
          return (
            {
              key: node,
              value: node,
              text: node,
            }
          );
        });
        return (
          <React.Fragment>
            <Button
              color='teal'
              onClick={this.handleOpenCompare}
            >
              比較兩張網路圖
            </Button>
            <div style={{position: 'relative', left: '1rem', zIndex: 1001, display: 'inline'}}>
              <Menu
                compact
              >
                <Dropdown.Item>
                  <Checkbox
                    toggle
                    label={this.state.showCommunity ? '隱藏Community' : '顯示Community'}
                    onChange={this.toggleShowCommunity}
                  />
                </Dropdown.Item>
              </Menu>
            </div>
            <Button
              color='teal'
              onClick={this.handleOpenSingleCompare}
            >
              比較
            </Button>
            <div style={{position: 'fixed', minWidth: '15%', right: 0, zIndex: 1001, display: 'inline'}}>
              <SearchSingleItemDropdown
                options={dropdownOption}
                placeholder='搜尋商品連結'
                onChange={this.onSingleItemSearch}
              />
            </div>
            <Grid columns='two' divided>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h3' dividing textAlign='left'>
                    {this.state.analysisA.title}
                  </Header>
                  <GraphViewCompare
                    nodes={this.state.reportA.nodes}
                    edges={this.state.reportA.edges}
                    selectedProduct={this.state.selectedProduct}
                    showCommunity={this.state.showCommunity}
                    shareNodes={this.state.shareNodes}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Header as='h3' dividing textAlign='left'>
                    {this.state.analysisB.title}
                  </Header>
                  <GraphViewCompare
                    nodes={this.state.reportB.nodes}
                    edges={this.state.reportB.edges}
                    selectedProduct={this.state.selectedProduct}
                    showCommunity={this.state.showCommunity}
                    shareNodes={this.state.shareNodes}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <ComparePortal
              open={this.state.openCompare}
              reportA={this.state.reportA}
              reportB={this.state.reportB}
              shareNodes={this.state.shareNodes}
              onClose={this.handleCloseCompare}
              analysisA={this.state.analysisA}
              analysisB={this.state.analysisB}
            />
            <SingleProductComparePortal
              open={this.state.openSingleCompare}
              reportA={this.state.reportA}
              reportB={this.state.reportB}
              onClose={this.handleCloseSingleCompare}
              selectedProduct={this.state.selectedProduct}
            />
          </React.Fragment>
        );
      }
    }
  }
}

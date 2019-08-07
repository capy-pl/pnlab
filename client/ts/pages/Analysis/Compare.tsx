import React, { PureComponent } from 'react';
import { Button, Checkbox, Divider, Dropdown, DropdownProps, Grid, Header, Menu } from 'semantic-ui-react';

import { SearchSingleItemDropdown } from '../../components/dropdown';
import { GraphView2 } from '../../components/graph2/index';
import Loader from '../../components/Loader';
import ComparePortal from '../../components/portal/index';
import AnalysisAPI from '../../PnApp/model/Analysis' ;
import ReportAPI, { Node } from '../../PnApp/model/Report';

interface AnalysisProps {
  analysisA?: string;
  analysisB?: string;
}

interface AnalysisState {
  loading: boolean;
  analysisA?: AnalysisAPI;
  analysisB?: AnalysisAPI;
  reportA?: ReportAPI;
  reportB?: ReportAPI;
  nodesA?: Node[];
  nodesB?: Node[];
  shareNodes?: Node[];
  open: boolean;
  searchItems?: DropdownProps['value'];
  selectedProduct?: string[];
  showCommunity: boolean;
  allProducts?: string[];
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      open: false,
      searchItems: [],
      selectedProduct: [],
      showCommunity: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onSingleItemSearch = this.onSingleItemSearch.bind(this);
    this.toggleShowCommunity = this.toggleShowCommunity.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
  }

  public async componentDidMount() {
    const analysisA = await AnalysisAPI.get(this.props.location.state.analysisA);
    const analysisB = await AnalysisAPI.get(this.props.location.state.analysisB);
    const reportA = await ReportAPI.get(analysisA.report);
    const reportB = await ReportAPI.get(analysisB.report);
    const nodesA = reportA.nodes.map((node) => {
      return node;
    });
    nodesA.sort((a, b) => {
      return b.weight - a.weight;
    });
    const nodesB = reportB.nodes.map((node) => {
      return node;
    });
    nodesB.sort((a, b) => {
      return b.weight - a.weight;
    });
    const shareNodes: Node[] = [];
    for (const nodeA of nodesA) {
      for (const nodeB of nodesB) {
        if (nodeA.name === nodeB.name) {
          shareNodes.push(nodeA);
        }
      }
    }
    const allProducts = this.getAllProducts(reportA, reportB);
    this.setState({
      analysisA,
      analysisB,
      reportA,
      reportB,
      nodesA,
      nodesB,
      shareNodes,
      loading: false,
      allProducts,
    });
  }

  public handleClose() {
    this.setState({ open: false });
  }

  public handleOpen() {
    this.setState({ open: true });
  }

  public getAllProducts(reportA, reportB) {
    const reportANodesNames = reportA.nodes.map((node) => {
      return node.name;
    });
    const reportBNodesNames = reportB.nodes.map((node) => {
      return node.name;
    });
    const allProducts = reportANodesNames.concat(reportBNodesNames.filter((node) => {
      return reportANodesNames.indexOf(node) < 0;
    }));
    return allProducts;
  }

  public onSingleItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    if (this.state.allProducts) {
      for (const product of this.state.allProducts) {
        if (product === data.value) {
          this.setState({selectedProduct: [product]});
        }
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
              onClick={this.handleOpen}
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
            <div style={{position: 'fixed', minWidth: '15%', right: 0, zIndex: 1001, display: 'inline'}}>
              <SearchSingleItemDropdown
                options={dropdownOption}
                placeholder='搜尋共同商品'
                onChange={this.onSingleItemSearch}
              />
            </div>
            <Grid columns='two' divided>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h3' dividing textAlign='left'>
                    {this.state.analysisA.title}
                  </Header>
                  <GraphView2
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
                  <GraphView2
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
              open={this.state.open}
              nodesA={this.state.nodesA}
              nodesB={this.state.nodesB}
              shareNodes={this.state.shareNodes}
              onClose={this.handleClose}
            />
          </React.Fragment>
        );
      }
    }
  }
}

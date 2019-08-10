import React, { PureComponent } from 'react';
import { Button, Divider, DropdownProps } from 'semantic-ui-react';

import { SearchItemDropdown, SearchSingleItemDropdown } from '../../components/dropdown';
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
  selectedProduct?: Node[];
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      open: false,
      searchItems: [],
      selectedProduct: [],
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onItemSearch = this.onItemSearch.bind(this);
    this.onSingleItemSearch = this.onSingleItemSearch.bind(this);
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
    this.setState({
      analysisA,
      analysisB,
      reportA,
      reportB,
      nodesA,
      nodesB,
      shareNodes,
      loading: false,
    });
  }

  public handleClose() {
    this.setState({ open: false });
  }

  public handleOpen() {
    this.setState({ open: true });
  }

  public onItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    this.setState({searchItems: data.value});
  }

  public onSingleItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    for (const node of this.state.shareNodes) {
      if (node.name === data.value) {
        console.log(node.name);
        this.setState({selectedProduct: [node]});
      }
    }
    if (!data.value) {
      this.setState({selectedProduct: []});
    }
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.shareNodes) {
        const dropdownOption = this.state.shareNodes.map((node) => {
          return (
            {
              key: node.name,
              value: node.name,
              text: node.name,
            }
          );
        });
        return (
          <React.Fragment>
            <div style={{position: 'absolute', minWidth: '20%', zIndex: 1001}}>
              <SearchItemDropdown
                options={dropdownOption}
                placeholder='搜尋共同商品'
                onChange={this.onItemSearch}
              />
            </div>
            <div style={{position: 'absolute', right: 0, minWidth: '20%', zIndex: 1001}}>
              <SearchSingleItemDropdown
                options={dropdownOption}
                placeholder='搜尋共同商品'
                onChange={this.onSingleItemSearch}
              />
            </div>
            <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
              <div>
                <GraphView2
                  nodes={this.state.reportA.nodes}
                  edges={this.state.reportA.edges}
                  searchItems={this.state.searchItems}
                  selectedProduct={this.state.selectedProduct}
                />
              </div>
              <Divider vertical>
                <Button onClick={this.handleOpen}>
                  A vs B
                </Button>
              </Divider>
              <div>
                <GraphView2
                  nodes={this.state.reportB.nodes}
                  edges={this.state.reportB.edges}
                  searchItems={this.state.searchItems}
                  selectedProduct={this.state.selectedProduct}
                />
              </div>
            </div>
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

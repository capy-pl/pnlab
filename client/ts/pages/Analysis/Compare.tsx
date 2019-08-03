import React, { PureComponent } from 'react';
import { Button, Divider, DropdownProps } from 'semantic-ui-react';

import { SearchItemDropdown } from '../../components/dropdown';
import Graph2 from '../../components/graph2/index';
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
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onItemSearch = this.onItemSearch.bind(this);
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
            <SearchItemDropdown options={dropdownOption} placeholder='搜尋共同商品' onChange={this.onItemSearch}/>
            <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
              <div>
                <Graph2
                  nodes={this.state.reportA.nodes}
                  edges={this.state.reportA.edges}
                  searchItems={this.state.searchItems}
                />
              </div>
              <Divider vertical>
                <Button onClick={this.handleOpen}>
                  A vs B
                </Button>
              </Divider>
              <div>
                <Graph2
                  nodes={this.state.reportB.nodes}
                  edges={this.state.reportB.edges}
                  searchItems={this.state.searchItems}
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

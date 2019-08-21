import React, { PureComponent } from 'react';
import {
  Button,
  DropdownProps,
  Grid,
  Header,
  Menu,
  Popup,
} from 'semantic-ui-react';

import { DropdownSearchSingleItem } from '../../../components/dropdown';
import { GraphViewCompare } from '../../../components/graph/CompareGraph';
import Loader from '../../../components/Loader';
import CompareReportWindow from './CompareReportWindow';
import CompareSingleProductWindow from './CompareSingleProductWindow';
import AnalysisAPI from '../../../PnApp/model/Analysis';
import ReportAPI, { Condition } from '../../../PnApp/model/Report';

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
  conditions?: Condition[];
  selectedProduct?: string[];
  windowCompareReport: boolean;
  windowSingleProductCompare: boolean;
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      windowCompareReport: false,
      windowSingleProductCompare: false,
    };
    this.onSingleItemSearch = this.onSingleItemSearch.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.openCompareReportWindow = this.openCompareReportWindow.bind(this);
    this.closeCompareReportWindow = this.closeCompareReportWindow.bind(this);
    this.openSingleProductCompareWindow = this.openSingleProductCompareWindow.bind(this);
    this.closeSingleProductCompareWindow = this.closeSingleProductCompareWindow.bind(this);
  }

  public async componentDidMount() {
    const analysisA = await AnalysisAPI.get(this.props.location.state.analysisA);
    const analysisB = await AnalysisAPI.get(this.props.location.state.analysisB);
    const reportA = await ReportAPI.get(analysisA.report);
    const reportB = await ReportAPI.get(analysisB.report);
    const conditions = await ReportAPI.getConditions();
    const nodesSet = new Set<string>();
    reportA.nodes.forEach((node) => {
      nodesSet.add(node.name);
    })
    const shareNodes = reportB.nodes.filter(node => nodesSet.has(node.name)).map((node) => node.name);
    this.setState({
      analysisA,
      analysisB,
      reportA,
      reportB,
      shareNodes,
      conditions,
      loading: false,
    });
  }

  public getAllProducts(): string[] {
    if (this.state.reportA && this.state.reportB) {
      const nodesSet = new Set<string>();
      this.state.reportA.nodes.forEach((node) => {
        nodesSet.add(node.name);
      });
      this.state.reportB.nodes.forEach((node) => {
        nodesSet.add(node.name);
      });

      const allProducts = Array.from(nodesSet)
      return allProducts;
    }
    return [];
  }

  public openCompareReportWindow() {
    this.setState({ windowCompareReport: true });
  }

  public closeCompareReportWindow() {
    this.setState({ windowCompareReport: false });
  }

  public openSingleProductCompareWindow() {
    this.setState({ windowSingleProductCompare: true });
  }

  public closeSingleProductCompareWindow() {
    this.setState({ windowSingleProductCompare: false });
  }

  public onSingleItemSearch(
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) {
    if (!data.value) {
      this.setState({ selectedProduct: undefined });
    }
    const allProducts = this.getAllProducts();
    for (const product of allProducts) {
      if (product === data.value) {
        return this.setState({ selectedProduct: [product] });
      }
    }
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (
        this.state.reportA &&
        this.state.reportB &&
        this.state.analysisA &&
        this.state.analysisB
      ) {
        const allProducts = this.getAllProducts();
        const dropdownOption = allProducts.map((productName) => {
          return {
            key: productName,
            value: productName,
            text: productName,
          };
        });
        const singleItemCompareButton = this.state.selectedProduct ? (
          <Button fluid onClick={this.openSingleProductCompareWindow}>
            產品連結比較表
          </Button>
        ) : (
            <Popup
              content='請先從左方框選擇產品'
              trigger={
                <span>
                  <Button fluid onClick={this.openSingleProductCompareWindow} disabled>
                    產品連結比較表
                </Button>
                </span>
              }
            />
          );
        return (
          <React.Fragment>
            <Menu style={{ marginBottom: '1rem' }} secondary>
              <Menu.Item onClick={this.openCompareReportWindow}>
                <Button color='facebook'>
                  比較兩張網路圖
                </Button>
              </Menu.Item>
              <Menu.Item position='right' style={{ paddingTop: '0.1em', paddingBottom: '0.1em' }}>
                <span style={{ minWidth: '280px' }}>
                  <DropdownSearchSingleItem
                    options={dropdownOption}
                    placeholder='搜尋單一產品連結'
                    onChange={this.onSingleItemSearch}
                  />
                </span>
                &nbsp;&nbsp;&nbsp;
                {singleItemCompareButton}
              </Menu.Item>
            </Menu>
            <div style={{ padding: '1rem' }}>
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
                      shareNodes={this.state.shareNodes}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <CompareReportWindow
                show={this.state.windowCompareReport}
                reportA={this.state.reportA}
                reportB={this.state.reportB}
                shareNodes={this.state.shareNodes}
                onClose={this.closeCompareReportWindow}
                analysisA={this.state.analysisA}
                analysisB={this.state.analysisB}
                conditions={this.state.conditions}
              />
              <CompareSingleProductWindow
                show={this.state.windowSingleProductCompare}
                reportA={this.state.reportA}
                reportB={this.state.reportB}
                onClose={this.closeSingleProductCompareWindow}
                selectedProduct={this.state.selectedProduct}
              />
            </div>
          </React.Fragment>
        );
      }
    }
  }
}

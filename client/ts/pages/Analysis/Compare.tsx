import React, { PureComponent } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownProps,
  Grid,
  Header,
  Menu,
  Popup,
} from 'semantic-ui-react';

import { SearchSingleItemDropdown } from '../../components/dropdown';
import { GraphViewCompare } from '../../components/graph2/index';
import Loader from '../../components/Loader';
import ComparePortal from '../../components/portal/index';
import CompareReportWindow from '../../components/portal/CompareReportWindow';
import SingleProductCompareWindow from '../../components/portal/SingleProductCompareWindow';
import SingleProductComparePortal from '../../components/portal/SingleProductCompare';
import AnalysisAPI from '../../PnApp/model/Analysis';
import ReportAPI, { Condition } from '../../PnApp/model/Report';

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
  openCompare: boolean;
  openSingleCompare: boolean;
  selectedProduct?: string[];
  showCommunity: boolean;
  windowCompareReport: boolean;
  windowSingleProductCompare: boolean;
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      openCompare: false,
      openSingleCompare: false,
      showCommunity: false,
      windowCompareReport: false,
      windowSingleProductCompare: false,
    };
    this.handleOpenCompare = this.handleOpenCompare.bind(this);
    this.handleOpenSingleCompare = this.handleOpenSingleCompare.bind(this);
    this.handleCloseCompare = this.handleCloseCompare.bind(this);
    this.handleCloseSingleCompare = this.handleCloseSingleCompare.bind(this);
    this.onSingleItemSearch = this.onSingleItemSearch.bind(this);
    this.toggleShowCommunity = this.toggleShowCommunity.bind(this);
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
      conditions,
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

  public getAllProducts(): string[] {
    if (this.state.reportA && this.state.reportB) {
      const reportANodesNames = this.state.reportA.nodes.map((node) => {
        return node.name;
      });
      const reportBNodesNames = this.state.reportB.nodes.map((node) => {
        return node.name;
      });
      const allProducts: string[] = reportANodesNames.concat(
        reportBNodesNames.filter((node) => {
          return reportANodesNames.indexOf(node) < 0;
        }),
      );
      return allProducts;
    }
    return [];
  }

  public onSingleItemSearch(
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) {
    const allProducts = this.getAllProducts();
    for (const product of allProducts) {
      if (product === data.value) {
        this.setState({ selectedProduct: [product] });
      }
    }
    if (!data.value) {
      this.setState({ selectedProduct: undefined });
    }
  }

  public toggleShowCommunity() {
    this.state.showCommunity
      ? this.setState({ showCommunity: false })
      : this.setState({ showCommunity: true });
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
            {/* <Button color='teal' onClick={this.openCompareReportWindow}>
              比較兩張網路圖
            </Button> */}
            {/* <div
              style={{
                position: 'relative',
                left: '1rem',
                display: 'inline',
              }}
            > */}
            <Menu style={{ marginBottom: '1rem' }}>
              <Menu.Item>
                <Checkbox
                  toggle
                  label={this.state.showCommunity ? '隱藏Community' : '顯示Community'}
                  onChange={this.toggleShowCommunity}
                />
              </Menu.Item>
              <Menu.Item onClick={this.openCompareReportWindow}>
                比較兩張網路圖
              </Menu.Item>
              <Menu.Item position='right' style={{ paddingTop: '0.1em', paddingBottom: '0.1em' }}>
                <span style={{ minWidth: '280px' }}>
                  <SearchSingleItemDropdown
                    options={dropdownOption}
                    placeholder='搜尋單一產品連結'
                    onChange={this.onSingleItemSearch}
                  />
                </span>
                &nbsp;&nbsp;&nbsp;
                {singleItemCompareButton}
              </Menu.Item>
            </Menu>
            {/* </div> */}
            {/* <div
              style={{
                position: 'fixed',
                minWidth: '15%',
                right: 170,
                zIndex: 1,
                display: 'inline',
              }}
            >
              <SearchSingleItemDropdown
                options={dropdownOption}
                placeholder='搜尋單一產品連結'
                onChange={this.onSingleItemSearch}
              />
            </div>
            <div
              style={{ position: 'fixed', right: 10, display: 'inline' }}
            >
              {singleItemCompareButton}
            </div> */}
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
              <SingleProductCompareWindow
                show={this.state.windowSingleProductCompare}
                reportA={this.state.reportA}
                reportB={this.state.reportB}
                onClose={this.closeSingleProductCompareWindow}
                selectedProduct={this.state.selectedProduct}
              />
              {/* <ComparePortal
                open={this.state.openCompare}
                reportA={this.state.reportA}
                reportB={this.state.reportB}
                shareNodes={this.state.shareNodes}
                onClose={this.handleCloseCompare}
                analysisA={this.state.analysisA}
                analysisB={this.state.analysisB}
              /> */}
              {/* <SingleProductComparePortal
                open={this.state.openSingleCompare}
                reportA={this.state.reportA}
                reportB={this.state.reportB}
                onClose={this.handleCloseSingleCompare}
                selectedProduct={this.state.selectedProduct}
              /> */}
            </div>
          </React.Fragment>
        );
      }
    }
  }
}

import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Accordion,
  AccordionTitleProps,
  Button,
  Checkbox,
  DropdownProps,
  Icon,
  Menu,
  Popup,
  Header,
  Sidebar,
  Table,
} from 'semantic-ui-react';

import Loader from '../../../components/Loader';
import {
  CommunityCharacterWindow,
  CommunityListWindow,
  ProductRankWindow,
  SearchItemWindow,
} from 'Component/window';
import AnalysisInfoWindow from './AnalysisInfoWindow';
import { DropdownSearchSingleItem } from '../../../components/dropdown';
import ReportAPI from '../../../PnApp/model/Report';
import Analysis, { Comment } from '../../../PnApp/model/Analysis';

import { simplifyDate } from '../../../PnApp/Helper';

type SelectedProductDisplayMode = 'direct' | 'indirect';

interface State {
  loading: boolean;
  windowProductRank: boolean;
  windowCommunityList: boolean;
  windowCommunityCharacter: boolean;
  windowAnalysisInfo: boolean;
  analysis?: Analysis;
  title?: string;
  report?: ReportAPI;
  showCommunity: boolean;
  selectedCommunities: number[];
  selectedProduct?: number;
  selectedProductMode?: SelectedProductDisplayMode;
  sidebarVisible: boolean;
  activeIndex: number;
  infoOpen: boolean;
  comments: Comment[];
  searchItem?: number;
  windowSearchItemProduct: boolean;
}

const Graph = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "graph" */
    '../../../components/graph'
  ),
);

export default class Detail extends PureComponent<
  RouteComponentProps<{ id: string }>,
  State
> {
  constructor(props: RouteComponentProps<{ id: string }>) {
    super(props);
    this.state = {
      loading: true,
      windowProductRank: false,
      windowCommunityList: false,
      windowCommunityCharacter: false,
      showCommunity: false,
      windowAnalysisInfo: false,
      sidebarVisible: false,
      selectedCommunities: [],
      activeIndex: -1,
      infoOpen: true,
      comments: [],
      windowSearchItemProduct: false,
    };
  }

  public async componentDidMount() {
    const analysis = await Analysis.get(this.props.match.params.id);
    await analysis.loadReport();
    this.setState({
      title: analysis.title,
      analysis: analysis,
      report: analysis.report as ReportAPI,
      comments: [...analysis.comments],
      loading: false,
    });
  }

  public onSaved = () => {
    const { analysis } = this.state;
    this.setState({
      title: (analysis as Analysis).title,
      analysis,
      comments: [...(analysis as Analysis).comments],
    });
  };

  public handleAccordionIndexChange = (e: any, data: AccordionTitleProps) => {
    const { index } = data;
    this.setState({
      activeIndex: this.state.activeIndex === index ? -1 : (index as number),
    });
  };

  public handleInfoIndexChange = () => {
    this.setState({
      infoOpen: !this.state.infoOpen,
    });
  };

  public toggleShowCommunities = () => {
    this.setState({
      showCommunity: !this.state.showCommunity,
      selectedCommunities: [],
      windowCommunityList: false,
      windowCommunityCharacter: false,
    });
  };

  public openCommunityCharacterWindow = () => {
    this.setState({
      windowCommunityCharacter: true,
    });
  };

  public closeCommunityCharacterWindow = () => {
    this.setState({
      windowCommunityCharacter: false,
    });
  };

  public openProductRankWindow = () => {
    this.setState({
      windowProductRank: true,
    });
  };

  public closeProductRankWindow = () => {
    this.setState({
      windowProductRank: false,
    });
  };

  public openCommunityListWidow = () => {
    this.setState({
      windowCommunityList: true,
    });
  };

  public closeCommunityListWindow = () => {
    this.setState({
      windowCommunityList: false,
    });
  };

  public selectProduct = (id?: number, direct?: boolean) => {
    if (this.state.report && typeof direct === 'boolean') {
      this.setState({
        selectedProduct: id,
        selectedProductMode: direct ? 'direct' : 'indirect',
        selectedCommunities: [],
        searchItem: undefined,
      });
    }
  };

  public selectCommunities = (id: number) => {
    if (this.state.selectedCommunities.includes(id)) {
      this.setState({
        selectedProduct: undefined,
        selectedProductMode: undefined,
        searchItem: undefined,
        selectedCommunities: this.state.selectedCommunities.filter((num) => num !== id),
      });
    } else {
      this.setState({
        selectedProduct: undefined,
        selectedProductMode: undefined,
        searchItem: undefined,
        selectedCommunities: [...this.state.selectedCommunities, id],
      });
    }
  };

  public handleItemSearch = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => {
    if (typeof data.value === 'number') {
      this.setState({
        searchItem: data.value,
        windowSearchItemProduct: true,
        selectedProduct: undefined,
        selectedCommunities: [],
      });
    } else {
      this.setState({
        searchItem: undefined,
        windowSearchItemProduct: false,
      });
    }
  };

  public toggleSidebar = () => {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
    });
  };

  public getConditions() {
    if (this.state.report) {
      return this.state.report.conditions.map((condition) => {
        if (
          condition.type === 'string' ||
          condition.type === 'promotion' ||
          condition.type === 'method'
        ) {
          return (
            <Table.Row key={condition.name}>
              <Table.Cell width='6'>{condition.name}</Table.Cell>
              <Table.Cell width='10'>
                {(condition.values as string[]).join(', ')}
              </Table.Cell>
            </Table.Row>
          );
        }
        if (condition.type === 'date') {
          return (
            <Table.Row key={condition.name}>
              <Table.Cell>{condition.name}</Table.Cell>
              <Table.Cell>
                {simplifyDate(condition.values[0])} - {simplifyDate(condition.values[1])}
              </Table.Cell>
            </Table.Row>
          );
        }
      });
    }
  }

  public openAnalysisInfoWindow = () => {
    this.setState({ windowAnalysisInfo: true });
  };

  public closeAnalysisInfoWindow = () => {
    this.setState({ windowAnalysisInfo: false });
  };

  public getDropdownOption = () => {
    const dropdownOption = this.state.report.nodes.map((node) => {
      return {
        key: node.name,
        value: node.id,
        text: node.name,
      };
    });
    return dropdownOption;
  };

  public clearSelectedProduct = () => {
    this.setState({
      selectedProduct: undefined,
      selectedProductMode: undefined,
    });
  };

  public closeSearchItemProductWindow = () => {
    this.setState({ windowSearchItemProduct: false });
  };

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        const dropdownOption = this.getDropdownOption();
        return (
          <React.Fragment>
            <CommunityCharacterWindow
              report={this.state.report}
              show={this.state.windowCommunityCharacter}
              close={this.closeCommunityCharacterWindow}
            />
            <CommunityListWindow
              communities={this.state.report.communities}
              show={this.state.windowCommunityList}
              close={this.closeCommunityListWindow}
              selectCommunity={this.selectCommunities}
              selectedCommunities={this.state.selectedCommunities}
              report={this.state.report}
            />
            <ProductRankWindow
              model={this.state.report}
              selectedProduct={this.state.selectedProduct}
              selectProduct={this.selectProduct}
              productList={this.state.report.rank}
              selectedProductMode={this.state.selectedProductMode}
              show={this.state.windowProductRank}
              close={this.closeProductRankWindow}
              back={this.clearSelectedProduct}
            />
            <SearchItemWindow
              model={this.state.report}
              searchItem={this.state.searchItem}
              selectProduct={this.selectProduct}
              show={this.state.windowSearchItemProduct}
              close={this.closeSearchItemProductWindow}
            />
            <AnalysisInfoWindow
              onSave={this.onSaved}
              show={this.state.windowAnalysisInfo}
              close={this.closeAnalysisInfoWindow}
              model={this.state.analysis as Analysis}
              comments={this.state.comments}
            />
            <Sidebar.Pushable>
              <Sidebar
                width='wide'
                animation='push'
                direction='left'
                visible={this.state.sidebarVisible}
              >
                <Accordion
                  vertical
                  as={Menu}
                  fluid
                  style={{
                    height: '100%',
                    overflowY: 'scroll',
                    paddingBottom: '3rem',
                  }}
                >
                  <Menu.Item>
                    <div style={{ textAlign: 'right' }}>
                      <Icon link name='x' onClick={this.toggleSidebar} />
                    </div>
                  </Menu.Item>
                  <Menu.Item as='a' onClick={this.openAnalysisInfoWindow}>
                    <Header>
                      {this.state.title as string}
                      <Header.Subheader>點擊查看詳細資訊</Header.Subheader>
                    </Header>
                  </Menu.Item>
                  <Menu.Item>
                    <Accordion.Title
                      active={this.state.infoOpen}
                      onClick={this.handleInfoIndexChange}
                    >
                      顯示篩選條件
                      <Icon name='dropdown' />
                    </Accordion.Title>
                    <Accordion.Content active={this.state.infoOpen}>
                      <Table definition style={{ marginTop: '2vh' }}>
                        <Table.Body>{this.getConditions()}</Table.Body>
                      </Table>
                    </Accordion.Content>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownSearchSingleItem
                      options={dropdownOption}
                      placeholder='搜尋產品'
                      onChange={this.handleItemSearch}
                    />
                  </Menu.Item>
                  <Menu.Item>
                    <Checkbox
                      style={{ color: 'white' }}
                      label={this.state.showCommunity ? '隱藏Community' : '標示Community'}
                      toggle
                      onChange={this.toggleShowCommunities}
                    />
                  </Menu.Item>
                  <Menu.Item as='a' onClick={this.openProductRankWindow}>
                    產品排名
                  </Menu.Item>
                  <Menu.Item>
                    <Accordion.Title
                      onClick={this.handleAccordionIndexChange}
                      index={2}
                      active={this.state.activeIndex === 2}
                    >
                      產品Community列表
                      <Icon name='dropdown' />
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 2}>
                      <Popup
                        content='點擊上方"標示community"後即可查看'
                        disabled={this.state.showCommunity}
                        trigger={
                          <Menu.Item
                            onClick={this.openCommunityListWidow}
                            disabled={!this.state.showCommunity}
                          >
                            Communities排名
                          </Menu.Item>
                        }
                      ></Popup>
                      <Popup
                        content='點擊上方"標示community"後即可查看'
                        disabled={this.state.showCommunity}
                        trigger={
                          <Menu.Item
                            onClick={this.openCommunityCharacterWindow}
                            disabled={!this.state.showCommunity}
                          >
                            Communities角色
                          </Menu.Item>
                        }
                      ></Popup>
                    </Accordion.Content>
                  </Menu.Item>
                </Accordion>
              </Sidebar>
              <Sidebar.Pusher>
                <Button
                  attached='right'
                  color='grey'
                  icon='bars'
                  style={{
                    display: this.state.sidebarVisible ? 'none' : 'inline-block',
                    position: 'absolute',
                    zIndex: '1',
                  }}
                  onClick={this.toggleSidebar}
                />
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Graph
                    nodes={this.state.report.nodes}
                    edges={this.state.report.edges}
                    showCommunity={this.state.showCommunity}
                    selectedCommunities={this.state.selectedCommunities}
                    selectedProduct={this.state.selectedProduct}
                    selectedProductMode={this.state.selectedProductMode}
                    searchItem={this.state.searchItem}
                  />
                </React.Suspense>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </React.Fragment>
        );
      }
    }
  }
}

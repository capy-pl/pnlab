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
  Sidebar,
  Table,
  Message,
  Container,
} from 'semantic-ui-react';
import { isBoolean, isNumber } from 'lodash';

import { ModalAddAnalysis } from 'Component/modal';
import { DropdownSearchSingleItem } from '../../../components/dropdown';
import Loader from '../../../components/Loader';
import {
  CommunityCharacterWindow,
  CommunityListWindow,
  ProductRankWindow,
  SearchItemWindow,
} from 'Component/window';

import ReportAPI from '../../../PnApp/model/Report';
import { simplifyDate } from '../../../PnApp/Helper';

type SelectedProductDisplayMode = 'direct' | 'indirect';

interface ReportState {
  loading: boolean;
  windowProductRank: boolean;
  windowCommunityList: boolean;
  windowCommunityCharacter: boolean;
  report?: ReportAPI;
  showCommunity: boolean;
  selectedCommunities: number[];
  selectedProduct?: number;
  selectedProductMode?: SelectedProductDisplayMode;
  addAnalysisModalOpen: boolean;
  sidebarVisible: boolean;
  searchItem?: number;
  activeIndex: number;
  infoOpen: boolean;
  windowSearchItemProduct: boolean;
}

const Graph = React.lazy(() =>
  import(/* webpackChunkName: "graph" */ '../../../components/graph'),
);

export default class Report extends PureComponent<
  RouteComponentProps<{ id: string }>,
  ReportState
> {
  constructor(props: RouteComponentProps<{ id: string }>) {
    super(props);
    this.state = {
      loading: true,
      windowProductRank: false,
      windowCommunityList: false,
      windowCommunityCharacter: false,
      showCommunity: false,
      addAnalysisModalOpen: false,
      sidebarVisible: false,
      selectedCommunities: [],
      activeIndex: -1,
      infoOpen: true,
      windowSearchItemProduct: false,
    };
  }

  public async componentDidMount() {
    const report = await ReportAPI.get(this.props.match.params.id);
    this.setState({
      report,
      loading: false,
    });
  }

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
    if (this.state.report && isBoolean(direct)) {
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
    if (isNumber(data.value)) {
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
              <Table.Cell>{condition.name}</Table.Cell>
              <Table.Cell>{(condition.values as string[]).join(', ')}</Table.Cell>
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

  public openAddAnalysisModal = () => {
    this.setState({
      addAnalysisModalOpen: true,
    });
  };

  public closeAddAnalysisModal = () => {
    this.setState({
      addAnalysisModalOpen: false,
    });
  };

  public addAnalysisSuccess = (id: string) => {
    this.props.history.push(`/analysis/${id}`);
  };

  public backToPreviousPage = () => {
    this.props.history.push(`/report`);
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
    } else if (this.state.report && this.state.report.status === 'error') {
      return (
        <Container>
          <Message
            icon='exclamation'
            header='錯誤訊息'
            content={this.state.report.errMessage}
            error
          />
          <Button
            labelPosition='left'
            icon
            color='blue'
            onClick={this.backToPreviousPage}
          >
            <Icon name='arrow left'></Icon>
            返回上一頁
          </Button>
        </Container>
      );
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
                  style={{ height: '100%', overflowY: 'scroll', paddingBottom: '3rem' }}
                >
                  <Menu.Item>
                    <div style={{ textAlign: 'right' }}>
                      <Icon link name='x' onClick={this.toggleSidebar} />
                    </div>
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
                      disabled={!this.state.showCommunity}
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
                  <ModalAddAnalysis
                    report={this.state.report}
                    close={this.closeAddAnalysisModal}
                    onSuccess={this.addAnalysisSuccess}
                    show={this.state.addAnalysisModalOpen}
                  />
                  <Button
                    fluid
                    color='facebook'
                    onClick={this.openAddAnalysisModal}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                    }}
                  >
                    另存圖片
                  </Button>
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

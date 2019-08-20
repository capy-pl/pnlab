import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Accordion,
  AccordionTitleProps,
  Button,
  Checkbox,
  Header,
  Icon,
  List,
  Menu,
  Search,
  Sidebar,
  SearchResultData,
  SearchProps,
} from 'semantic-ui-react';
import { debounce } from 'lodash';

import { ModalAddAnalysis } from 'Component/modal';
import Graph from '../../../components/graph';
import Loader from '../../../components/Loader';
import CommunityCharacterWindow from './CommunityCharacterWindow';
import CommunityListWindow from './CommunityListWindow';
import ProductRankWindow from './ProductRankWindow';

import ReportAPI, { Node } from '../../../PnApp/model/Report';
import { simplifyDate } from '../../../PnApp/Helper';

interface ReportState {
  loading: boolean;
  windowProductRank: boolean;
  windowCommunityList: boolean;
  windowCommunityCharacter: boolean;
  report?: ReportAPI;
  showCommunity: boolean;
  selectedCommunities: number[];
  selectedProduct?: number;
  searchItems?: number[];
  modalOpen: boolean;
  addAnalysisModalOpen: boolean;
  visible: boolean;
  sidebarVisible: boolean;
  searchValue: string;
  searchResults: SearchResult[];
  focusNode?: number;
  activeIndex: number;
  infoOpen: boolean;
}

interface SearchResult extends Node {
  title: string;
  core: string | boolean;
}

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
      modalOpen: false,
      visible: false,
      addAnalysisModalOpen: false,
      sidebarVisible: false,
      selectedCommunities: [],
      searchValue: '',
      searchResults: [],
      activeIndex: -1,
      infoOpen: true,
    };

    this.handleAccordionIndexChange = this.handleAccordionIndexChange.bind(this);
    this.handleInfoIndexChange = this.handleInfoIndexChange.bind(this);
    this.toggleShowCommunities = this.toggleShowCommunities.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.selectCommunities = this.selectCommunities.bind(this);

    // bind window functions
    this.openCommunityCharacterWindow = this.openCommunityCharacterWindow.bind(this);

    this.openCommunityListWidow = this.openCommunityListWidow.bind(this);
    this.openProductRankWindow = this.openProductRankWindow.bind(this);

    this.closeCommunityCharacterWindow = this.closeCommunityCharacterWindow.bind(this);
    this.closeCommunityListWindow = this.closeCommunityListWindow.bind(this);
    this.closeProductRankWindow = this.closeProductRankWindow.bind(this);

    // bind search function
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);

    this.openAddAnalysisModal = this.openAddAnalysisModal.bind(this);
    this.closeAddAnalysisModal = this.closeAddAnalysisModal.bind(this);
  }

  public async componentDidMount() {
    const report = await ReportAPI.get(this.props.match.params.id);
    this.setState({
      report,
      loading: false,
    });
  }

  public handleAccordionIndexChange(e: any, data: AccordionTitleProps): void {
    const { index } = data;
    this.setState({
      activeIndex: this.state.activeIndex === index ? -1 : (index as number),
    });
  }

  public handleInfoIndexChange(): void {
    this.setState({
      infoOpen: !this.state.infoOpen,
    });
  }

  public toggleShowCommunities() {
    this.setState({
      showCommunity: !this.state.showCommunity,
    });
  }

  public openCommunityCharacterWindow(): void {
    this.setState({
      windowCommunityCharacter: true,
    });
  }

  public closeCommunityCharacterWindow(): void {
    this.setState({
      windowCommunityCharacter: false,
    });
  }

  public openProductRankWindow(): void {
    this.setState({
      windowProductRank: true,
    });
  }

  public closeProductRankWindow(): void {
    this.setState({
      windowProductRank: false,
    });
  }

  public openCommunityListWidow(): void {
    this.setState({
      windowCommunityList: true,
    });
  }

  public closeCommunityListWindow(): void {
    this.setState({
      windowCommunityList: false,
    });
  }

  public selectProduct(id?: number): void {
    if (this.state.report) {
      this.setState({
        selectedProduct: id,
        selectedCommunities: [],
      });
    }
  }

  public selectCommunities(id: number): void {
    if (this.state.selectedCommunities.includes(id)) {
      this.setState({
        selectedProduct: undefined,
        selectedCommunities: this.state.selectedCommunities.filter((num) => num !== id),
      });
    } else {
      this.setState({
        selectedProduct: undefined,
        selectedCommunities: [...this.state.selectedCommunities, id],
      });
    }
  }

  public handleResultSelect(
    event: React.MouseEvent<HTMLDivElement>,
    data: SearchResultData,
  ): void {
    const { result } = data;
    this.setState({
      focusNode: result.id,
      searchValue: result.name,
      searchResults: [],
    });
  }

  public handleSearchChange(
    event: React.MouseEvent<HTMLElement>,
    data: SearchProps,
  ): void {
    const { value } = data;
    if (value) {
      const filter: Node[] = (this.state.report as ReportAPI).nodes.filter(
        (node) => node.name.indexOf(value) !== -1,
      );
      const results: SearchResult[] = filter.map((node) => {
        return {
          ...node,
          title: node.name,
          core: node.core.toString(),
        };
      });
      this.setState({
        searchValue: value as string,
        searchResults: results,
      });
    }
  }

  public handleToggleSidebar() {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  }

  public resultRenderer(node) {
    return <Search.Result key={node.id} id={node.id} title={node.name} />;
  }

  public toggleSidebar() {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
    });
  }

  public getConditions() {
    if (this.state.report) {
      return this.state.report.conditions.map((condition) => {
        if (condition.type === 'string' || condition.type === 'promotion') {
          return (
            <List.Item key={condition.name}>
              <List.Header>{condition.name}</List.Header>
              <List.Description>
                {(condition.values as string[]).join(', ')}
              </List.Description>
            </List.Item>
          );
        }
        if (condition.type === 'date') {
          return (
            <List.Item key={condition.name}>
              <List.Header>{condition.name}</List.Header>
              <List.Description>
                {simplifyDate(condition.values[0])} - {simplifyDate(condition.values[1])}
              </List.Description>
            </List.Item>
          );
        }
      });
    }
  }

  public openAddAnalysisModal(): void {
    this.setState({
      addAnalysisModalOpen: true,
    });
  }

  public closeAddAnalysisModal(): void {
    this.setState({
      addAnalysisModalOpen: false,
    });
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
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
            />
            <ProductRankWindow
              selectedProduct={this.state.selectedProduct}
              selectProduct={this.selectProduct}
              productList={this.state.report.rank}
              show={this.state.windowProductRank}
              close={this.closeProductRankWindow}
            />
            <Sidebar.Pushable>
              <Sidebar
                animation='push'
                direction='left'
                visible={this.state.sidebarVisible}
              >
                <Accordion
                  vertical
                  as={Menu}
                  fluid
                  style={{ height: '100%', overflowY: 'scroll' }}
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
                      <Header block textAlign='center'>
                        基本資訊
                      </Header>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.infoOpen}>
                      <List relaxed='very'>{this.getConditions()}</List>
                    </Accordion.Content>
                  </Menu.Item>
                  <Menu.Item>
                    <Search
                      size='small'
                      placeholder='搜尋產品'
                      noResultsMessage='無相關產品。'
                      results={this.state.searchResults}
                      onSearchChange={debounce(this.handleSearchChange, 300, {
                        leading: true,
                      })}
                      onResultSelect={this.handleResultSelect}
                      resultRenderer={this.resultRenderer}
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
                      <Menu.Item onClick={this.openCommunityListWidow}>
                        Communities排名
                      </Menu.Item>
                      <Menu.Item onClick={this.openCommunityCharacterWindow}>
                        Communities角色
                      </Menu.Item>
                    </Accordion.Content>
                  </Menu.Item>
                  <ModalAddAnalysis
                    report={this.state.report}
                    close={this.closeAddAnalysisModal}
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
                <Graph
                  nodes={this.state.report.nodes}
                  edges={this.state.report.edges}
                  showCommunity={this.state.showCommunity}
                  selectedCommunities={this.state.selectedCommunities}
                  selectedProduct={this.state.selectedProduct}
                  focusElement={this.state.focusNode}
                />
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </React.Fragment>
        );
      }
    }
  }
}

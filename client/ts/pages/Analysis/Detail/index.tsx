import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Accordion,
  AccordionTitleProps,
  Button,
  Checkbox,
  Icon,
  Menu,
  Header,
  Search,
  Sidebar,
  SearchResultData,
  SearchResultProps,
  SearchProps,
  Table,
} from 'semantic-ui-react';
import { isBoolean, debounce } from 'lodash';

import Graph from '../../../components/graph';
import Loader from '../../../components/Loader';
import {
  CommunityCharacterWindow,
  CommunityListWindow,
  ProductRankWindow,
} from 'Component/window';
import AnalysisInfoWindow from './AnalysisInfoWindow';
import ReportAPI, { Node } from '../../../PnApp/model/Report';
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
  searchItems?: number[];
  selectedProductMode?: SelectedProductDisplayMode;
  modalOpen: boolean;
  searchValue: string;
  sidebarVisible: boolean;
  searchResults: SearchResult[];
  focusNode?: number;
  activeIndex: number;
  infoOpen: boolean;
  comments: Comment[];
}

interface SearchResult extends Node {
  title: string;
  core: string | boolean;
}

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
      modalOpen: false,
      windowAnalysisInfo: false,
      sidebarVisible: false,
      selectedCommunities: [],
      searchValue: '',
      searchResults: [],
      activeIndex: -1,
      infoOpen: true,
      comments: [],
    };

    this.handleAccordionIndexChange = this.handleAccordionIndexChange.bind(this);
    this.handleInfoIndexChange = this.handleInfoIndexChange.bind(this);
    this.toggleShowCommunities = this.toggleShowCommunities.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
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

  public selectProduct = (id?: number, direct?: boolean) => {
    if (this.state.report && isBoolean(direct)) {
      this.setState({
        selectedProduct: id,
        selectedProductMode: direct ? 'direct' : 'indirect',
        selectedCommunities: [],
      });
    }
  };

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

  public resultRenderer(node: SearchResultProps) {
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

  public clearSelectedProduct = () => {
    this.setState({
      selectedProduct: undefined,
      selectedProductMode: undefined,
    });
  };

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
              model={this.state.report}
              selectedProduct={this.state.selectedProduct}
              selectProduct={this.selectProduct}
              productList={this.state.report.rank}
              selectedProductMode={this.state.selectedProductMode}
              show={this.state.windowProductRank}
              close={this.closeProductRankWindow}
              back={this.clearSelectedProduct}
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
                  selectedProductMode={this.state.selectedProductMode}
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

import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Checkbox, Divider, Dropdown, DropdownProps, Label, Menu, Sidebar } from 'semantic-ui-react';

import { DropdownSearchItem } from 'Component/dropdown';
import { ModalAddAnalysis } from 'Component/modal';
import Graph from '../../../components/graph';
import Loader from '../../../components/Loader';
import { DropdownMenu } from '../../../components/menu';
import CommunityCharacterWindow from './CommunityCharacterWindow';
import CommunityListWindow from './CommunityListWindow';
import ProductRankWindow from './ProductRankWindow';

import { Analysis } from '../../../PnApp/model';
import ReportAPI, { SimpleNode } from '../../../PnApp/model/Report';
import { Community, Node } from '../../../PnApp/model/Report';

interface ReportState {
  loading: boolean;
  windowProductRank: boolean;
  windowCommunityList: boolean;
  windowCommunityCharacter: boolean;
  report?: ReportAPI;
  showCommunity: boolean;
  communitiesInfo?: Community[];
  selectedCommunities?: Community[];
  selectedProduct?: number;
  searchItems?: number[];
  modalOpen: boolean;
  visible: boolean;
  sidebarVisible: boolean;
}

export default class Report extends PureComponent<RouteComponentProps<{ id: string }>, ReportState> {
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
      sidebarVisible: false,
    };

    this.onShowProductNetwork = this.onShowProductNetwork.bind(this);
    this.toggleShowCommunities = this.toggleShowCommunities.bind(this);
    this.updateCommunitiesGraph = this.updateCommunitiesGraph.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
    this.onSaveGraph = this.onSaveGraph.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onItemSearch = this.onItemSearch.bind(this);
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    // bind window functions
    this.openCommunityCharacterWindow = this.openCommunityCharacterWindow.bind(this);

    this.openCommunityListWidow = this.openCommunityListWidow.bind(this);
    this.openProductRankWindow = this.openProductRankWindow.bind(this);

    this.closeCommunityCharacterWindow = this.closeCommunityCharacterWindow.bind(this);
    this.closeCommunityListWindow = this.closeCommunityListWindow.bind(this);
    this.closeProductRankWindow = this.closeProductRankWindow.bind(this);
  }

  public async componentDidMount() {
    const report = await ReportAPI.get(this.props.match.params.id);
    this.setState({
      report,
      loading: false,
    });
  }

  public clearSelected() {
    this.setState({
      selectedCommunities: undefined,
      selectedProduct: undefined,
      searchItems: undefined,
    });
  }

  public onShowProductNetwork() {
    this.setState({ showCommunity: false });
    this.clearSelected();
  }

  public toggleShowCommunities() {
    this.setState({
      showCommunity: !this.state.showCommunity,
    });
    this.clearSelected();
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

  public updateCommunitiesGraph(communitiesList: Community[] | undefined) {
    this.setState({
      selectedCommunities: communitiesList,
      selectedProduct: undefined,
    });
  }

  public selectProduct(id?: number): void {
    if (this.state.report) {
      this.setState({
        selectedProduct: id,
        selectedCommunities: undefined,
      });
    }
  }

  public onSaveGraph() {
    this.setState({
      modalOpen: true,
    });
  }

  public onCancel() {
    this.setState({
      modalOpen: false,
    });
  }

  public onConfirm() {
    this.setState({
      modalOpen: false,
    });
    if (this.state.report) {
      Analysis.add({ report: this.state.report.id, title: 'testtest1' });
    }
  }

  public onItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    this.setState({
      searchItems: data.value as number[],
    });
  }

  public handleToggleSidebar() {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  public toggleSidebar() {
    this.setState({
      sidebarVisible: !this.state.sidebarVisible,
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
              show={this.state.windowCommunityCharacter}
              close={this.closeCommunityCharacterWindow}
            />
            <CommunityListWindow show={this.state.windowCommunityList} close={this.closeCommunityListWindow} />
            <ProductRankWindow
              selectProduct={this.selectProduct}
              productList={this.state.report.rank}
              show={this.state.windowProductRank}
              close={this.closeProductRankWindow}
            />
            <Button onClick={this.toggleSidebar}>Push</Button>
            <Sidebar.Pushable>
              <Sidebar
                as={Menu}
                animation='push'
                direction='left'
                visible={this.state.sidebarVisible}
                vertical
                style={{ overflow: 'visible' }}
              >
                <Menu.Item>
                  <h4>基本資訊</h4>
                </Menu.Item>
                <Menu.Item>
                  <Checkbox
                    label={this.state.showCommunity ? '隱藏Community' : '顯示Community'}
                    toggle
                    onChange={this.toggleShowCommunities}
                  />
                </Menu.Item>
                <Menu.Item as='a' onClick={this.openProductRankWindow}>
                  產品排名
                </Menu.Item>
                <Dropdown text='產品Community' item style={{ overflow: 'visible !important' }}>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={this.openCommunityListWidow}>Communities排名</Dropdown.Item>
                    <Dropdown.Item onClick={this.openCommunityCharacterWindow}>Communities角色</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Menu.Item as='a'>清楚所選資料</Menu.Item>
                <Button fluid color='facebook' style={{ position: 'absolute', bottom: 0 }}>
                  另存圖片
                </Button>
              </Sidebar>
              <Sidebar.Pusher>
                <Graph
                  nodes={this.state.report.nodes}
                  edges={this.state.report.edges}
                  showCommunity={this.state.showCommunity}
                  selectedCommunities={this.state.selectedCommunities}
                  selectedProduct={this.state.selectedProduct}
                  searchItems={this.state.searchItems}
                />
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </React.Fragment>
        );
      }
    }
  }
}

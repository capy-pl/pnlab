import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Divider, DropdownProps, Label, Menu, Segment, Sidebar } from 'semantic-ui-react';

import { ModalSave } from 'Component/modal';
import { SearchItemDropdown } from '../../components/dropdown';
import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import { DropdownMenu } from '../../components/menu';
import { CharacterMessage, CommunitiesMessage, ConditionBar, ProductRank, SideBar } from '../../components/message';

import { Analysis } from '../../PnApp/Model';
import ReportAPI from '../../PnApp/Model/Report' ;
import { Community, Node } from '../../PnApp/Model/Report';

interface ReportProps extends RouteComponentProps<{ id: string }> {
}

interface ReportState {
  loading: boolean;
  report?: ReportAPI;
  showCommunity: boolean;
  content: string;
  communitiesInfo?: Community[];
  selectedCommunities?: Community[];
  selectedProduct?: Node[];
  searchItems?: any;
  modalOpen: boolean;
  visible: boolean;
}

export default class Report extends PureComponent<ReportProps, ReportState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = {
      loading: true,
      showCommunity: false,
      content: '',
      modalOpen: false,
      visible: false,
    };
    this.onShowProductNetwork = this.onShowProductNetwork.bind(this);
    this.onShowCommunities = this.onShowCommunities.bind(this);
    this.onShowCharacter = this.onShowCharacter.bind(this);
    this.onShowProductRank = this.onShowProductRank.bind(this);
    this.onShowCommunitiesRank = this.onShowCommunitiesRank.bind(this);
    this.updateCommunitiesGraph = this.updateCommunitiesGraph.bind(this);
    this.updateProductGraph = this.updateProductGraph.bind(this);
    this.onSaveGraph = this.onSaveGraph.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onItemSearch = this.onItemSearch.bind(this);
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  public async componentDidMount() {
    const report = await ReportAPI.get(this.props.match.params.id);
    this.setState({
      report,
      loading: false,
      selectedCommunities: [],
      selectedProduct: [],
    });
  }

  public clearSelected() {
    this.setState({content: ''});
    this.setState({selectedCommunities: []});
    this.setState({selectedProduct: []});
  }

  public onShowProductNetwork() {
    this.setState({showCommunity: false});
    this.clearSelected();
  }

  public onShowCommunities() {
    this.setState({showCommunity: true});
    this.clearSelected();
    this.setState({searchItems: []});
  }

  public onShowCharacter(event) {
    event.stopPropagation();
    this.setState({content: 'character'});
  }

  public onShowProductRank(event) {
    event.stopPropagation();
    this.setState({content: 'productRank'});
  }

  public onShowCommunitiesRank(event) {
    event.stopPropagation();
    this.setState({content: 'communitiesRank'});
  }

  public updateCommunitiesGraph(communitiesList: Community[]) {
    console.log('got', communitiesList);
    this.setState({selectedCommunities: communitiesList});
  }

  public updateProductGraph(product) {
    const selectedProduct = this.state.report.nodes.filter((node) => node.name === product.name);
    this.setState({selectedProduct});
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
      Analysis.add({report: this.state.report.id, title: 'testtest1'});
    }
  }

  public onItemSearch(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    console.log(data.value);
    this.setState({searchItems: data.value});
  }

  public handleToggleSidebar() {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        let message;
        switch (this.state.content) {
          case 'character':
            message = (
              <CharacterMessage
                communitiesInfo={this.state.report.communities}
                hookInfo={this.state.report.hooks}
              />
            );
            break;
          case 'productRank':
            message = (
              <ProductRank
                productRankInfo={this.state.report.rank}
                updateProductGraph={this.updateProductGraph}
                nodes={this.state.report.nodes}
                edges={this.state.report.edges}
              />
            );
            break;
          case 'communitiesRank':
            message = (
              <CommunitiesMessage
                communitiesInfo={this.state.report.communities}
                updateCommunitiesGraph={this.updateCommunitiesGraph}
              />
            );
            break;
        }

        let searchItemDropdown;
        const dropdownOptions = this.state.report.nodes.map((node) => {
          return ({key: node.name, value: node.name, text: node.name});
        });
        if (!this.state.showCommunity) {
          searchItemDropdown = (
            <SearchItemDropdown
              options={dropdownOptions}
              placeholder='搜尋商品：請輸入商品名稱'
              onChange={this.onItemSearch}
            />
          );
        }

        const conditionList = this.state.report.conditions.map((condition) => {
          const values = condition.values.map((value) => {
            return (<Label key={value} style={{margin: '.2rem'}}>{value}</Label>);
          });
          return (
            <div key={condition.name} style={{margin: '1rem 0 1rem 0' }}>
              <h5>{condition.name}: </h5>
              {values}
              <Divider />
            </div>
          );
        });
        return (
          <React.Fragment>
            <DropdownMenu
              onShowProductNetwork={this.onShowProductNetwork}
              onShowCommunities={this.onShowCommunities}
              onShowProductRank={this.onShowProductRank}
              onShowCommunitiesRank={this.onShowCommunitiesRank}
              onShowCharacter={this.onShowCharacter}
            />
            <Sidebar.Pushable style={{height: 800}}>
              <Sidebar
                as={Menu}
                animation='overlay'
                direction='right'
                icon='labeled'
                vertical
                visible={this.state.visible}
                width='thin'
              >
                {conditionList}
              </Sidebar>
              <Sidebar.Pusher>
                <div style={{ position: 'relative'}}>
                  <div style={{ width: '100%', position: 'absolute' }}>
                    <Graph
                      nodes={this.state.report.nodes}
                      edges={this.state.report.edges}
                      showCommunity={this.state.showCommunity}
                      selectedCommunities={this.state.selectedCommunities}
                      selectedProduct={this.state.selectedProduct}
                      searchItems={this.state.searchItems}
                    />
                  </div>
                  <div style={{ width: '23%', overflow: 'auto', maxHeight: 550, position: 'absolute' }}>
                    {message}
                  </div>
                </div>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
            <div style={{ position: 'fixed', top: 80, right: 120, minWidth: '12%' }}>
              {searchItemDropdown}
            </div>
            <div style={{ position: 'fixed', top: 80, right: 20 }}>
              <Button onClick={this.handleToggleSidebar}>
                條件
              </Button>
            </div>
            <div style={{ position: 'fixed', bottom: 10, left: 10 }}>
              <ModalSave
                header='編輯圖片'
                open={this.state.modalOpen}
                onCancel={this.onCancel}
                onConfirm={this.onConfirm}
              >
                <Button
                  color='blue'
                  onClick={this.onSaveGraph}
                >儲存圖片
                </Button>
              </ModalSave>
            </div>
          </React.Fragment>
        );
      }
    }
  }
}

import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Icon, DropdownProps, Menu, Segment, Table } from 'semantic-ui-react';

import Pager, { PagerState } from '../../PnApp/Pager';
import { AnalysisItem } from '../../components/list';
import ModalAddCompare from '../../components/modal/ModalAddCompare';
import Analysis, { AnalysisPreview } from '../../PnApp/model/Analysis';

interface AnalysisListState extends PagerState {
  loading: boolean;
  modalOpen: boolean;
  analyses: AnalysisPreview[];
  analysisA?: Analysis;
  analysisB?: Analysis;
}

class AnalysisList extends PureComponent<RouteComponentProps, AnalysisListState> {
  public pager: Pager;
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      modalOpen: false,
      loading: true,
      analyses: [],
      startPage: 1,
      pageLimit: 10,
      limit: 15,
      currentPage: 1,
    };

    this.pager = new Pager('/api/analysis/page', this.state.pageLimit, this.state.limit);
  }

  public async componentDidMount() {
    await this.setStartPage(1);
  }

  public load = async () => {
    const analyses = await Analysis.getAll({
      limit: this.state.limit,
      page: this.state.currentPage,
    });
    this.setState({
      loading: false,
      analyses,
    });
  };

  public setStartPage = async (start: number) => {
    await this.pager.setStartPage(start);
    this.setState(
      {
        hasNext: this.pager.hasNext,
        leftNumber: !this.pager.hasNext ? this.pager.leftNumber : undefined,
        startPage: start,
        currentPage: start,
      },
      async () => {
        await this.load();
      },
    );
  };

  public getPageItems(): JSX.Element[] {
    const items: JSX.Element[] = [];
    const max: number = this.state.hasNext
      ? this.state.startPage + this.state.pageLimit
      : this.state.startPage + (this.state.leftNumber as number);
    for (let i = this.state.startPage; i < max; i++) {
      items.push(
        <Menu.Item
          key={i}
          active={this.state.currentPage === i}
          onClick={this.changePage(i)}
          as='a'
        >
          {i}
        </Menu.Item>,
      );
    }
    return items;
  }

  public changePage(page: number): () => Promise<void> {
    return async () => {
      this.setState(
        {
          loading: true,
          currentPage: page,
        },
        async () => {
          await this.load();
        },
      );
    };
  }

  public nextPages = async () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setStartPage(this.state.startPage + this.state.pageLimit);
      },
    );
  };

  public previousPages = async () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setStartPage(this.state.startPage - this.state.pageLimit);
      },
    );
  };

  public onLinkClick = (path: string) => {
    return () => {
      this.props.history.push(`/analysis/${path}`);
    };
  };

  public onClick = () => {
    this.setState({
      modalOpen: true,
    });
  };

  public onConfirm = async () => {
    this.setState({
      modalOpen: false,
      loading: true,
    });
    this.props.history.push({
      pathname: '/analysis/compare',
      state: {
        analysisA: this.state.analysisA,
        analysisB: this.state.analysisB,
      },
    });
  };

  public onCancel = () => {
    this.setState({
      modalOpen: false,
    });
  };

  public onChangeA = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => {
    const values = data.value as undefined;
    this.setState({
      analysisA: values,
    });
  };

  public onChangeB = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => {
    const values = data.value as undefined;
    this.setState({
      analysisB: values,
    });
  };

  public render() {
    const history = this.state.analyses.map((analysis) => {
      return (
        <AnalysisItem
          key={analysis._id}
          item={analysis}
          onButtonClick={this.onLinkClick(analysis._id)}
        />
      );
    });
    return (
      <Segment loading={this.state.loading} size='large'>
        <React.Fragment>
          <ModalAddCompare
            header={'選擇比較網路圖'}
            open={this.state.modalOpen}
            analyses={this.state.analyses}
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
            dropChangeA={this.onChangeA}
            dropChangeB={this.onChangeB}
          />
          <Button
            floated='right'
            color='blue'
            style={{ margin: '10px' }}
            onClick={this.onClick}
            icon
            labelPosition='right'
          >
            <Icon name='clone outline' />
            比較圖片
          </Button>
          <Table selectable color='blue'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width='1' textAlign='center'>
                  圖片名稱
                </Table.HeaderCell>
                <Table.HeaderCell width='5' textAlign='center'>
                  建立時間
                </Table.HeaderCell>
                <Table.HeaderCell width='2' textAlign='center' />
              </Table.Row>
            </Table.Header>
            <Table.Body>{history}</Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='16'>
                  <Menu floated='right' pagination>
                    <Menu.Item
                      as='a'
                      onClick={this.previousPages}
                      icon
                      disabled={this.state.startPage === 1}
                    >
                      <Icon name='chevron left' />
                    </Menu.Item>
                    {this.getPageItems()}
                    <Menu.Item
                      as='a'
                      onClick={this.nextPages}
                      icon
                      disabled={!this.state.hasNext}
                    >
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </React.Fragment>
      </Segment>
    );
  }
}

export default withRouter(AnalysisList);

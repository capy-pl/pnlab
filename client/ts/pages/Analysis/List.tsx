import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Icon,
  Dropdown,
  DropdownProps,
  Menu,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';

import Pager, { PagerState } from '../../PnApp/Pager';
import { AnalysisItem } from '../../components/list';
import ModalAddCompare from '../../components/modal/ModalAddCompare';
import Analysis, { AnalysisPreview } from '../../PnApp/model/Analysis';

interface State extends PagerState {
  loading: boolean;
  modalOpen: boolean;
  analyses: AnalysisPreview[];
  analysisA?: Analysis;
  analysisB?: Analysis;
  compareList: string[];
  active: string;
}

class AnalysisList extends PureComponent<RouteComponentProps, State> {
  public state: State = {
    modalOpen: false,
    loading: true,
    analyses: [],
    startPage: 1,
    pageLimit: 10,
    limit: 15,
    currentPage: 1,
    compareList: [],
    active: '',
  };

  private pager: Pager = new Pager(
    '/api/analysis/page',
    this.state.pageLimit,
    this.state.limit,
  );
  private clickTimeout?: number;

  public async componentDidMount() {
    await this.setStartPage(1);
  }

  private load = async () => {
    const analyses = await Analysis.getAll({
      limit: this.state.limit,
      page: this.state.currentPage,
    });
    this.setState({
      loading: false,
      analyses,
    });
  };

  private setStartPage = async (start: number) => {
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

  private getPageItems(): JSX.Element[] {
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

  public dbclick(id: string): (event: React.MouseEvent) => void {
    return () => {
      if (this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
        this.clickTimeout = undefined;
      }
      this.props.history.push(`/analysis/${id}`);
    };
  }

  public click(id: string): () => void {
    return () => {
      if (!this.clickTimeout) {
        this.clickTimeout = window.setTimeout(() => {
          this.setState({
            active: this.state.active === id ? '' : id,
          });
          this.clickTimeout = undefined;
        }, 100);
      }
    };
  }

  public onClick = () => {
    this.setState({
      modalOpen: true,
    });
  };

  public onConfirm = () => {
    if (this.state.compareList.length === 2) {
      this.setState({
        modalOpen: false,
        loading: true,
      });
      this.props.history.push({
        pathname: '/analysis/compare',
        state: {
          analysisAId: this.state.compareList[0],
          analysisBId: this.state.compareList[1],
        },
      });
    }
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

  public setLimit = async (limit: number) => {
    await this.pager.setLimit(limit);
    this.setState(
      {
        hasNext: this.pager.hasNext,
        leftNumber: !this.pager.hasNext ? this.pager.leftNumber : undefined,
        startPage: 1,
        currentPage: 1,
        limit,
      },
      async () => {
        await this.load();
      },
    );
  };

  public changeLimit = (e, data: DropdownProps) => {
    const { value } = data;
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setLimit(value as number);
      },
    );
  };

  public getPageOptions = () => {
    return [15, 25, 50].map((value) => ({
      key: value,
      text: value.toString(),
      value,
    }));
  };

  public handleCheck = (id: string) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      let compareList;
      if (this.state.compareList.includes(id)) {
        compareList = this.state.compareList.filter((value) => value !== id);
      } else if (this.state.compareList.length < 2) {
        compareList = [...this.state.compareList, id];
      } else {
        return;
      }
      this.setState({ compareList });
    };
  };

  public clearSelected = () => {
    this.setState({ compareList: [] });
  };

  public render() {
    const history = this.state.analyses.map((analysis) => {
      return (
        <AnalysisItem
          key={analysis._id}
          item={analysis}
          onCheck={this.handleCheck(analysis._id)}
          selected={this.state.compareList.includes(analysis._id)}
          compareList={this.state.compareList}
          click={this.click(analysis._id)}
          dbclick={this.dbclick(analysis._id)}
          active={this.state.active === analysis._id}
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
            style={{ margin: '10px' }}
            onClick={this.onConfirm}
            icon
            labelPosition='right'
            disabled={this.state.compareList.length !== 2}
            color={this.state.compareList.length === 2 ? 'teal' : undefined}
          >
            <span>比較圖片（已勾選{this.state.compareList.length} / 2）</span>
            <Icon name='clone outline' />
          </Button>
          <Table color='blue'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign='right' colSpan='16'>
                  每頁顯示
                  <Dropdown
                    inline
                    onChange={this.changeLimit}
                    options={this.getPageOptions()}
                    text={`${this.state.limit}`}
                    value={this.state.limit}
                  />
                  筆資料
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell width='5' textAlign='center'>
                  圖片名稱
                </Table.HeaderCell>
                <Table.HeaderCell width='4' textAlign='center'>
                  建立時間
                </Table.HeaderCell>
                <Table.HeaderCell width='4' textAlign='center'>
                  加入比較 &nbsp;&nbsp;
                  <Popup
                    content='清除全部'
                    basic
                    trigger={
                      <Icon
                        name='trash alternate'
                        bordered
                        onClick={this.clearSelected}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                        }}
                      />
                    }
                  />
                </Table.HeaderCell>
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

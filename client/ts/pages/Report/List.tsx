import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownProps,
  Icon,
  Menu,
  Segment,
  Table,
} from 'semantic-ui-react';

import Pager, { PagerState } from '../../PnApp/Pager';
import { ReportItem } from 'Component/list';
import { Report } from '../../PnApp/model';
import { ReportPreview, ReportStatus } from '../../PnApp/model/Report';

interface State extends PagerState {
  loading: boolean;
  reports: ReportPreview[];
  active: string;
}

class ReportList extends PureComponent<RouteComponentProps, State> {
  public state: State = {
    loading: true,
    reports: [],
    startPage: 1,
    pageLimit: 10,
    limit: 15,
    currentPage: 1,
    active: '',
  };

  private clickTimeout?: number;
  private listeningMap: Map<string, WebSocket> = new Map<string, WebSocket>();
  private pager: Pager = new Pager(
    '/api/report/page',
    this.state.pageLimit,
    this.state.limit,
  );

  public onFinish(id: string): (event: MessageEvent) => void {
    return (event) => {
      if (
        (event.data as ReportStatus) === 'success' ||
        (event.data as ReportStatus) === 'error'
      ) {
        const ws = this.listeningMap.get(id);
        if (ws) {
          ws.close();
        }
        const reports = [...this.state.reports];
        reports.forEach((report) => {
          if (report._id === id) {
            report.status = event.data;
          }
        });
        this.setState({ reports });
      }
    };
  }

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

  public load = async () => {
    const reports = await Report.getAll({
      limit: this.state.limit,
      page: this.state.currentPage,
    });
    for (const report of reports) {
      if (report.status === 'pending') {
        const ws = new WebSocket(`ws://${location.host}/report`);
        ws.onmessage = this.onFinish(report._id);
        ws.onopen = () => {
          ws.send(report._id);
        };
        this.listeningMap.set(report._id, ws);
      }
    }
    this.setState({
      loading: false,
      reports,
    });
  };

  public clearSocket = () => {
    this.listeningMap.forEach((socket) => {
      socket.close(1000);
    });
  };

  public async componentDidMount() {
    await this.setStartPage(1);
  }

  public componentWillUnmount() {
    this.clearSocket();
  }

  public changePage(page: number): () => Promise<void> {
    return async () => {
      this.clearSocket();
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

  public changeLimit = (e, data: DropdownProps) => {
    const { value } = data;
    this.clearSocket();
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setLimit(value as number);
      },
    );
  };

  public dbclick(id: string): () => void {
    return () => {
      if (this.clickTimeout) {
        window.clearTimeout(this.clickTimeout);
        this.clickTimeout = undefined;
      }
      this.props.history.push(`/report/${id}`);
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

  private add = () => {
    this.props.history.push('/report/add');
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

  public getPageOptions = () => {
    return [15, 25, 50].map((value) => ({
      key: value,
      text: value.toString(),
      value,
    }));
  };

  public render() {
    const history = this.state.reports.map((report) => {
      return (
        <ReportItem
          key={report._id}
          active={this.state.active === report._id}
          item={report}
          click={this.click(report._id)}
          dbclick={this.dbclick(report._id)}
        />
      );
    });
    return (
      <Segment loading={this.state.loading} size='large'>
        <Button
          floated='right'
          color='teal'
          icon
          labelPosition='right'
          style={{ margin: '10px' }}
          onClick={this.add}
        >
          <Icon name='add circle' />
          新增Report
        </Button>
        <Table color='teal'>
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
              <Table.HeaderCell width='2' textAlign='center'>
                狀態
              </Table.HeaderCell>
              <Table.HeaderCell width='3' textAlign='center'>
                開始時間
              </Table.HeaderCell>
              <Table.HeaderCell width='3' textAlign='center'>
                結束時間
              </Table.HeaderCell>
              <Table.HeaderCell width='5' textAlign='center'>
                條件
              </Table.HeaderCell>
              <Table.HeaderCell width='3' textAlign='center'>
                建立時間
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
      </Segment>
    );
  }
}

export default withRouter(ReportList);

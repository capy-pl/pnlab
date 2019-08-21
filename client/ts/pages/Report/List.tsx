import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Icon, Menu, Segment, Table } from 'semantic-ui-react';

import Pager, { PagerState } from '../../PnApp/Pager';
import { SearchHistoryItem } from 'Component/list';
import { Report } from '../../PnApp/model';
import { ReportPreview, ReportStatus } from '../../PnApp/model/Report';

interface ReportListState extends PagerState {
  loading: boolean;
  reports: ReportPreview[];
}

class ReportList extends PureComponent<RouteComponentProps, ReportListState> {
  public listeningMap: Map<string, WebSocket>;
  public pager: Pager;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      reports: [],
      startPage: 1,
      pageLimit: 10,
      limit: 15,
      currentPage: 1,
    };

    this.listeningMap = new Map<string, WebSocket>();

    this.onFinish = this.onFinish.bind(this);
    this.pager = new Pager('/api/report/page', this.state.pageLimit, this.state.limit);
    this.changePage = this.changePage.bind(this);
    this.clearSocket = this.clearSocket.bind(this);
    this.nextPages = this.nextPages.bind(this);
    this.previousPages = this.previousPages.bind(this);
  }

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

  public async setStartPage(start: number): Promise<void> {
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
  }

  public async load(): Promise<void> {
    const reports = await Report.getAll({
      limit: this.state.limit,
      page: this.state.currentPage,
    });
    for (const report of reports) {
      if (report.status === 'pending') {
        const ws = new WebSocket('ws://localhost:3000');
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
  }

  public clearSocket(): void {
    this.listeningMap.forEach((socket) => {
      socket.close(1000);
    });
  }

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

  public onLinkClick(path: string): () => void {
    return () => {
      this.props.history.push(`/report/${path}`);
    };
  }

  public getPageItems(): JSX.Element[] {
    const items: JSX.Element[] = [];
    const max: number = this.state.hasNext
      ? this.state.startPage + this.state.pageLimit
      : this.state.startPage + (this.state.leftNumber as number);
    for (let i = this.state.startPage; i < max; i++) {
      items.push(
        <Menu.Item
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

  public async nextPages(): Promise<void> {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setStartPage(this.state.startPage + this.state.pageLimit);
      },
    );
  }

  public async previousPages(): Promise<void> {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setStartPage(this.state.startPage - this.state.pageLimit);
      },
    );
  }

  public render() {
    const history = this.state.reports.map((report) => {
      return (
        <SearchHistoryItem
          key={report._id}
          item={report}
          onLinkClick={this.onLinkClick(report._id)}
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
          onClick={this.onLinkClick('add')}
        >
          <Icon name='add circle' />
          新增Report
        </Button>
        <Table selectable color='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>
                狀態
              </Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>
                開始時間
              </Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>
                結束時間
              </Table.HeaderCell>
              <Table.HeaderCell width='5' textAlign='center'>
                條件
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
      </Segment>
    );
  }
}

export default withRouter(ReportList);

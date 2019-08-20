import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Icon, Segment, Table } from 'semantic-ui-react';

import { SearchHistoryItem } from 'Component/list';
import { Report } from '../../PnApp/model';
import { ReportPreview, ReportStatus } from '../../PnApp/model/Report';

interface ReportListState {
  loading: boolean;
  reports: ReportPreview[];
}

class ReportList extends PureComponent<RouteComponentProps, ReportListState> {
  public listeningMap: Map<string, WebSocket>;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      reports: [],
    };
    this.listeningMap = new Map<string, WebSocket>();

    this.onFinish = this.onFinish.bind(this);
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

  public async componentDidMount() {
    const reports = await Report.getAll();
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

  public onLinkClick(path: string): () => void {
    return () => {
      this.props.history.push(`/report/${path}`);
    };
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
        </Table>
      </Segment>
    );
  }
}

export default withRouter(ReportList);

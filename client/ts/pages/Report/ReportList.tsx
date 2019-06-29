import React, { PureComponent } from 'react';
import { Button, Segment, Table } from 'semantic-ui-react';
import { SearchHistoryItem } from '../../components/list';
import { Report } from '../../PnApp/Model';
import { ProjectedReport } from '../../PnApp/Model/Report';

interface ReportListState {
  loading: boolean;
  reports: ProjectedReport[];
}

export default class ReportList extends PureComponent<{}, ReportListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      reports: [],
    };
  }

  public async componentDidMount() {
    const reports = await Report.getAll();
    this.setState({
      loading: false,
      reports,
    });
  }

  public render() {
    const history = this.state.reports.map((report) => <SearchHistoryItem key={report._id} item={report} />);
    return (
      <Segment loading={this.state.loading} size='large'>
        <Button
          floated='right'
          inverted
          color='blue'
          style={{ margin: '10px'}}
        >
          Add Report
        </Button>
        <Table selectable color='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>Status</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Start Time</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>End Time</Table.HeaderCell>
              <Table.HeaderCell width='5' textAlign='center'>Conditions</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Link</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {history}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Segment, Table } from 'semantic-ui-react';

import { AnalysesList } from '../../components/list';
import Analysis from '../../PnApp/model/Analysis';

interface AnalysisListState {
  loading: boolean;
  analyses: Analysis[];
}

class AnalysisList extends PureComponent<RouteComponentProps, AnalysisListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      analyses: [],
    };

  }

  public async componentDidMount() {
    const analyses = await Analysis.getAll();
    this.setState({
      loading: false,
      analyses,
    });
  }

  public onLinkClick(path: string): () => void {
    return () => {
      this.props.history.push(`/analysis/${path}`);
    };
  }

  public render() {
    const history = this.state.analyses.map((analysis) => {
      return (
        <AnalysesList
          key={analysis.id}
          item={analysis}
          onButtonClick={this.onLinkClick(analysis.id)}
        />
      );
    });
    return (
      <Segment loading={this.state.loading} size='large'>
        <Button
          floated='right'
          inverted
          color='blue'
          style={{ margin: '10px'}}
          // onClick={this.onLinkClick('add')}
        >
          Add Compare
        </Button>
        <Table selectable color='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>Title</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Description</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Comments</Table.HeaderCell>
              <Table.HeaderCell width='5' textAlign='center'>Created Time</Table.HeaderCell>
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

export default withRouter(AnalysisList);

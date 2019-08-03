import React, { PureComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, DropdownProps, Segment, Table } from 'semantic-ui-react';

import { AnalysesList } from '../../components/list';
import CompareAdd from '../../components/modal/CampareAdd';
import Analysis from '../../PnApp/model/Analysis';

interface AnalysisListState {
  loading: boolean;
  modalOpen: boolean;
  analyses: Analysis[];
  analysisA?: Analysis;
  analysisB?: Analysis;
}

class AnalysisList extends PureComponent<RouteComponentProps, AnalysisListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalOpen: false,
      loading: true,
      analyses: [],
    };

    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeA = this.onChangeA.bind(this);
    this.onChangeB = this.onChangeB.bind(this);
    this.onClick = this.onClick. bind(this);

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

  public onClick() {
    this.setState({
      modalOpen: true,
    });
  }

  public async onConfirm(): Promise<void> {
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
  }

  public onCancel() {
    this.setState({
      modalOpen: false,
    });
  }

  public onChangeA(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    const values = data.value as undefined;
    this.setState({
      analysisA: values,
    });
  }

  public onChangeB(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    const values = data.value as undefined;
    this.setState({
      analysisB: values,
    });
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
        <React.Fragment>
          <CompareAdd
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
            inverted
            color='blue'
            style={{ margin: '10px'}}
            onClick={this.onClick}
          >
            Add Compare
          </Button>
          <Table selectable color='blue'>
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell width='1'>Title</Table.HeaderCell>
                <Table.HeaderCell width='2'>Description</Table.HeaderCell>
                <Table.HeaderCell width='2'>Comments</Table.HeaderCell>
                <Table.HeaderCell width='5'>Created Time</Table.HeaderCell>
                <Table.HeaderCell width='2'>Link</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {history}
            </Table.Body>
          </Table>
        </React.Fragment>
      </Segment>
    );
  }
}

export default withRouter(AnalysisList);
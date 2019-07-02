import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import ReportAPI from '../../PnApp/Model/Report' ;

interface ReportProps extends RouteComponentProps<{ id: string }> {
}

interface ReportState {
  loading: boolean;
  report?: ReportAPI;
}

export default class Report extends PureComponent<ReportProps, ReportState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  public async componentDidMount() {
    const report = await ReportAPI.get(this.props.match.params.id);
    this.setState({
      report,
      loading: false,
    });
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        return (
          <Graph
            nodes={this.state.report.nodes}
            edges={this.state.report.edges}
          />
        );
      }
    }
  }
}

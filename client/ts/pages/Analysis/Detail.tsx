import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import AnalysisAPI from '../../PnApp/model/Analysis';
import ReportAPI from '../../PnApp/model/Report';

interface AnalysisState {
  loading: boolean;
  analysis?: AnalysisAPI;
  report?: ReportAPI;
}

export default class Analysis extends PureComponent<RouteComponentProps<{ id: string }>, AnalysisState> {
  constructor(props: RouteComponentProps<{ id: string }>) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  public async componentDidMount() {
    const analysis = await AnalysisAPI.get(this.props.match.params.id as string);
    const report = await ReportAPI.get(analysis.report);
    this.setState({
      analysis,
      report,
      loading: false,
    });
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        return <Graph nodes={this.state.report.nodes} edges={this.state.report.edges} />;
      }
    }
  }
}

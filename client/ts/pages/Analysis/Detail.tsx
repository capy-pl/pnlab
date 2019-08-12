import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import AnalysisAccordion from 'Component/accrodion/AnalysisAccordion';
import { Button } from 'semantic-ui-react';
import Graph from '../../components/graph';
import Loader from '../../components/Loader';
import AnalysisAPI from '../../PnApp/model/Analysis';
import {Comments} from '../../PnApp/model/Analysis' ;
import ReportAPI from '../../PnApp/model/Report';

interface AnalysisProps extends RouteComponentProps<{ id: string }> {
}

interface AnalysisState {
  loading: boolean;
  analysis?: AnalysisAPI;
  report?: ReportAPI;
  visible: boolean;
}

export default class Analysis extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
    };
    this.onHandleClick = this.onHandleClick.bind(this);
    this.load = this.load.bind(this);
  }

  public async componentDidMount() {
    await this.load();
  }

  public async load() {
    const analysis = await AnalysisAPI.get(this.props.match.params.id);
    const report = await ReportAPI.get(analysis.report);
    this.setState({
      analysis,
      report,
      loading: false,
    });
  }

  public onHandleClick() {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.report) {
        return (
          <React.Fragment>
            <AnalysisAccordion
              analysis={this.state.analysis}
              onSave={this.load}
            />
            <Graph
              nodes={this.state.report.nodes}
              edges={this.state.report.edges}
            />
          </React.Fragment>
        );
      }
    }
  }
}

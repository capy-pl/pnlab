import React, { PureComponent } from 'react';
import { Button, Divider } from 'semantic-ui-react';

import Graph from '../../components/graph';
import Graph2 from '../../components/graph2/index';
import Loader from '../../components/Loader';
import ComparePortal from '../../components/portal/index';
import AnalysisAPI from '../../PnApp/model/Analysis' ;
import ReportAPI from '../../PnApp/model/Report';

interface AnalysisProps {
  analysisA?: string;
  analysisB?: string;
}

interface AnalysisState {
  loading: boolean;
  analysisA?: AnalysisAPI;
  analysisB?: AnalysisAPI;
  reportA?: ReportAPI;
  reportB?: ReportAPI;
  open: boolean;
}

export default class Compare extends PureComponent<AnalysisProps, AnalysisState> {
  constructor(props: AnalysisProps) {
    super(props);
    this.state = {
      loading: true,
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  public async componentDidMount() {
    const analysisA = await AnalysisAPI.get(this.props.location.state.analysisA);
    const analysisB = await AnalysisAPI.get(this.props.location.state.analysisB);
    const reportA = await ReportAPI.get(analysisA.report);
    const reportB = await ReportAPI.get(analysisB.report);
    this.setState({
      analysisA,
      analysisB,
      reportA,
      reportB,
      loading: false,
    });
  }

  public handleClose() {
    this.setState({ open: false });
  }

  public handleOpen() {
    this.setState({ open: true });
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    } else {
      if (this.state.reportA && this.state.reportB) {
        return (
          <React.Fragment>
            <div style={{display: 'flex', justifyContent: 'center', position: 'relative'}}>
              <div>
                <Graph2
                  nodes={this.state.reportA.nodes}
                  edges={this.state.reportA.edges}
                />
              </div>
              <Divider vertical>
                <Button onClick={this.handleOpen}>
                  A vs B
                </Button>
              </Divider>
              <div>
                <Graph2
                  nodes={this.state.reportB.nodes}
                  edges={this.state.reportB.edges}
                />
              </div>
            </div>
            <ComparePortal
              open={this.state.open}
              reportA={this.state.reportA}
              reportB={this.state.reportB}
              onClose={this.handleClose}
            />
          </React.Fragment>
        );
      }
    }
  }
}

import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Graph from 'Component/graph';
import Loader from 'Component/Loader';
import ReportAPI from '../../PnApp/model/Report' ;
import {Node} from '../../PnApp/model/Report';

interface ReportProps extends RouteComponentProps<{ id: string }> {
}

interface CompareState {
  loading: boolean;
  reportA?: ReportAPI;
  reportB?: ReportAPI;
  reportAId: string;
  reportBId: string;
}

export default class Compare extends PureComponent<ReportProps, CompareState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = {
      reportAId: '',
      reportBId: '',
      loading: true,
    };
  }

  public async componentDidMount() {
    const reportA = await ReportAPI.get(this.state.reportAId);
    const reportB = await ReportAPI.get(this.state.reportBId);
    this.setState({
      reportA,
      reportB,
      loading: false,
    });
  }

  public nodeCompare() {
    const similarList = [];
    const reportOne = this.state.reportA;
    const reportTwo = this.state.reportB;
    for (const node of reportOne.nodes) {
      for (const compareNode of reportTwo.nodes) {
        if (node === compareNode) {
          similarList.push(node);
        }
      }
    }
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

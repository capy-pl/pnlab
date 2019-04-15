import React, { Component } from 'react';
import { DataSet, Network } from 'vis';

import Global, { Edge, Node } from '../../PnApp/global';

const { data } = Global;

const style = {
  height: '800px',
};

interface GraphNode extends Node {
  label: string;
}

interface GraphEdge extends Edge {
}

export default class GraphView extends Component {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network: Network;
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
  }

  public componentDidMount() {
    const nodes = new DataSet<GraphNode>();
    const edges = new DataSet<GraphEdge>();
    for (const node of data.nodes) {
      node.label = node.name;
      nodes.add(node);
    }
    for (const edge of data.edges) {
      edges.add(edge);
    }
    if (this.graphRef.current) {
      this.network = new Network(this.graphRef.current, {
        edges,
        nodes,
      }, {
        physics: {
          stabilization: false,
        },
      });
    }
  }

  public render() {
    return (
      <div id='pn-graph' style={style} ref={this.graphRef} />
    );
  }
}

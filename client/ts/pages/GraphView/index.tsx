import React, { Component } from 'react';
import { DataSet, Network } from 'vis';

import Global, { Edge, Node } from '../../PnApp/global';
import { getRandomColor } from '../../PnApp/helper';

const { data } = Global;

const style = {
  height: '800px',
};


export default class GraphView extends Component {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
  }

  public componentDidMount() {
    const nodes = new DataSet<Node>();
    const edges = new DataSet<Edge>();
    for (const node of data.nodes) {
      node.label = node.name;
      node.group = node.community.toString();
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
        edges: {
          smooth: false,
        },
        layout: {
          improvedLayout: false,
        },
        nodes: {
          scaling: {
            customScalingFunction: (min?: number, max?: number, total?: number, value?: number): number => {
              if (value) {
                return value;
              }
              return 0.5;
            },
            label: {
              enabled: true,
            },
            max: 70,
          },
          shape: 'ellipse',
        },
        physics: {
          barnesHut: {
            springLength: 200,
          },
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

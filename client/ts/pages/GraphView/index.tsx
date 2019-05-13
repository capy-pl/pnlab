import React, { Component } from 'react';
import { DataSet, Network } from 'vis';

import { Data, Edge, Node } from '../../PnApp/global';

const style = {
  height: '800px',
};

interface GraphProps {
  data: Data;
}

export default class GraphView extends Component<GraphProps, {}> {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
  }

  public componentDidMount() {
    this.initializeGraph();
  }

  public initializeGraph(): void {
    const nodes = new DataSet<Node>();
    const edges = new DataSet<Edge>();
    for (const node of this.props.data.nodes) {
      node.label = node.name;
      node.group = node.community.toString();
      nodes.add(node);
    }
    for (const edge of this.props.data.edges) {
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
            improvedLayout: true,
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
              max: 50,
              min: 10,
            },
            shape: 'dot',
          },
          physics: {
            barnesHut: {
              springLength: 200,
              centralGravity: 0.1,
            },
            stabilization: false
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

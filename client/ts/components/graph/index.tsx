import React, { PureComponent } from 'react';
import { DataSet, EdgeOptions, Network, NodeOptions } from 'vis';
import { Edge, Node } from '../../PnApp/model/Report';

interface GraphNode extends Node, NodeOptions {
}

interface GraphEdge extends Edge, EdgeOptions {
}

const style = {
  height: '800px',
};

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
}

export default class GraphView extends PureComponent<GraphProps, {}> {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  constructor(props: GraphProps) {
    super(props);
    this.graphRef = React.createRef();
  }

  public componentDidMount() {
    this.initializeGraph();
  }

  public componentDidUpdate() {
    this.initializeGraph();
  }

  public toNode(node: Node): GraphNode {
    const copy: GraphNode = Object.assign({}, node);
    copy.label = node.name;
    copy.group = node.community.toString();
    copy.value = node.degree;
    copy.title = `
    <div>
      <p>${copy.name}</p>
      <p>community: ${copy.group}</p>
      <p>連接節點數: ${copy.degree}</p>
    </div>
    `;
    if (node.core) {
      copy.borderWidth = 5;
    }
    return copy;
  }

  public toEdge(edge: Edge): GraphEdge {
    return Object.assign({}, edge) as GraphEdge;
  }

  public initializeGraph(): void {
    const nodes = new DataSet<GraphNode>();
    const edges = new DataSet<GraphEdge>();
    for (const node of this.props.nodes) {
      nodes.add(this.toNode(node));
    }

    for (const edge of this.props.edges) {
      edges.add(this.toEdge(edge));
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
              customScalingFunction: (min, max, total, value) => {
                if (max === min) {
                  return 0.03;
                } else {
                  const scale = 1 / (max - min);
                  return Math.max(0, (value - min) * scale);
                }
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
            stabilization: true,
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

export {
  GraphView,
};

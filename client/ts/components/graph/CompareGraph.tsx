import _ from 'lodash';
import React, { PureComponent } from 'react';
import { DataSet, EdgeOptions, Network, NodeOptions, Options } from 'vis';

import Jgraph from '../../PnApp/Jgraph';
import { Edge, Node } from '../../PnApp/model/Report';

interface GraphNode extends Node, NodeOptions {}

interface GraphEdge extends Edge, EdgeOptions {}

const customScalingFunction = (
  min: number,
  max: number,
  total: number,
  value: number,
): number => {
  if (max === min) {
    return 0.03;
  } else {
    const scale = 1 / (max - min);
    return Math.max(0, (value - min) * scale);
  }
};

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  selectedProduct?: string[];
  shareNodes?: string[];
}

const graphOption: Options = {
  edges: {
    smooth: false,
    scaling: {
      customScalingFunction,
      max: 30,
      min: 1,
    },
  },
  layout: {
    improvedLayout: false,
    randomSeed: 5,
  },
  nodes: {
    scaling: {
      customScalingFunction,
      label: {
        enabled: true,
      },
      max: 100,
      min: 30,
    },
    shape: 'dot',
  },
  physics: {
    barnesHut: {
      springLength: 300,
      centralGravity: 0.15,
      avoidOverlap: 0.2,
    },
    minVelocity: 0.0001,
    stabilization: {
      enabled: true,
    },
  },
  interaction: {
    hover: true,
    tooltipDelay: 100,
  },
};

export default class GraphViewCompare extends PureComponent<GraphProps, {}> {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  public jgraph?: Jgraph;
  public nodes: DataSet<GraphNode>;
  public edges: DataSet<GraphEdge>;
  constructor(props: GraphProps) {
    super(props);
    this.graphRef = React.createRef();
    this.nodes = new DataSet();
    this.edges = new DataSet();

    this.paintSelectedProduct = this.paintSelectedProduct.bind(this);
    this.repaint = this.repaint.bind(this);
  }

  public componentDidMount() {
    if (this.graphRef.current) {
      this.graphRef.current.style.height = this.getHeight();
    }
    this.initializeGraph();
  }

  public componentDidUpdate(prevProps: GraphProps) {
    // Do not call repaint if correspondent props don't change.
    if (!_.isEqual(this.props.selectedProduct, prevProps.selectedProduct)) {
      this.repaint();
      this.paintSelectedProduct();
    }
  }

  public getHeight(): string {
    let height = 'auto';
    if (this.graphRef.current) {
      if (this.graphRef.current) {
        const { top } = this.graphRef.current.getBoundingClientRect();
        height = `${window.innerHeight - top}px`;
      }
    }
    return height;
  }

  public toNode(node: Node): GraphNode {
    const copy: GraphNode = Object.assign({}, node);
    copy.label = node.name;
    copy.value = node.weight;
    copy.title = `
      <div>
        <p>${copy.name}</p>
        <p>weight: ${Math.round(copy.weight)}</p>
        <p>連接節點數: ${copy.degree}</p>
      </div>
    `;
    if (this.props.shareNodes && this.props.shareNodes.includes(node.name)) {
      copy.color = {
        background: 'yellow',
        border: '#3f83d4',
        hover: '#ffdd00',
        highlight: '#ffdd00',
      };
    } else {
      copy.color = {
        background: '#8DC1FF',
        border: '#3f83d4',
        hover: '#3692ff',
        highlight: '#3692ff',
      };
    }
    return copy;
  }

  public toEdge(edge: Edge): GraphEdge {
    const copy: GraphEdge = Object.assign({}, edge);
    copy.value = edge.weight;
    copy.title = `
    <div>
      <p>edge weight: ${Math.round(copy.weight)}</p>
    </div>
    `;
    return copy;
  }

  public repaint(): void {
    const updateList: GraphNode[] = this.nodes.map((node) => {
      let color;
      if (this.props.shareNodes) {
        this.props.shareNodes.includes(node.name)
          ? (color = {
              background: 'yellow',
              border: '#3f83d4',
              hover: '#ffdd00',
              highlight: '#ffdd00',
            })
          : (color = {
              background: '#8DC1FF',
              border: '#3f83d4',
              hover: '#3692ff',
              highlight: '#3692ff',
            });
      } else {
        color = {
          background: '#8DC1FF',
          border: '#3f83d4',
          hover: '#3692ff',
          highlight: '#3692ff',
        };
      }
      return {
        id: node.id,
        label: node.name,
        title: `
            <div>
              <p>${node.name}</p>
              <p>weight: ${Math.round(node.weight)}</p>
              <p>連接節點數: ${node.degree}</p>
            </div>
          `,
        color,
        borderWidth: 1,
        hidden: false,
      } as any;
    });
    this.nodes.update(updateList);
    (this.network as Network).fit({
      nodes: this.nodes.map((node) => {
        return node.id.toString();
      }),
      animation: false,
    });
  }

  public paintSelectedProduct(): void {
    if (!_.isUndefined(this.props.selectedProduct)) {
      let id;
      this.props.nodes.forEach((node) => {
        if (node.name === this.props.selectedProduct[0]) {
          return (id = node.id);
        }
      });
      if (id !== undefined) {
        const selectedNode: GraphNode = {
          id,
          color: {
            background: 'black',
            border: '#3f83d4',
            hover: 'grey',
            highlight: 'black',
          },
        } as any;
        const connectedNodes = (this.network as Network).getConnectedNodes(
          selectedNode.id,
        );
        const updateList = this.nodes
          .map<GraphNode>((node) => {
            if (!connectedNodes.includes(node.id as any) && node.id !== selectedNode.id) {
              const background =
                this.props.shareNodes && this.props.shareNodes.includes(node.name)
                  ? '#ffffc9'
                  : '#D3E7FF';
              return {
                id: node.id,
                hidden: true,
              } as any;
            }
          })
          .filter((node) => node);
        updateList.push(selectedNode);
        this.nodes.update(updateList);
        (this.network as Network).focus(selectedNode.id, {
          scale: 0.6,
        });
      } else {
        const updateList = this.nodes
          .map<GraphNode>((node) => {
            const background =
              this.props.shareNodes && this.props.shareNodes.includes(node.name)
                ? '#ffffc9'
                : '#D3E7FF';
            return {
              id: node.id,
              color: {
                background,
                border: '#D3E7FF',
              },
              label: ' ',
            } as any;
          })
          .filter((node) => node);
        this.nodes.update(updateList);
      }
    }
  }

  public initializeGraph(): void {
    for (const node of this.props.nodes) {
      this.nodes.add(this.toNode(node));
    }

    for (const edge of this.props.edges) {
      this.edges.add(this.toEdge(edge));
    }

    if (this.graphRef.current) {
      this.network = new Network(
        this.graphRef.current,
        {
          nodes: this.nodes,
          edges: this.edges,
        },
        graphOption,
      );
    }
  }

  public render() {
    return <div id='pn-graph' style={{ zIndex: -1 }} ref={this.graphRef} />;
  }
}

export { GraphViewCompare };

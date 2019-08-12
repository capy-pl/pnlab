import React, { PureComponent } from 'react';
import { DataSet, EdgeOptions, Network, NodeOptions } from 'vis';
import { Edge, Node } from '../../PnApp/model/Report';

interface GraphNode extends Node, NodeOptions {
}

interface GraphEdge extends Edge, EdgeOptions {
}

const style = {
  height: '800px',
  width: '100%',
  margin: '0 auto',
};

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  showCommunity: boolean;
  selectedProduct?: string[];
  shareNodes?: string[];
}

export default class GraphViewCompare extends PureComponent<GraphProps, {}> {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  constructor(props: GraphProps) {
    super(props);
    this.graphRef = React.createRef();
  }

  public componentDidMount() {
    if (this.graphRef.current) {
      this.graphRef.current.style.height = this.getHeight();
    }
    this.initializeGraph();
  }

  public componentDidUpdate() {
    this.updateNodes();
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
    if (this.props.shareNodes.includes(node.name)) {
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

  public resetGraphColor(nodes) {
    const updateNodes = nodes.map((node) => {
      let color;
      if (this.props.shareNodes) {
        this.props.shareNodes.includes(node.name) ?
          color = {background: 'yellow', border: '#3f83d4', hover: '#ffdd00', highlight: '#ffdd00'} :
          color = {background: '#8DC1FF', border: '#3f83d4', hover: '#3692ff', highlight: '#3692ff'};
      } else {
        color = {background: '#8DC1FF', border: '#3f83d4', hover: '#3692ff', highlight: '#3692ff'};
      }
      return (
        {
          id: node.id,
          label: node.name,
          title: this.props.showCommunity ?
            `
              <div>
                <p>${node.name}</p>
                <p>community: ${node.community}</p>
                <p>weight: ${Math.round(node.weight)}</p>
                <p>連接節點數: ${node.degree}</p>
              </div>
            ` :
            `
              <div>
                <p>${node.name}</p>
                <p>weight: ${Math.round(node.weight)}</p>
                <p>連接節點數: ${node.degree}</p>
              </div>
            `,
          group: this.props.showCommunity ? node.community : undefined,
          color,
          borderWidth: (this.props.showCommunity && node.core) ? 5 : 1,
          hidden: false,
        }
      );
    });
    nodes.update(updateNodes);
  }

  public async updateNodes() {
    const nodes = this.network.body.data.nodes;

    if (this.props.showCommunity) {
      if (this.props.selectedProduct.length !== 0) {
        let group;
        nodes.forEach((node) => {
          if (this.props.selectedProduct[0] === node.name) {
            group = node.community;
          }
        });
        const updateSelectedCommunities = nodes.map((node) => {
          return (
            {
              id: node.id,
              label: node.name,
              group: node.community,
              title: `
                <div>
                  <p>${node.name}</p>
                  <p>community: ${node.community}</p>
                  <p>weight: ${Math.round(node.weight)}</p>
                  <p>連接節點數: ${node.degree}</p>
                </div>
              `,
              borderWidth: node.core ? 5 : 1,
              hidden: node.community !== group ? true : false,
            }
          );
        });
        nodes.update(updateSelectedCommunities);
      } else {
        this.resetGraphColor(nodes);
      }
    } else {
      this.resetGraphColor(nodes);
      const updateSelectGraph = [];
      if (this.props.selectedProduct.length !== 0) {
        // highlight node & show connected products
        let highlightNodes: number[] = [];
        nodes.forEach((node) => {
          if (this.props.selectedProduct[0] === node.name) {
            highlightNodes = this.network.getConnectedNodes(node.id);
            highlightNodes.push(node.id);
            updateSelectGraph.push(
              {
                id: node.id,
                color: {
                  background: 'black',
                  border: '#3f83d4',
                  hover: 'grey',
                  highlight: 'black',
                },
              },
            );
          }
        });
        nodes.forEach((node) => {
          let background;
          if (!highlightNodes.includes(node.id)) {
            // lighten the colors of unselected nodes
            background = this.props.shareNodes.includes(node.name) ? '#ffffc9' : '#D3E7FF';
            updateSelectGraph.push(
              {
                id: node.id,
                color: {
                  background,
                  border: '#D3E7FF',
                },
                label: ' ',
              },
            );
          }
        });
        nodes.update(updateSelectGraph);
      } else if (this.props.selectedProduct.length === 0) {
        this.resetGraphColor(nodes);
      }
    }
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
            scaling: {
              customScalingFunction: (min, max, total, value) => {
                if (max === min) {
                  return 0.03;
                } else {
                  const scale = 1 / (max - min);
                  return Math.max(0, (value - min) * scale);
                }
              },
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
              max: 100,
              min: 30,
            },
            shape: 'dot',
          },
          physics: {
            barnesHut: {
              springLength: 250,
              centralGravity: 0.1,
            },
            stabilization: true,
          },
          interaction: {
              hover: true,
              tooltipDelay: 100,
          },
        });
    }
  }

  public render() {
    return (
      <div className='pn-graph2' ref={this.graphRef} />
    );
  }
}

export {
  GraphViewCompare,
};

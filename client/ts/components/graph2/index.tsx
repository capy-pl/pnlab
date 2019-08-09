import React, { PureComponent, ReactText } from 'react';
import { DataSet, EdgeOptions, Network, NodeOptions } from 'vis';
import { Community, Edge, Node } from '../../PnApp/model/Report';

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
  selectedCommunities?: Community[];
  selectedProduct?: string[];
  shareNodes?: Node[];
}

export default class GraphView2 extends PureComponent<GraphProps, {}> {
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
    if (this.isSharedNodes(node)) {
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
    // copy.color = {
    //   color: '#3f83d4',
    //   highlight: '#8DC1FF',
    //   hover: '#8DC1FF',
    // };
    return copy;
  }

  public resetGraphColor(nodes, edges) {
    const updateNodes = nodes.map((node) => {
      let color;
      this.isSharedNodes(node) ?
        color = {background: 'yellow', border: '#3f83d4', hover: '#ffdd00', highlight: '#ffdd00'} :
        color = {background: '#8DC1FF', border: '#3f83d4', hover: '#3692ff', highlight: '#3692ff'};
      return (
        {
          id: node.id,
          label: node.name,
          title: `
            <div>
              <p>${node.name}</p>
              <p>weight: ${Math.round(node.weight)}</p>
              <p>連接節點數: ${node.degree}</p>
            </div>
          `,
          group: undefined,
          hidden: false,
          color,
          borderWidth: 1,
        }
      );
    });
    // const updateEdges = edges.map((edge) => {
    //   return (
    //     {
    //       from: edge.from,
    //       to: edge.to,
    //       color: {
    //         color: '#3f83d4',
    //         highlight: '#8DC1FF',
    //         hover: '#8DC1FF',
    //       },
    //     }
    //   );
    // });
    nodes.update(updateNodes);
    // edges.update(updateEdges);
  }

  public isSharedNodes(node: Node) {
    let isShared;
    if (this.props.shareNodes) {
      const shareNodesNames = this.props.shareNodes.map((shareNode) => {
        return shareNode.name;
      });
      isShared = shareNodesNames.includes(node.name) ? true : false;
    }
    return isShared;
  }

  public updateNodes() {
    const nodes = this.network.body.data.nodes;
    const edges = this.network.body.data.edges;

    if (this.props.showCommunity) {
      const communities = nodes.map((node) => {
        return ({
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
          hidden: false,
        });
      });
      nodes.update(communities);
      // const communityEdges = edges.map((edge) => {
      //   return (
      //     {
      //       from: edge.from,
      //       to: edge.to,
      //       // color: {
      //       //   inherit: true,
      //       // },
      //     }
      //   );
      // });
      // edges.update(communityEdges);
    } else {
      const updateSelectGraph = [];
      this.resetGraphColor(nodes, edges);
      if (this.props.selectedProduct.length !== 0) {
        // highlight node & show connected products
        let highlightNodes = [];
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
          // else {
          //   selectProduct.push(
          //     {
          //       id: node.id,
          //       color: {
          //         background: '#8DC1FF',
          //         border: '#3f83d4',
          //         hover: '#8DC1FF',
          //         highlight: '#8DC1FF',
          //       },
          //       label: node.name,
          //     },
          //   );
          // }
        });
        nodes.forEach((node) => {
          let background;
          let border;
          if (!highlightNodes.includes(node.id)) {
            // lighten the colors of unselected nodes
            if (this.isSharedNodes(node)) {
              background = '#ffffa8';
              border = '#D3E7FF';
            } else {
              background = '#D3E7FF';
              border = '#D3E7FF';
            }
            updateSelectGraph.push(
              {
                id: node.id,
                color: {
                  background,
                  border,
                },
                label: ' ',
              },
            );
          }
        });
        nodes.update(updateSelectGraph);
      } else if (this.props.selectedProduct.length === 0) {
        this.resetGraphColor(nodes, edges);
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
  GraphView2,
};

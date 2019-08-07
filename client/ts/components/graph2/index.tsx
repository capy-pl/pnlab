import React, { PureComponent } from 'react';
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
  searchItems?: [];
  shareNodes?: Node[];
}

export default class GraphView2 extends PureComponent<GraphProps, {}> {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  constructor(props: GraphProps) {
    super(props);
    this.graphRef = React.createRef();
    this.updateNodes = this.updateNodes.bind(this);
  }

  public componentDidMount() {
    // if (this.graphRef.current) {
    //   this.graphRef.current.style.height = this.getHeight();
    // }
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
    this.props.shareNodes.forEach((shareNode) => {
      if (node.name === shareNode.name) {
        copy.color = {background: 'yellow'};
      }
    });
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
    const shareNodesNames = this.props.shareNodes.map((node) => {
      return node.name;
    });
    const updateNodes = nodes.map((node) => {
      let color;
      (shareNodesNames.includes(node.name)) ?
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
    nodes.update(updateNodes);
  }

  public updateNodes() {
    const nodes = this.network.body.data.nodes;

    if (this.props.selectedCommunities !== undefined) {
      const communitiesIdList = this.props.selectedCommunities.map((community: Community) => {
        return (community.id);
      });
      const selectedCommunities = [];
      nodes.forEach((node) => {
        selectedCommunities.push({id: node.id, hidden: !communitiesIdList.includes(node.community) ? true : false});
      });
      nodes.update(selectedCommunities);
    } else if (this.props.showCommunity) {
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
    }

    const selectProduct = [];
    if (!this.props.showCommunity) {
      this.resetGraphColor(nodes);
      if (this.props.selectedProduct.length !== 0) {
        // highlight node & show connected products
        let connectedNodes;
        nodes.forEach((node) => {
          if (this.props.selectedProduct[0] === node.name) {
            connectedNodes = this.network.getConnectedNodes(node.id);
            connectedNodes.push(node.id);
            selectProduct.push(
              {
                id: node.id,
                color: {
                  background: 'orange',
                  border: '#3f83d4',
                  hover: 'orange',
                  highlight: 'orange',
                },
              },
            );
          } else {
            selectProduct.push(
              {
                id: node.id,
                color: {
                  background: '#8DC1FF',
                  border: '#3f83d4',
                  hover: '#8DC1FF',
                  highlight: '#8DC1FF',
                },
                label: node.name,
              },
            );
          }
        });
        nodes.forEach((node) => {
          if (connectedNodes) {
            if (!connectedNodes.includes(node.id)) {
              // lighten the colors of unselected nodes
              selectProduct.push(
                {
                  id: node.id,
                  color: {
                    background: '#D3E7FF',
                    border: '#D3E7FF',
                  },
                  label: ' ',
                },
              );
            }
          } else {
            selectProduct.push(
              {
                id: node.id,
                color: {
                  background: '#D3E7FF',
                  border: '#D3E7FF',
                },
                label: ' ',
              },
            );
          }
        });
        nodes.update(selectProduct);
      } else if (this.props.selectedProduct.length === 0) {
        this.resetGraphColor(nodes);
      }
    }
    if (this.props.searchItems) {
      const searchItems = [];
      if (!this.props.showCommunity) {
        nodes.forEach((node) => {
          this.props.searchItems.forEach((item) => {
            if (node.name === item) {
              searchItems.push (
                {
                  id: node.id,
                  color: {
                    background: 'yellow',
                    hover: {
                      background: 'orange',
                    },
                    highlight: 'orange',
                  },
                },
              );
            }
          });
        });
      } else {
        nodes.forEach((node) => {
          this.props.searchItems.forEach((item) => {
            if (node.name === item) {
              searchItems.push (
                {
                  id: node.id,
                  borderWidth: 50,
                  // color: {
                  //   background: 'yellow',
                  //   hover: {
                  //     background: 'orange',
                  //   },
                  //   highlight: 'orange',
                  // },
                },
              );
            }
          });
        });
      }
      nodes.update(searchItems);
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
      <div className='pn-graph2' style={style} ref={this.graphRef} />
    );
  }
}

export {
  GraphView2,
};

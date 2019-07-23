import React, { PureComponent } from 'react';
import { DataSet, EdgeOptions, Network, NodeOptions } from 'vis';
import { Community, Edge, Node } from '../../PnApp/Model/Report';
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
  showCommunity?: boolean;
  selectedCommunities?: [];
  selectedProduct?: Node[];
  searchItems?: any;
}

export default class GraphView extends PureComponent<GraphProps, {}> {
  public graphRef: React.RefObject<HTMLDivElement>;
  public network?: Network;
  constructor(props: GraphProps) {
    super(props);
    this.graphRef = React.createRef();
    this.updateNodes = this.updateNodes.bind(this);
  }

  public componentDidMount() {
    this.initializeGraph();
  }

  public componentDidUpdate() {
    // this.initializeGraph();

    // // 自己寫一個update的function在這裡
    this.updateNodes();
  }

  public toNode(node: Node): GraphNode {
    const copy: GraphNode = Object.assign({}, node);
    copy.label = node.name;
    copy.value = node.degree;
    copy.title = `
    <div>
      <p>${copy.name}</p>
      <p>連接節點數: ${copy.degree}</p>
    </div>
    `;
    if (this.props.showCommunity) {
      if (node.core) {
        copy.borderWidth = 5;
      }
    }
    return copy;
  }

  public toEdge(edge: Edge): GraphEdge {
    const copy: GraphEdge = Object.assign({}, edge);
    copy.value = edge.weight;
    copy.title = `
    <div>
      <p>weight: ${copy.weight}</p>
    </div>
    `;
    return copy;
  }

  public updateNodes() {
    console.log(this.network);
    // console.log(this.network.body.data.nodes.get(1));
    const nodes = this.network.body.data.nodes;
    // const edges = this.network.body.data.edges;
    if (this.props.showCommunity) {
      const communities = nodes.map((node) => {
        return ({
          id: node.id,
          group: node.community,
          title: `
            <div>
              <p>${node.name}</p>
              <p>community: ${node.community}</p>
              <p>連接節點數: ${node.degree}</p>
            </div>
          `,
        });
      });
      nodes.update(communities);
      if (this.props.selectedCommunities.length !== 0) {
        const communitiesIdList = this.props.selectedCommunities.map((community: Community) => {
          return (community.id);
        });
        const selectCommunities = [];
        nodes.forEach((node) => {
          if (!communitiesIdList.includes(node.community)) {
            selectCommunities.push({id: node.id, hidden: true});
          } else {
            selectCommunities.push({id: node.id, hidden: false});
          }
        });
        nodes.update(selectCommunities);
      } else {
        const coloredAll = nodes.map((node) => {
          return {id: node.id, hidden: false};
        });
        nodes.update(coloredAll);
      }
    } else {
      const productNetwork = nodes.map((node) => {
        return (
          {
            id: node.id,
            title: `
              <div>
                <p>${node.name}</p>
                <p>連接節點數: ${node.degree}</p>
              </div>
            `,
            group: undefined,
            color: '#69bcd5',
          }
        );
      });
      nodes.update(productNetwork);
      const selectProduct = [];
      if (this.props.selectedProduct.length !== 0) {
        nodes.forEach((node) => {
          if (this.props.selectedProduct[0].name === node.name) {
            selectProduct.push (
              {
                id: node.id,
                color: {
                  background: 'orange',
                  hover: {
                    background: 'yellow',
                  },
                  highlight: {
                    background: 'yellow',
                  },
                },
              },
            );
          }
        });
        nodes.update(selectProduct);
        console.log(selectProduct);
        console.log(this.network.body.data.nodes);
      }
      if (this.props.searchItems !== undefined) {
        const searchItems = [];
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
                  },
                },
              );
            }
          });
        });
        nodes.update(searchItems);
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
                  return Math.max(0,(value - min) * scale);
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
              // navigationButtons: true,
              // multiselect: true
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

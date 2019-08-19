import React, { PureComponent } from 'react';
import { Grid, Icon, Table } from 'semantic-ui-react';
import { Window } from 'Component/';
import Report, { Node } from '../../../../PnApp/model/Report';

interface ConnectedNode {
  name: string;
  id: number;
  edgeWeight: number;
}

interface SingleProductComparePortalProps {
  show: boolean;
  reportA?: Report;
  reportB?: Report;
  onClose: () => void;
  selectedProduct?: string[];
}

interface SingleProductComparePortalState {
  selectedProduct?: string;
}


export default class SingleProductCompareWindow extends PureComponent<
  SingleProductComparePortalProps,
  SingleProductComparePortalState
  > {
  constructor(props: SingleProductComparePortalProps) {
    super(props);
  }

  public getTableRow = (
    connectedNodes: ConnectedNode[],
    shareProducts: ConnectedNode[],
    leftNodes: ConnectedNode[] = [],
  ) => {
    const tableRow = connectedNodes.map((node, index) => {
      let style;
      let variation;
      let arrow;
      for (const product of shareProducts) {
        if (product.name === node.name) {
          style = { backgroundColor: '#e8f7ff' };
        }
      }
      if (leftNodes.length !== 0) {
        const nodeNames = connectedNodes.map((node) => {
          return node.name;
        });
        const leftNodeNames = leftNodes.map((node) => {
          return node.name;
        });
        if (!(leftNodeNames.indexOf(node.name) < 0)) {
          variation = leftNodeNames.indexOf(node.name) - nodeNames.indexOf(node.name);
        }
        switch (variation !== '') {
          case variation < 0:
            arrow = (
              <React.Fragment>
                <Icon color='red' name='long arrow alternate down' />
                <span style={{ color: 'red' }}>{Math.abs(variation)}</span>
              </React.Fragment>
            );
            break;
          case variation > 0:
            arrow = (
              <React.Fragment>
                <Icon color='green' name='long arrow alternate up' />
                <span style={{ color: 'green' }}>{Math.abs(variation)}</span>
              </React.Fragment>
            );
            break;
          case variation === 0:
            arrow = (
              <React.Fragment>
                <Icon color='blue' name='minus' />
                <span style={{ color: 'blue' }} />
              </React.Fragment>
            );
            break;
          default:
            arrow = <React.Fragment />;
        }
      }
      return (
        <Table.Row key={node.id} style={style}>
          <Table.Cell>{index + 1}&nbsp;&nbsp;&nbsp;{arrow}</Table.Cell>
          <Table.Cell>{node.name}</Table.Cell>
          <Table.Cell>{Math.round(node.edgeWeight)}</Table.Cell>
        </Table.Row>
      );
    });
    return tableRow;
  };

  public getTable = (name: string, tableRow: JSX.Element[]) => {
    return (
      <Table celled padded color='teal'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名次</Table.HeaderCell>
            <Table.HeaderCell>圖{name}連結產品</Table.HeaderCell>
            <Table.HeaderCell>權重</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{tableRow}</Table.Body>
      </Table>
    );
  };

  public getConnected;

  public getConnectedProduct(selectedProduct: string) {
    let selectedNodeA: Node;
    let selectedNodeB: Node;
    const connectedNodesA: ConnectedNode[] = [];
    const connectedNodesB: ConnectedNode[] = [];
    const shareProducts: ConnectedNode[] = [];
    for (const node of this.props.reportA.nodes) {
      if (node.name === selectedProduct) {
        selectedNodeA = node;
        for (const edge of this.props.reportA.edges) {
          let connectedProductID;
          let connectedNode;
          if (edge.from === selectedNodeA.id || edge.to === selectedNodeA.id) {
            connectedProductID = edge.from !== selectedNodeA.id ? edge.from : edge.to;
            for (const nodeA of this.props.reportA.nodes) {
              if (nodeA.id === connectedProductID) {
                connectedNode = nodeA;
                break;
              }
            }
            connectedNodesA.push({
              name: connectedNode.name,
              id: connectedNode.id,
              edgeWeight: edge.weight,
            });
          }
        }
        break;
      }
    }
    for (const node of this.props.reportB.nodes) {
      if (node.name === selectedProduct) {
        selectedNodeB = node;
        for (const edge of this.props.reportB.edges) {
          let connectedProductID;
          let connectedNode;
          if (edge.from === selectedNodeB.id || edge.to === selectedNodeB.id) {
            connectedProductID = edge.from !== selectedNodeB.id ? edge.from : edge.to;
            for (const nodeB of this.props.reportB.nodes) {
              if (nodeB.id === connectedProductID) {
                connectedNode = nodeB;
                break;
              }
            }
            connectedNodesB.push({
              name: connectedNode.name,
              id: connectedNode.id,
              edgeWeight: edge.weight,
            });
          }
        }
        break;
      }
    }
    connectedNodesA.sort((a, b) => {
      return b.edgeWeight - a.edgeWeight;
    });
    connectedNodesB.sort((a, b) => {
      return b.edgeWeight - a.edgeWeight;
    });
    for (const nodeA of connectedNodesA) {
      for (const nodeB of connectedNodesB) {
        if (nodeA.name === nodeB.name) {
          shareProducts.push(nodeA);
        }
      }
    }
    return { connectedNodesA, connectedNodesB, shareProducts };
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    } else {
      if (this.props.selectedProduct) {
        const selectedProductName = this.props.selectedProduct[0];
        const {
          connectedNodesA,
          connectedNodesB,
          shareProducts,
        } = this.getConnectedProduct(this.props.selectedProduct[0]);
        const tableRowA = this.getTableRow(connectedNodesA, shareProducts);
        const tableRowB = this.getTableRow(connectedNodesB, shareProducts, connectedNodesA);
        const tableA = this.getTable('左', tableRowA);
        const tableB = this.getTable('右', tableRowB);
        const share = shareProducts.map((node) => {
          return (
            <Table.Row key={node.name}>
              <Table.Cell>{node.name}</Table.Cell>
            </Table.Row>
          );
        });
        return (
          <Window
            title={`【${selectedProductName}】連結產品比較`}
            defaultX={260}
            onClickX={this.props.onClose}
            defaultHeight={600}
            defaultWidth={1200}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width={6}>
                  <p>圖左連結產品數： {connectedNodesA.length}</p>
                  {tableA}
                </Grid.Column>

                <Grid.Column width={4}>
                  <p>共同連結數： {shareProducts.length}</p>
                  <Table celled padded color='yellow'>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>共同產品</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>{share}</Table.Body>
                  </Table>
                </Grid.Column>

                <Grid.Column width={6}>
                  <p>圖右連結產品數： {connectedNodesB.length}</p>
                  {tableB}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Window>
        );
      } else {
        return <React.Fragment />
      }
    }
  }
}

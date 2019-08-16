import React, { PureComponent } from 'react';
import { Button, Grid, Header, Portal, Segment, Table } from 'semantic-ui-react';
import Report, { Node } from '../../PnApp/model/Report';

interface ConnectedNode {
  name: string;
  id: number;
  edgeWeight: number;
}

interface SingleProductComparePortalProps {
  open: boolean;
  reportA?: Report;
  reportB?: Report;
  onClose: () => void;
  selectedProduct?: string[];
}

interface SingleProductComparePortalState {
  selectedProduct?: string;
}

const segmentStyle = {
  position: 'fixed',
  left: '15%',
  top: '18%',
  zIndex: 1000,
  overflow: 'auto',
  maxHeight: '75%',
  width: '70%',
  textAlign: 'center',
};

export default class SingleProductComparePortal
extends PureComponent<SingleProductComparePortalProps, SingleProductComparePortalState> {
  constructor(props: SingleProductComparePortalProps) {
    super(props);
  }

  public getTableRow = (connectedNodes: ConnectedNode[], shareProducts: ConnectedNode[]) => {
    const tableRow = connectedNodes.map((node, index) => {
      let style;
      for (const product of shareProducts) {
        if (product.name === node.name) {
          style = {backgroundColor: '#e8f7ff'};
        }
      }
      return (
        <Table.Row key={node.id} style={style}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{node.name}</Table.Cell>
          <Table.Cell>{Math.round(node.edgeWeight)}</Table.Cell>
        </Table.Row>
      );
    });
    return tableRow;
  }

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

        <Table.Body>
          {tableRow}
        </Table.Body>
      </Table>
    );
  }

  public getConnected

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
            connectedProductID = (edge.from !== selectedNodeA.id) ? edge.from : edge.to;
            for (const nodeA of this.props.reportA.nodes) {
              if (nodeA.id === connectedProductID) {
                connectedNode = nodeA;
                break;
              }
            }
            connectedNodesA.push(
              {
                name: connectedNode.name,
                id: connectedNode.id,
                edgeWeight: edge.weight,
              },
            );
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
            connectedProductID = (edge.from !== selectedNodeB.id) ? edge.from : edge.to;
            for (const nodeB of this.props.reportB.nodes) {
              if (nodeB.id === connectedProductID) {
                connectedNode = nodeB;
                break;
              }
            }
            connectedNodesB.push(
              {
                name: connectedNode.name,
                id: connectedNode.id,
                edgeWeight: edge.weight,
              },
            );
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
    return {connectedNodesA, connectedNodesB, shareProducts};
  }

  public render() {
    if (this.props.selectedProduct) {
      const selectedProductName = <span>{this.props.selectedProduct}</span>;
      const {connectedNodesA, connectedNodesB, shareProducts} = this.getConnectedProduct(this.props.selectedProduct[0]);
      const tableRowA = this.getTableRow(connectedNodesA, shareProducts);
      const tableRowB = this.getTableRow(connectedNodesB, shareProducts);
      const tableA = this.getTable('左', tableRowA);
      const tableB = this.getTable('右', tableRowB);
      const share = shareProducts.map((node) => {
        return (
          <Table.Row key={node.name} >
            <Table.Cell>{node.name}</Table.Cell>
          </Table.Row>
        );
      });
      return (
        <Portal onClose={this.props.onClose} open={this.props.open}>
          <Segment
            style={segmentStyle}
          >
            <Header style={{display: 'inline'}}>【{selectedProductName}】連結產品比較</Header>
            <Button
              content='關閉'
              negative
              onClick={this.props.onClose}
              style={{position: 'absolute', right: '10px'}}
            />
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
                    <Table.Body>
                      {share}
                    </Table.Body>
                  </Table>
                </Grid.Column>

                <Grid.Column width={6}>
                  <p>圖右連結產品數： {connectedNodesB.length}</p>
                  {tableB}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Portal>
      );
    }
  }
}

import React, { PureComponent } from 'react';
import { Grid, Icon, Table } from 'semantic-ui-react';
import { Window } from 'Component/';
import Report, { Node } from '../../../../PnApp/model/Report';

interface ConnectedNode {
  name: string;
  id: number;
  edgeWeight: number;
}

interface CompareSingleProductWindowProps {
  show: boolean;
  reportA?: Report;
  reportB?: Report;
  onClose: () => void;
  selectedProduct?: string[];
}

export default class CompareSingleProductWindow extends PureComponent<
  CompareSingleProductWindowProps,
  {}
  > {
  public getTableRow = (
    connectedNodes: ConnectedNode[],
    shareProducts: ConnectedNode[],
    leftHandSideNodes: ConnectedNode[] = [],
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
      if (leftHandSideNodes.length !== 0) {
        const nodeNames = connectedNodes.map(node => node.name);
        const leftNodeNames = leftHandSideNodes.map(node => node.name);
        if (!(leftNodeNames.indexOf(node.name) < 0)) {
          variation = leftNodeNames.indexOf(node.name) - nodeNames.indexOf(node.name);
        }
        if (variation < 0) {
          arrow = (
            <React.Fragment>
              <Icon color='red' name='long arrow alternate down' />
              <span style={{ color: 'red' }}>{Math.abs(variation)}</span>
            </React.Fragment>
          );
        } else if (variation > 0) {
          arrow = (
            <React.Fragment>
              <Icon color='green' name='long arrow alternate up' />
              <span style={{ color: 'green' }}>{Math.abs(variation)}</span>
            </React.Fragment>
          );
        } else if (variation === 0) {
          arrow = (
            <React.Fragment>
              <Icon color='blue' name='minus' />
              <span style={{ color: 'blue' }} />
            </React.Fragment>
          );
        } else {
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

  public getTable =
    (
      tableName: string,
      nodes: ConnectedNode[],
      shareProducts: ConnectedNode[],
      leftHandSideNodes?: ConnectedNode[]
    ) => {
      const tableRow = this.getTableRow(nodes, shareProducts, leftHandSideNodes ? leftHandSideNodes : []);
      return (
        <Table celled padded color='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>名次</Table.HeaderCell>
              <Table.HeaderCell>圖{tableName}連結產品</Table.HeaderCell>
              <Table.HeaderCell>權重</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{tableRow}</Table.Body>
        </Table>
      );
    };

  public getOneSideConnectedNodes(selectedProduct: string, report: Report) {
    let selectedNode: Node;
    const connectedNodes: ConnectedNode[] = [];
    for (const node of report.nodes) {
      if (node.name === selectedProduct) {
        selectedNode = node;
        for (const edge of report.edges) {
          let connectedProductID;
          let connectedNode;
          if (edge.from === selectedNode.id || edge.to === selectedNode.id) {
            connectedProductID = edge.from !== selectedNode.id ? edge.from : edge.to;
            for (const nodeA of report.nodes) {
              if (nodeA.id === connectedProductID) {
                connectedNode = nodeA;
                break;
              }
            }
            connectedNodes.push({
              name: connectedNode.name,
              id: connectedNode.id,
              edgeWeight: edge.weight,
            });
          }
        }
        break;
      }
    }
    return connectedNodes;
  }

  public getConnectedInfo(selectedProduct: string) {
    const connectedNodesA = this.getOneSideConnectedNodes(selectedProduct, this.props.reportA);
    const connectedNodesB = this.getOneSideConnectedNodes(selectedProduct, this.props.reportB);
    const shareProducts: ConnectedNode[] = [];

    connectedNodesA.sort((a, b) => b.edgeWeight - a.edgeWeight);
    connectedNodesB.sort((a, b) => b.edgeWeight - a.edgeWeight);
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
        } = this.getConnectedInfo(this.props.selectedProduct[0]);
        const tableA = this.getTable('左', connectedNodesA, shareProducts);
        const tableB = this.getTable('右', connectedNodesB, shareProducts, connectedNodesA);
        const share = shareProducts.map((node) => {
          return (
            <Table.Row key={node.name} style={{ backgroundColor: '#e8f7ff' }}>
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

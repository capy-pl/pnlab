import React, { PureComponent } from 'react';
import { Grid, Icon, Message, Table, Header } from 'semantic-ui-react';
import { Window } from 'Component/';
import Report, { Node } from '../../../../PnApp/model/Report';
import { Analysis } from 'client/ts/PnApp/model';

interface ConnectedNode {
  name: string;
  id: number;
  edgeWeight: number;
}

interface CompareSingleProductWindowProps {
  show: boolean;
  analysisA: Analysis;
  analysisB: Analysis;
  onClose: () => void;
  selectedProduct?: string[];
}

export default class CompareSingleProductWindow extends PureComponent<
  CompareSingleProductWindowProps,
  {}
  > {
  public getTableBody(
    connectedNodes: ConnectedNode[],
    shareProducts: ConnectedNode[],
    leftHandSideNodes: ConnectedNode[] = [],
  ) {
    const leftNodesMap = new Map<string, number>();
    const rightNodesMap = new Map<string, number>();
    if (leftHandSideNodes.length !== 0) {
      leftHandSideNodes.forEach((node, index) => {
        leftNodesMap.set(node.name, index);
      })
      connectedNodes.forEach((node, index) => {
        rightNodesMap.set(node.name, index);
      })
    }
    const tableBody = connectedNodes.map((node, index) => {
      let style;
      let variation;
      let arrow;
      for (const product of shareProducts) {
        if (product.name === node.name) {
          style = { backgroundColor: '#e8f7ff' };
        }
      }
      if (leftHandSideNodes.length !== 0) {
        variation = leftNodesMap.get(node.name) - rightNodesMap.get(node.name);
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
    return tableBody;
  }

  public getTable(
    tableName: string,
    nodes: ConnectedNode[],
    shareProducts: ConnectedNode[],
    leftHandSideNodes?: ConnectedNode[]
  ) {
    const tableBody = this.getTableBody(nodes, shareProducts, leftHandSideNodes ? leftHandSideNodes : []);
    return (
      <React.Fragment>
        <Header>【{tableName}】</Header>
        <Table celled padded color='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>名次</Table.HeaderCell>
              <Table.HeaderCell>連結產品列表（產品數：{nodes.length}）</Table.HeaderCell>
              <Table.HeaderCell>權重</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{tableBody}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }

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
    const connectedNodesA = this.getOneSideConnectedNodes(selectedProduct, this.props.analysisA.report);
    const connectedNodesB = this.getOneSideConnectedNodes(selectedProduct, this.props.analysisB.report);
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

  public getShareProductsTable(shareProducts: ConnectedNode[]) {
    const share = shareProducts.map((node) => {
      return (
        <Table.Row key={node.name} style={{ backgroundColor: '#e8f7ff' }}>
          <Table.Cell>{node.name}</Table.Cell>
        </Table.Row>
      );
    });
    return (
      <React.Fragment>
        <Header>【共同連結產品】</Header>
        <Table celled padded color='yellow'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>共同產品（產品數：{shareProducts.length}）</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{share}</Table.Body>
        </Table>
      </React.Fragment>
    )
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
        const tableA = this.getTable(this.props.analysisA.title, connectedNodesA, shareProducts);
        const tableB = this.getTable(this.props.analysisB.title, connectedNodesB, shareProducts, connectedNodesA);
        const shareTable = this.getShareProductsTable(shareProducts);
        return (
          <Window
            title={`【${selectedProductName}】連結產品比較`}
            defaultX={260}
            onClickX={this.props.onClose}
            defaultHeight={600}
            defaultWidth={1200}
          >
            <Message info>
              <p>藍色底色為共同產品</p>
            </Message>
            <Grid>
              <Grid.Row>
                <Grid.Column width={6}>
                  {tableA}
                </Grid.Column>

                <Grid.Column width={4}>
                  {shareTable}
                </Grid.Column>

                <Grid.Column width={6}>
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

import React from 'react';
import { Table } from 'semantic-ui-react';

import { Report } from '../../../PnApp/model';
import { SimpleNode } from '../../../PnApp/model/Report';

interface Props {
  selectedProduct?: number;
  model: Report;
  back?: () => void;
}

export default class DirectRelationTable extends React.PureComponent<Props> {
  public getCells(): JSX.Element[] {
    const connectedProductList = this.getConnectedProductList();
    return connectedProductList.map((product, index) => (
      <Table.Row key={product.id} textAlign='center'>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{product.name}</Table.Cell>
        <Table.Cell textAlign='center'>{Math.round(product.weight)}</Table.Cell>
      </Table.Row>
    ));
  }

  public getConnectedProductList(): SimpleNode[] {
    let connectedProductList: SimpleNode[] = [];
    if (this.props.selectedProduct !== undefined) {
      connectedProductList = this.props.model.graph
        .getConnectedNodes(this.props.selectedProduct)
        .map((number) => {
          return this.props.model.graph.getNode(number);
        })
        .map((node) => ({
          id: node.id,
          name: node.name as string,
          weight: node.getDestinationWeight(this.props
            .selectedProduct as number) as number, // connected edge weight
        }));
      connectedProductList.sort((a, b) => {
        return b.weight - a.weight;
      });
    }
    return connectedProductList;
  }

  public render() {
    const back =
      typeof this.props.back === 'undefined' ? (
        <React.Fragment />
      ) : (
        <a onClick={this.props.back}> &lt;&lt; 返回</a>
      );
    return (
      <React.Fragment>
        {back}
        <Table>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell>名次</Table.HeaderCell>
              <Table.HeaderCell>連結產品</Table.HeaderCell>
              <Table.HeaderCell>連結</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.getCells()}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

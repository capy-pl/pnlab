import React from 'react';
import { Table } from 'semantic-ui-react';

import { isNumber } from 'lodash';
import { Report } from '../../../PnApp/model';
import { SimpleNode } from '../../../PnApp/model/Report';

interface Props {
  selectedProduct?: number;
  model: Report;
  back?: () => void;
  searchItem?: number;
}

export default class DirectRelationTalbe extends React.PureComponent<Props> {
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
    const product = isNumber(this.props.selectedProduct) ? this.props.selectedProduct : this.props.searchItem
    if (isNumber(product)) {
      connectedProductList = this.props.model.graph
        .getConnectedNodes(product)
        .map((number) => {
          return this.props.model.graph.getNode(number);
        })
        .map((node) => ({
          id: node.id,
          name: node.name as string,
          weight: node.getDestinationWeight(product as number) as number, // connected edge weight
        }));
      connectedProductList.sort((a, b) => {
        return b.weight - a.weight;
      });
    }
    return connectedProductList;
  }

  public render() {
    return (
      <React.Fragment>
        {isNumber(this.props.searchItem) ? <React.Fragment /> : <a onClick={this.props.back}> &lt;&lt; 返回</a>}
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

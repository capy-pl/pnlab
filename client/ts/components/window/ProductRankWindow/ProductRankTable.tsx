import React from 'react';
import { Message, Table } from 'semantic-ui-react';

import { SimpleNode } from '../../../PnApp/model/Report';

interface Props {
  productList: SimpleNode[];
  selectCell: (id: number) => () => void;
}

export default class ProductRankTable extends React.PureComponent<Props> {
  public getCells(): JSX.Element[] {
    return this.props.productList.map((product, index) => (
      <Table.Row
        key={product.id}
        onClick={this.props.selectCell(product.id)}
        textAlign='center'
      >
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{product.name}</Table.Cell>
        <Table.Cell>{Math.round(product.weight)}</Table.Cell>
        <Table.Cell>{Math.round(product.weight)}</Table.Cell>
      </Table.Row>
    ));
  }

  public render() {
    return (
      <React.Fragment>
        <Message info content='點擊產品列可顯示單一產品' />
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>名次</Table.HeaderCell>
              <Table.HeaderCell>產品名稱</Table.HeaderCell>
              <Table.HeaderCell>產品權重</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.getCells()}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

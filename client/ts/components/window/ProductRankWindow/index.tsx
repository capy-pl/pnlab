import React, { PureComponent } from 'react';
import { Message, Table } from 'semantic-ui-react';

import { Window } from 'Component/';
import Report, { SimpleNode } from '../../../PnApp/model/Report';

interface Props {
  close: () => void;
  show: boolean;
  productList: SimpleNode[];
  model: Report;
  selectProduct: (id?: number) => void;
  selectedProduct?: number;
  back: () => void;
  fromSearch: boolean;
}

export default class ProductRankWindow extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.selectCell = this.selectCell.bind(this);
  }

  public selectCell(id: number): () => void {
    return () => {
      this.props.selectProduct(id);
    };
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
          weight: node.weight, // connected edge weight
        }));
      connectedProductList.sort((a, b) => {
        return b.weight - a.weight;
      });
    }
    return connectedProductList;
  }

  public getCells(): JSX.Element[] {
    if (this.props.selectedProduct === undefined) {
      return this.props.productList.map((product, index) => (
        <Table.Row
          key={product.id}
          onClick={this.selectCell(product.id)}
          textAlign='center'
        >
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{product.name}</Table.Cell>
          <Table.Cell>{Math.round(product.weight)}</Table.Cell>
        </Table.Row>
      ));
    } else {
      const connectedProductList = this.getConnectedProductList();
      return connectedProductList.map((product, index) => (
        <Table.Row key={product.id} textAlign='center'>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{product.name}</Table.Cell>
          <Table.Cell>{Math.round(product.weight)}</Table.Cell>
        </Table.Row>
      ));
    }
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    let selectedProduct, top, tableHeaderName, tableHeaderWeight;
    if (this.props.fromSearch === true) {
      selectedProduct = this.props.productList.find(
        (product) => product.id === this.props.selectedProduct,
      );
      top = <React.Fragment />;
      tableHeaderName = '連結產品';
      tableHeaderWeight = '連結';
    } else if (this.props.selectedProduct !== undefined) {
      selectedProduct = this.props.productList.find(
        (product) => product.id === this.props.selectedProduct,
      );
      top = <a onClick={this.props.back}> &lt;&lt; 返回</a>;
      tableHeaderName = '連結產品';
      tableHeaderWeight = '連結';
    } else {
      selectedProduct = undefined;
      top = <Message info content='點擊產品列可顯示單一產品' />;
      tableHeaderName = '產品';
      tableHeaderWeight = '產品';
    }
    return (
      <Window
        title={selectedProduct ? `【${selectedProduct.name}】連結產品排名` : '產品排名'}
        defaultX={240}
        defaultWidth={450}
        defaultHeight={450}
        onClickX={this.props.close}
      >
        <React.Fragment>
          {top}
          <Table selectable={this.props.selectedProduct === undefined}>
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell>名次</Table.HeaderCell>
                <Table.HeaderCell>{tableHeaderName}名稱</Table.HeaderCell>
                <Table.HeaderCell>{tableHeaderWeight}權重</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.getCells()}</Table.Body>
          </Table>
        </React.Fragment>
      </Window>
    );
  }
}

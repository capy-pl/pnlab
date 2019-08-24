import { isUndefined } from 'lodash';
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
}

export default class ProductRankWindow extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.selectCell = this.selectCell.bind(this);
  }

  public selectCell(id: number): () => void {
    return () => {
      if (id === this.props.selectedProduct) {
        this.props.selectProduct(undefined);
      } else {
        this.props.selectProduct(id);
      }
    };
  }

  public getCells(): JSX.Element[] {
    return this.props.productList.map((product) => (
      <Table.Row
        key={product.id}
        positive={this.isSelected(product.id)}
        onClick={this.selectCell(product.id)}
      >
        <Table.Cell>{product.name}</Table.Cell>
        <Table.Cell>{product.weight}</Table.Cell>
      </Table.Row>
    ));
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    return (
      <Window
        title='產品排名'
        defaultX={240}
        defaultWidth={450}
        defaultHeight={450}
        onClickX={this.props.close}
      >
        <React.Fragment>
          <Message info content='點擊產品列可顯示單一產品' />
          <Table selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign='center'>產品名稱</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>產品權重</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.getCells()}</Table.Body>
          </Table>
        </React.Fragment>
      </Window>
    );
  }

  private isSelected(id: number): boolean {
    return !isUndefined(this.props.selectedProduct) && this.props.selectedProduct === id;
  }
}

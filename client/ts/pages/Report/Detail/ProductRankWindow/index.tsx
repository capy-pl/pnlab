import { isNumber, isUndefined} from 'lodash';
import React, { PureComponent } from 'react';
import { Message, Table } from 'semantic-ui-react';

import { Window } from 'Component/';
import { SimpleNode } from '../../../../PnApp/model/Report';

interface Props {
  close: () => void;
  show: boolean;
  productList: SimpleNode[];
  selectProduct: (id?: number) => void;
}

interface State {
  selectedIndex?: number;
}

export default class ProductRankWindow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};

    this.selectCell = this.selectCell.bind(this);
  }

  public selectCell(id: number): () => void {
    return () => {
      this.setState({
        selectedIndex: id !== this.state.selectedIndex ? id : undefined,
      }, () => {
        this.props.selectProduct(this.state.selectedIndex);
      });
    };
  }

  public getCells(): JSX.Element[] {
    return this.props.productList.map((product) => (
      <Table.Row
        key={product.id}
        positive={this.isSelected(product.id)}
        onClick={this.selectCell(product.id)}
      >
        <Table.Cell>
          {product.name}
        </Table.Cell>
        <Table.Cell>
          {product.weight}
        </Table.Cell>
      </Table.Row>
    ));
  }

  public render() {
    return (
      <Window
        title='產品排名'
        defaultX={240}
        onClickX={this.props.close}
        show={this.props.show}
      >
        <React.Fragment>
          <Message info content='點擊產品列可顯示單一產品' />
          <Table
            selectable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign='center'>產品名稱</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>產品權重</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.getCells()}
            </Table.Body>
          </Table>
        </React.Fragment>
      </Window>
    );
  }

  private isSelected(id: number): boolean {
    return (!isUndefined(this.state.selectedIndex)
      && (this.state.selectedIndex === id)
    );
  }
}

import React, { PureComponent } from 'react';
import { isNumber } from 'lodash';

import { Window } from 'Component/';
import Report, { SimpleNode } from '../../../PnApp/model/Report';
import ProductRankTable from './ProductRankTable';
import SelectedProductTable from './SelectedProductTable';

interface Props {
  close: () => void;
  show: boolean;
  productList: SimpleNode[];
  model: Report;
  selectProduct: (id?: number) => void;
  selectedProduct?: number;
  back: () => void;
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

  get title(): string {
    if (!this.props.selectedProduct) {
      return '產品排名';
    } else {
      return this.props.model.graph.getNode(this.props.selectedProduct).name as string;
    }
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    let content: JSX.Element;
    if (!isNumber(this.props.selectedProduct)) {
      content = (
        <ProductRankTable
          productList={this.props.productList}
          selectCell={this.selectCell}
        />
      );
    } else {
      content = (
        <SelectedProductTable
          model={this.props.model}
          selectedProduct={this.props.selectedProduct}
          back={this.props.back}
        />
      );
    }

    return (
      <Window
        title={this.title}
        defaultX={240}
        defaultWidth={450}
        defaultHeight={450}
        onClickX={this.props.close}
      >
        {content}
      </Window>
    );
  }
}

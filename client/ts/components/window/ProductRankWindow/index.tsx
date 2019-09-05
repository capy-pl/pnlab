import React, { PureComponent } from 'react';
import { isNumber } from 'lodash';

import { Window } from 'Component/';
import Report, { SimpleNode } from '../../../PnApp/model/Report';
import ProductRankTable from './ProductRankTable';
import DirectRelationTalbe from './DirectRelationTable';
import IndirectRelationTable from './IndirectRelationTable';

type SelectedProductDisplayMode = 'direct' | 'indirect';

interface Props {
  show: boolean;
  productList: SimpleNode[];
  model: Report;
  selectedProduct?: number;
  selectedProductMode?: SelectedProductDisplayMode;
  back: () => void;
  selectProduct: (id?: number, direct?: boolean) => void;
  close: () => void;
}

export default class ProductRankWindow extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.displayDirectRelation = this.displayDirectRelation.bind(this);
    this.displayIndirectRelation = this.displayIndirectRelation.bind(this);
  }

  public displayDirectRelation(id: number): () => void {
    return () => {
      this.props.selectProduct(id, true);
    };
  }

  public displayIndirectRelation(id: number): () => void {
    return () => {
      this.props.selectProduct(id, false);
    };
  }

  get title(): string {
    if (!isNumber(this.props.selectedProduct)) {
      return '產品排名';
    } else if (this.props.selectedProductMode === 'direct') {
      return `${this.props.model.graph.getNode(this.props.selectedProduct)
        .name as string}(直接)`;
    } else {
      return `${this.props.model.graph.getNode(this.props.selectedProduct)
        .name as string}(間接)`;
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
          displayDirectRelation={this.displayDirectRelation}
          displayIndirectRelation={this.displayIndirectRelation}
        />
      );
      // TODO: Add indirect table here.
    } else {
      if (this.props.selectedProductMode === 'direct') {
        content = (
          <DirectRelationTalbe
            model={this.props.model}
            selectedProduct={this.props.selectedProduct}
            back={this.props.back}
          />
        );
      } else {
        content = (
          <IndirectRelationTable
            model={this.props.model}
            back={this.props.back}
            selectedProduct={this.props.selectedProduct}
          />
        );
      }
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
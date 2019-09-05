import React, { PureComponent } from 'react';
import { isNumber } from 'lodash';

import { Window } from 'Component/';
import Report from '../../../PnApp/model/Report';
import DirectRelationTalbe from '../ProductRankWindow/DirectRelationTable';

interface Props {
  show: boolean;
  model: Report;
  searchItem?: number;
  selectProduct: (id?: number, direct?: boolean) => void;
  close: () => void;
}

export default class SearchItemWindow extends PureComponent<Props> {
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
    if (isNumber(this.props.searchItem)) {
      return `${this.props.model.graph.getNode(this.props.searchItem)
        .name as string}(直接)`;
    }
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    return (
      <Window
        title={this.title}
        defaultX={240}
        defaultWidth={450}
        defaultHeight={450}
        onClickX={this.props.close}
      >
        <DirectRelationTalbe
          model={this.props.model}
          selectedProduct={this.props.searchItem}
        />
      </Window>
    );
  }
}

import React, { PureComponent } from 'react';

import { Window } from 'Component/';
import Report from '../../../PnApp/model/Report';
import DirectRelationTable from '../ProductRankWindow/DirectRelationTable';

interface Props {
  show: boolean;
  model: Report;
  searchItem?: number;
  selectProduct: (id?: number, direct?: boolean) => void;
  close: () => void;
}

export default class SearchItemWindow extends PureComponent<Props> {
  public displayDirectRelation = (id: number) => {
    return () => {
      this.props.selectProduct(id, true);
    };
  };

  get title(): string {
    if (typeof this.props.searchItem === 'number') {
      return `${this.props.model.graph.getNode(this.props.searchItem)
        .name as string}(直接)`;
    }
    return '';
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
        <DirectRelationTable
          model={this.props.model}
          selectedProduct={this.props.searchItem}
        />
      </Window>
    );
  }
}

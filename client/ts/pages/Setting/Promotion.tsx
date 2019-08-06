import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import { PromotionItem } from 'Component/list/promotion';
import { ModalAddPromotion } from 'Component/modal';

import { Promotion } from '../../PnApp/Model';

interface PromotionPageState {
  loading: boolean;
  itemList: string[];
  promotions: Promotion[];
}

export default class PromotionPage extends PureComponent<RouteComponentProps, PromotionPageState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemList: [],
      promotions: [],
    };

    this.onButtonClick = this.onButtonClick.bind(this);
    this.load = this.load.bind(this);
  }

  public async componentDidMount() {
    await this.load();
  }

  public async load() {
    const promotions = await Promotion.getAll();
    this.setState({
      loading: false,
      promotions,
    });
  }

  public onButtonClick(item: Promotion): () => Promise<void> {
    return async () => {
      await item.delete();
      await this.load();
    };
  }

  public render() {
    const promotionHistory = this.state.promotions.map((promotion) => {
      return (
        <PromotionItem
          key={promotion.id}
          onSave={this.load}
          promotion={promotion}
        />
      );
    });

    return (
      <React.Fragment>
        <ModalAddPromotion onAdd={this.load} />
        <Table selectable color='teal'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>促銷名稱</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center'>開始時間</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center'>結束時間</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center'>種類</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center' />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {promotionHistory}
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

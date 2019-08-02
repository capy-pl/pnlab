import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'semantic-ui-react';

import PromotionList from 'Component/list/PromotionList';
import { ModalAddPromotion } from 'Component/modal';

import { Promotion } from '../../PnApp/Model';

interface PromotionItemState {
  loading: boolean;
  itemList: string[];
  promotions: Promotion[];
}

export default class PromotionItem extends PureComponent<RouteComponentProps, PromotionItemState> {
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
        <PromotionList
          key={promotion.id}
          item={promotion}
          onButtonClick={this.onButtonClick(promotion)}
        />
      );
    });

    return (
      <React.Fragment>
        <ModalAddPromotion onAdd={this.load} />
        <Table selectable color='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>Promotion Name</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center'>Start Time</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center'>End Time</Table.HeaderCell>
              <Table.HeaderCell width='1' textAlign='center'>Type</Table.HeaderCell>
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

import { connection } from 'mongoose';
import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, DropdownProps, Header, Icon, Modal, Segment, Table} from 'semantic-ui-react';

import PromotionForm from 'Component/form/PromotionForm';
import PromotionList from 'Component/list/PromotionList';
import Loader from 'Component/Loader';
import { Group, Promotion } from '../../PnApp/Model';
import { PromotionType } from '../../PnApp/Model/Promotion';

interface PromotionItemState {
  loading: boolean;
  itemList: string[];
  name: string;
  products: string[];
  productA: string[];
  productB: string[];
  type: PromotionType;
  open: boolean;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  promotions: Promotion[];
}

export default class PromotionItem extends PureComponent<RouteComponentProps, PromotionItemState> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      loading: false,
      itemList: [],
      open: false,
      products: [],
      productA: [],
      productB: [],
      type: 'combination',
      startYear: '',
      startMonth: '',
      endMonth: '',
      endYear: '',
      promotions: [],
    };

    this.onConfirm = this.onConfirm.bind(this);
    this.onChangeA = this.onChangeA.bind(this);
    this.onChangeB = this.onChangeB.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.startMonthChange = this.startMonthChange.bind(this);
    this.startYearChange = this.startYearChange.bind(this);
    this.endMonthChange = this.endMonthChange.bind(this);
    this.endYearChange = this.endYearChange.bind(this);
  }

  public async componentDidMount() {
    const productSet = await Group.getProducts();
    const promotions = await Promotion.getAll();
    this.setState({
      products: productSet,
      loading: false,
      promotions,
    });
  }

  public onConfirm() {
    this.setState({
      open: false,
      loading: true,
    });
    const promotion = {
      _id: this.state.name,
      name: this.state.name,
      type: this.state.type,
      groupOne: this.state.productA,
      groupTwo: this.state.productB,
      startTime: this.state.startYear + this.state.startMonth,
      endTime: this.state.endYear + this.state.endMonth,
    };
    Promotion.add(promotion)
      .then(() => {
        this.props.history.push('/');
      });
  }

  public onChangeA(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
      const values = data.value as string[];
      this.setState({
        productA: values,
      });
  }
  public onChangeB(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
      const values = data.value as string[];
      this.setState({
        productB: values,
      });
  }

  public nameChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value as string;
      this.setState({
        name: value,
      });
  }

  public typeChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
      const values = data.value as PromotionType;
      this.setState({
        type: values,
      });
  }

  public startYearChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value as string;
      this.setState({
        startYear: value,
      });
  }

  public endYearChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value as string;
      this.setState({
        endYear: value,
      });
  }

  public startMonthChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
      const values = data.value as string;
      this.setState({
        startMonth: values,
      });
  }

  public endMonthChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
      const values = data.value as string;
      this.setState({
        endMonth: values,
      });
  }

  public render() {

    const promotionHistory = this.state.promotions.map((promotion) => {
      return (
        <PromotionList
          key={promotion.id}
          item={promotion}
        />
      );
    });

    if (this.state.loading) {
      return <Loader size='huge' />;
    }
    return (
      <Segment>
        <Table selectable color='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>Promotion Name</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Start Time</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>End Time</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>ItemA Set</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>ItemB Set</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {promotionHistory}
          </Table.Body>
        </Table>

        <Modal trigger={<Button>Add</Button>} closeIcon>
          <Header content='欲刪除商品' />
          <Modal.Content>
            <PromotionForm
              dropChangeA={this.onChangeA}
              dropChangeB={this.onChangeB}
              nameChange={this.nameChange}
              typeChange={this.typeChange}
              startMonthChange={this.startMonthChange}
              startYearChange={this.startYearChange}
              endMonthChange={this.endMonthChange}
              endYearChange={this.endYearChange}
              products={this.state.products}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              color='green'
              inverted
              onClick={this.onConfirm}
            >
              <Icon name='checkmark' /> Confirm
            </Button>
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  }
}

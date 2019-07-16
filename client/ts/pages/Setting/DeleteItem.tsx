import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, DropdownProps, Header, Icon, Modal, Segment, Table} from 'semantic-ui-react';

import DeleteForm from 'Component/form/DeleteForm';
import Loader from 'Component/Loader';
import { Product } from '../../PnApp/Model/Report';

interface DeleteItemState {
  loading: boolean;
  itemList: string[];
  products: Product[];
  productArgs: string[];
  open: boolean;
}

const productSet = [
  {
    name: '牛奶',
    id: 123,
  },
  {
    name: '麵包',
    id: 124,
  },
]

export default class DeleteItem extends PureComponent<RouteComponentProps, DeleteItemState> {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      itemList: [],
      open: false,
      products: [],
      productArgs: [],
    };

    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public async componentDidMount() {
    const products = productSet;
    this.setState({
      products,
      loading: false,
    });
  }

  public onConfirm() {
    this.setState({
      open: false,
      loading: true,
    });
  }

  public onChange() {
    return (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
      const values = data.value as string[];
      this.setState({
        productArgs: values,
      });
    };
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    }
    return (
      <Segment>
        <Table selectable color='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width='1' textAlign='center'>Group Name</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Item Name</Table.HeaderCell>
              <Table.HeaderCell width='2' textAlign='center'>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell textAlign='center'>
                代收
              </Table.Cell>
              <Table.Cell textAlign='center'>
                信用卡代收
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Modal trigger={<Button>Add</Button>} closeIcon>
          <Header content='欲刪除商品' />
          <Modal.Content>
            <DeleteForm
              onChange={this.onChange}
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

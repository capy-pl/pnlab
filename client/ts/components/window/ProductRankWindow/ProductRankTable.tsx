import React from 'react';
import { Button, Icon, Popup, Table } from 'semantic-ui-react';

import { SimpleNode } from '../../../PnApp/model/Report';

interface Props {
  productList: SimpleNode[];
  displayDirectRelation: (id: number) => () => void;
  displayIndirectRelation: (id: number) => () => void;
}

export default class ProductRankTable extends React.PureComponent<Props> {
  public getCells(): JSX.Element[] {
    return this.props.productList.map((product, index) => (
      <Table.Row
        key={product.id}
        // onClick={this.props.selectCell(product.id)}
        textAlign='center'
      >
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{product.name}</Table.Cell>
        <Table.Cell textAlign='center'>{Math.round(product.weight)}</Table.Cell>
        <Table.Cell textAlign='center'>
          <Popup
            trigger={
              <Button basic size='mini' icon>
                <Icon name='ellipsis horizontal' />
              </Button>
            }
            position='bottom center'
            on='click'
          >
            <Button.Group basic vertical>
              <Button fluid onClick={this.props.displayDirectRelation(product.id)}>
                顯示直接關係
              </Button>
              <Button fluid onClick={this.props.displayIndirectRelation(product.id)}>
                顯示間接關係
              </Button>
            </Button.Group>
          </Popup>
        </Table.Cell>
      </Table.Row>
    ));
  }

  public render() {
    return (
      <React.Fragment>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>名次</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>產品名稱</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>產品權重</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.getCells()}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

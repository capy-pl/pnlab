import React from 'react';
import { Divider, Header, Form, Table } from 'semantic-ui-react';

import { getCurrentUser } from '../../PnApp/Helper';
import { User } from '../../PnApp/model';
import { ImportSchema } from '../../PnApp/model/Organization';

type State = {
  schema: ImportSchema;
};

export default class UploadForamt extends React.PureComponent<{}, State> {
  constructor(props) {
    super(props);
    const { importSchema } = (getCurrentUser() as User).org;
    this.state = {
      schema: importSchema,
    };
  }

  public getTransactionFieldRows() {
    if (this.state.schema.transactionFields.length) {
      return this.state.schema.transactionFields.map((field) => (
        <Table.Row key={field.name}>
          <Table.Cell textAlign='center'>{field.name}</Table.Cell>
          <Table.Cell textAlign='center'>{field.type}</Table.Cell>
        </Table.Row>
      ));
    } else {
      return <Table.Row>沒有相關欄位。</Table.Row>;
    }
  }

  public getItemFieldRows() {
    if (this.state.schema.itemFields.length) {
      return this.state.schema.itemFields.map((field) => (
        <Table.Row key={field.name}>
          <Table.Cell textAlign='center'>{field.name}</Table.Cell>
          <Table.Cell textAlign='center'>{field.type}</Table.Cell>
        </Table.Row>
      ));
    } else {
      return <Table.Row>沒有相關欄位。</Table.Row>;
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Header size='large' dividing>
          上傳格式
        </Header>
        <Header>必要欄位名稱</Header>
        <Form>
          <Form.Field>
            <Form.Input
              label='交易primary key名稱'
              readOnly
              value={this.state.schema.transactionName}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='商品primary key名稱'
              readOnly
              value={this.state.schema.itemName}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='交易時間名稱'
              readOnly
              value={this.state.schema.transactionTime}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='交易金額名稱'
              readOnly
              value={this.state.schema.amountName}
            />
          </Form.Field>
        </Form>
        <Divider />
        <Header>其餘交易欄位名稱</Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign='center'>欄位名稱</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>欄位屬性</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.getTransactionFieldRows()}</Table.Body>
        </Table>
        <Divider />
        <Header>其餘商品欄位名稱</Header>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign='center'>欄位名稱</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>欄位屬性</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.getItemFieldRows()}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

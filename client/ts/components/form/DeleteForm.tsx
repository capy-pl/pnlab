import React, { PureComponent } from 'react';
import { Dropdown, DropdownProps, Form, Segment } from 'semantic-ui-react';

import { Product } from '../../PnApp/Model/Report';

interface DeleteFormProps {
  products: Product[];
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const DeleteForm = ({ products, onChange }: DeleteFormProps) => {
  const inputs = products.map((item) => {
    return {
      text: item.name,
      item,
    };
  });
  return (
    <Segment color='teal'>
      <Form>
        <Form.Field>
          <label>Group Name</label>
          <input placeholder='Group name'/>
        </Form.Field>
        <Form.Field>
          <label>欲刪除產品</label>
        </Form.Field>
        <Dropdown
          onChange={onChange}
          placeholder={`Please select products`}
          fluid
          multiple
          search
          selection
          options={inputs}
        />
      </Form>
    </Segment>
  );
};

export default DeleteForm;

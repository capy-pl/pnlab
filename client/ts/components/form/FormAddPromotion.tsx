import React from 'react';
import { Dropdown, Form } from 'semantic-ui-react';
import { searchItem } from '../../PnApp/Helper';

import { DatetimeInput } from 'Component/';

interface FormAddPromotionProps {
  type: string;
  groupOne?: string[];
  groupTwo?: string[];
  nameChange: (e, data: { [key: string]: any }) => void;
  typeChange: (e, data: { [key: string]: any }) => void;
  groupOneChange: (e, data: { [key: string]: any }) => void;
  groupTwoChange: (e, data: { [key: string]: any }) => void;
  startTimeChange: (e, dateTime: Date) => void;
  endTimeChange: (e, dateTime: Date) => void;
}

interface AddPromotionState {
  productOptions: Option[];
}

interface Option {
  text: string;
  value: string;
  key: string;
}

const TYPE_OPTIONS = [
  {
    key: 'combination',
    text: 'combination',
    value: 'combination',
  },
  {
    key: 'direct',
    text: 'direct',
    value: 'direct',
  },
];

class FormAddPromotion extends React.PureComponent<FormAddPromotionProps, AddPromotionState> {
  private prodcutPool: Set<string>;
  constructor(props: FormAddPromotionProps) {
    super(props);
    this.state = {
      productOptions: [],
    };

    this.prodcutPool = new Set<string>();
    this.productSearchChange = this.productSearchChange.bind(this);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: FormAddPromotionProps) {
    if (nextProps.groupOne) {
      for (const product of nextProps.groupOne) {
        if (!this.prodcutPool.has(product)) {
          this.prodcutPool.add(product);
        }
      }
    }
    if (nextProps.groupTwo) {
      for (const product of nextProps.groupTwo) {
        if (!this.prodcutPool.has(product)) {
          this.prodcutPool.add(product);
        }
      }
    }
  }

  public async productSearchChange(e, data: { [key: string]: string }): Promise<void> {
    const searchString = data.searchQuery as string;
    const { items } = await searchItem(searchString);
    const options = items
      .filter((item) => !this.prodcutPool.has(item))
      .concat(this.props.groupOne || [])
      .concat(this.props.groupTwo || [])
      .map((item) => ({
        key: item,
        value: item,
        text: item,
      }));
    this.setState({
      productOptions: options,
    });
  }

  public render() {
    return (
      <Form>
        <Form.Field>
          <label>名稱</label>
          <Form.Input placeholder='名稱' onChange={this.props.nameChange} />
        </Form.Field>
        <Form.Field>
          <label>種類</label>
          <Dropdown
            placeholder='種類'
            selection
            fluid
            closeOnChange={true}
            defaultValue='direct'
            options={TYPE_OPTIONS}
            onChange={this.props.typeChange}
          />
        </Form.Field>
        <Form.Field>
          <label>欲刪除產品</label>
          <Dropdown
            onChange={this.props.groupOneChange}
            placeholder={`請選擇產品群1`}
            fluid
            multiple
            search
            deburr
            closeOnChange={true}
            selection
            options={this.state.productOptions}
            onSearchChange={this.productSearchChange}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            onChange={this.props.groupTwoChange}
            placeholder={`請選擇產品群2`}
            fluid
            multiple
            search
            selection
            deburr
            closeOnChange={true}
            disabled={this.props.type === 'direct'}
            options={this.state.productOptions}
            onSearchChange={this.productSearchChange}
          />
        </Form.Field>
        <Form.Field>
          <label>開始時間</label>
          <DatetimeInput onChange={this.props.startTimeChange} />
          <label>結束時間</label>
          <DatetimeInput onChange={this.props.endTimeChange} />
        </Form.Field>
      </Form>
    );
  }
}

export default FormAddPromotion;

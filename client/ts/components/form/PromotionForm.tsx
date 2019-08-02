import React from 'react';
import {
  Dropdown,
  Form,
} from 'semantic-ui-react';
import { searchItem } from '../../PnApp/Helper';

import { DatetimeInput } from 'Component/';

interface AddPromotionFormProps {
  onChange: <T>(key: string) => (e, data: { [key: string]: T }) => void;
}

type Type = 'combination' | 'direct';

interface AddPromotionState {
  productOptions: Option[];
  type: Type;
}

interface Option {
  text: string;
  value: string;
  key: string;
}

class AddPromotionForm extends React.PureComponent<AddPromotionFormProps, AddPromotionState> {
  constructor(props: AddPromotionFormProps) {
    super(props);
    this.state = {
      productOptions: [],
      type: 'combination',
    };

    this.productSearchChange = this.productSearchChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
  }

  public async productSearchChange(e, data: {[key: string]: string}): Promise<void> {
    const searchString = data.searchQuery as string;
    const { items } = await searchItem(searchString);
    const options = items.map((item) => ({
      key: item,
      value: item,
      text: item,
    }));
    this.setState({
      productOptions: options,
    });
  }

  public typeChange(): (e, data: {[key: string]: string}) => void {
    const parentTypeChange = this.props.onChange<string>('type');
    return (e, data: { [key: string]: string }) => {
      parentTypeChange(e, data);
      this.setState({
        type: data.value as Type,
      });
    };
  }

  public render() {
    const typeInput = [
      {
        text: 'combination',
        value: 'combination',
      },
      {
        text: 'direct',
        value: 'direct',
      },
    ];

    return (
      <Form>
        <Form.Field>
          <label>名稱</label>
          <Form.Input
            placeholder='名稱'
            onChange={this.props.onChange<string>('name')}
          />
        </Form.Field>
        <Form.Field>
          <label>種類</label>
          <Dropdown
            placeholder='種類'
            selection
            fluid
            closeOnChange={true}
            options={typeInput}
            onChange={this.typeChange()}
          />
        </Form.Field>
        <Form.Field>
          <label>欲刪除產品</label>
          <Dropdown
            onChange={this.props.onChange<string>('groupOne')}
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
            onChange={this.props.onChange<string>('groupTwo')}
            placeholder={`請選擇產品群2`}
            fluid
            multiple
            search
            selection
            deburr
            closeOnChange={true}
            disabled={this.state.type === 'direct'}
            options={this.state.productOptions}
            onSearchChange={this.productSearchChange}
          />
        </Form.Field>
        <Form.Field>
          <label>開始時間</label>
          <DatetimeInput onChange={this.props.onChange<string>('startTime')} />
          <label>結束時間</label>
          <DatetimeInput onChange={this.props.onChange<string>('endTime')} />
        </Form.Field>
      </Form>
    );
  }
}

export default AddPromotionForm;

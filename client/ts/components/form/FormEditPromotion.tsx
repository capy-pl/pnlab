import React from 'react';
import {
  Dropdown,
  Form,
} from 'semantic-ui-react';
import { searchItem } from '../../PnApp/Helper';

import { DatetimeInput } from 'Component/';
import Promotion from '../../PnApp/model/Promotion';

interface FormEditPromotionProps {
  type: string;
  groupOne?: string[];
  groupTwo?: string[];
  model: Promotion;
  nameChange: (e, data: { [key: string]: any }) => void;
  typeChange: (e, data: { [key: string]: any }) => void;
  groupOneChange: (e, data: { [key: string]: any }) => void;
  groupTwoChange: (e, data: { [key: string]: any }) => void;
  startTimeChange: (e, dateTime: Date) => void;
  endTimeChange: (e, dateTime: Date) => void;
}

interface FormEditPromotionState {
  productOptions: Option[];
}

interface Option {
  text: string;
  value: string;
  key: string;
}

class FormEditPromotion extends React.PureComponent<FormEditPromotionProps, FormEditPromotionState> {
  private prodcutPool: Set<string>;
  constructor(props: FormEditPromotionProps) {
    super(props);
    this.prodcutPool = new Set<string>();
    this.productSearchChange = this.productSearchChange.bind(this);
    const options: Option[]  = new Array<string>()
      .concat(this.props.model.groupOne)
      .concat(this.props.model.groupTwo)
      .map((value) => {
        this.prodcutPool.add(value);
        return {
          text: value,
          value,
          key: value,
        };
      });
    this.state = {
      productOptions: options,
    };
  }

  public componentWillReceiveProps(nextProps: FormEditPromotionProps) {
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
      .filter((item) => (!this.prodcutPool.has(item)))
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
            defaultValue={this.props.model.name}
            onChange={this.props.nameChange}
          />
        </Form.Field>
        <Form.Field>
          <label>種類</label>
          <Dropdown
            placeholder='種類'
            selection
            fluid
            closeOnChange={true}
            defaultValue={this.props.model.type}
            options={typeInput}
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
            defaultValue={this.props.model.groupOne}
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
            defaultValue={this.props.model.groupTwo}
            disabled={this.props.type === 'direct'}
            options={this.state.productOptions}
            onSearchChange={this.productSearchChange}
          />
        </Form.Field>
        <Form.Field>
          <label>開始時間</label>
          <DatetimeInput
            defaultValue={this.props.model.startTime.toUTCString()}
            onChange={this.props.startTimeChange}
          />
          <label>結束時間</label>
          <DatetimeInput
            defaultValue={this.props.model.endTime.toUTCString()}
            onChange={this.props.endTimeChange}
          />
        </Form.Field>
      </Form>
    );
  }
}

export default FormEditPromotion;

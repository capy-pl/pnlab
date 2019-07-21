import React from 'react';
import { Dropdown, DropdownProps, Form, Segment } from 'semantic-ui-react';

interface PromotionFormProps {
  products: string[];
  dropChangeA?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  dropChangeB?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  typeChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  nameChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startMonthChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  endMonthChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  startYearChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endYearChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PromotionForm = ({ products, dropChangeA, dropChangeB, typeChange, nameChange,
  startMonthChange, startYearChange, endMonthChange, endYearChange }: PromotionFormProps) => {
  const inputs = products.map((value) => {
    return {
      text: value,
      value,
    };
  });
  const typeInput = [{text: 'conbination', value: 'conbination'}, {text: 'direct', value: 'direct'}];
  const monthInput = [
    {text: 'January', value: 'January'},
    {text: 'February', value: 'Febraury'},
    {text: 'March', value: 'March'},
    {text: 'April', value: 'April'},
    {text: 'May', value: 'May'},
    {text: 'June', value: 'Jume'},
    {text: 'July', value: 'July'},
    {text: 'August', value: 'August'},
    {text: 'September', value: 'September'},
    {text: 'October', value: 'October'},
    {text: 'November', value: 'November'},
    {text: 'December', value: 'December'},
  ]

  return (
    <Segment color='teal'>
      <Form>
        <Form.Field>
          <label>Promotion Name</label>
          <input
            placeholder='Promotion name'
            onChange={nameChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Promotion Type</label>
          <Dropdown
            placeholder='Promotion Type'
            selection
            fluid
            options={typeInput}
            onChange={typeChange}
          />
        </Form.Field>
        <Form.Field>
          <label>欲刪除產品</label>
          <Dropdown
            onChange={dropChangeA}
            placeholder={`Please select products A`}
            fluid
            multiple
            search
            selection
            options={inputs}
          />
          <br/>
          <Dropdown
            onChange={dropChangeB}
            placeholder={`Please select products B`}
            fluid
            multiple
            search
            selection
            options={inputs}
          />
        </Form.Field>
        <Form.Field>
          <label>開始時間</label>
          <Dropdown
            onChange={startMonthChange}
            options={monthInput}
            placeholder={'Month'}
          />
          <input
            onChange={startYearChange}
            placeholder={'Year'}
            maxLength={4}
          />
          <label>結束時間</label>
          <Dropdown
            onChange={endMonthChange}
            options={monthInput}
            placeholder={'Month'}
          />
          <input
            onChange={endYearChange}
            placeholder={'Year'}
            maxLength={4}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
};

export default PromotionForm;

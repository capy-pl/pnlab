import React from 'react';
import { Dropdown, DropdownOnSearchChangeData, DropdownProps, Form, Segment } from 'semantic-ui-react';

interface PromotionFormProps {
  productsA: string[];
  productsB: string[];
  dropChangeA?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  dropChangeB?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  typeChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  nameChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startMonthChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  endMonthChange?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  startYearChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endYearChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchChangeA?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownOnSearchChangeData) => void;
  onSearchChangeB?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownOnSearchChangeData) => void;
}

const PromotionForm = ({ productsA, productsB, dropChangeA, dropChangeB, typeChange, nameChange, startMonthChange,
  startYearChange, endMonthChange, endYearChange, onSearchChangeA, onSearchChangeB }: PromotionFormProps) => {
  const inputsA = productsA.map((value) => {
    return {
      text: value,
      value,
    };
  });
  const inputsB = productsB.map((value) => {
    return {
      text: value,
      value,
    };
  });
  const typeInput = [{text: 'combination', value: 'combination'}, {text: 'direct', value: 'direct'}];
  const monthInput = [
    {text: 'January', value: '01'},
    {text: 'February', value: '02'},
    {text: 'March', value: '03'},
    {text: 'April', value: '04'},
    {text: 'May', value: '05'},
    {text: 'June', value: '06'},
    {text: 'July', value: '07'},
    {text: 'August', value: '08'},
    {text: 'September', value: '09'},
    {text: 'October', value: '10'},
    {text: 'November', value: '11'},
    {text: 'December', value: '12'},
  ];

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
            options={inputsA}
            onSearchChange={onSearchChangeA}
          />
          <br/>
          <Dropdown
            onChange={dropChangeB}
            placeholder={`Please select products B`}
            fluid
            multiple
            search
            selection
            options={inputsB}
            onSearchChange={onSearchChangeB}
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

import React from 'react';
import { Button } from 'semantic-ui-react';

import '../../../scss/form.scss';

const conditions = [
  {
    name: '餐別帶',
    type: 'string',
    values: ['早餐時間帶', '中餐時間帶 ']
  },
  {
    name: '開始時間',
    type: 'date'
  }
];

const FilterForm = () => (
  <div id='form'>
    <Button primary>Primary</Button>
    <Button secondary>Secondary</Button>
  </div>
);

export default FilterForm;

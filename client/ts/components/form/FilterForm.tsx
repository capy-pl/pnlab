import React, { PureComponent } from 'react';
import { Button } from 'semantic-ui-react';
import { Condition } from '../../PnApp/Model/Report';

const conditions = [
  {
    name: '餐別帶',
    type: 'string',
    values: ['早餐時間帶', '中餐時間帶 '],
  },
  {
    name: '開始時間',
    type: 'date',
  },
];

interface FilterFormProps {
  conditions: Condition[];
}

class FilterForm extends PureComponent {

};

export default FilterForm;

<<<<<<< HEAD
import React, { Component } from 'react';
import { Button, Divider, Dropdown } from 'semantic-ui-react';
import { Checkbox } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
import '../../../scss/form.scss';
=======
import React, { PureComponent } from 'react';
import { Button } from 'semantic-ui-react';
import { Condition } from '../../PnApp/Model/Report';
>>>>>>> origin/dev


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

<<<<<<< HEAD
const time = [
  { key: 'all', text: '全選', value: 'all' },
  { key: 'breakfast', text: '早餐', value: 'breakfast' },
  { key: 'lunch', text: '午餐', value: 'lunch' },
  { key: 'dinner', text: '晚餐', value: 'dinner' },
  { key: 'tea', text: '下午茶', value: 'tea' },
  { key: 'normal', text: '一般', value: 'normal' }
]

const area = [
  { key: '1', text: '台北', value: '1' },
  { key: '2', text: '新北', value: '2' },
  { key: '3', text: '基隆', value: '3' },
  { key: '4', text: '桃園', value: '4' },
  { key: '5', text: '新竹', value: '5' },
  { key: '6', text: '宜蘭', value: '6' },
]

const zone = [
  { key: 'all', text: '全選', value: 'all' },
  { key: 'living', text: '住宅型', value: 'living' },
  { key: 'learning', text: '文教型', value: 'learning' },
  { key: 'industry', text: '工業型', value: 'industry' },
  { key: 'station', text: '車站型', value: 'station' },
]

const product = [
  {key:'bag1',text:'購物袋1',valus:'bag1'},
  {key:'money',text:'中華電信代收',valus:'money'},
  {key:'bag2',text:'購物袋2',valus:'bag2'},
  {key:'bag3',text:'購物袋3',valus:'bag3'},
  {key:'bag4',text:'購物袋4',valus:'bag4'},
]

const event = [
  {key:'39',text:'39元組合',valus:'39'},
  {key:'49',text:'49元組合',valus:'49'},
  {key:'59',text:'59元組合',valus:'59'},
  {key:'0.6',text:'第二件6折',valus:'0.6'},
]

const FilterForm = () => (
  <div id='form'>
    <h3 className="ui dividing header">篩選條件</h3>
    <p>選擇日期:</p>
    <Input placeholder='開始日期' />
    <Input placeholder='結束日期' />
    <h3 className="ui dividing header">篩選條件</h3>
    <p>選擇時段:</p>
    <Dropdown placeholder='時段' fluid multiple selection options={time} />
    <br/>
    <p>選擇商圈:</p>
    <Dropdown placeholder='商圈' fluid multiple selection options={zone} />
    <br/>
    <p>選擇地區:</p>
    <Checkbox label='全選'/><br/>
    <Checkbox label='北部'/>
    <Checkbox label='中部'/>
    <Checkbox label='南部'/>
    <Checkbox label='東部'/>
    <Dropdown placeholder='縣市' fluid multiple selection options={area} />
    <br/>
    <p>選擇欲刪除商品:</p>
    <Dropdown placeholder='產品刪除' fluid multiple search selection options={product}/>
    <br/>
    <p>選擇欲刪除促銷活動:</p>
    <Dropdown placeholder='促銷活動刪除' fluid multiple search selection options={event}/>
    <br/>
    <p>選擇網路圖權重:</p>
    <Checkbox label='Degree'/>
    <Checkbox label='Degree + Price'/>
    <br/><br/>
    <Button type='submit'>Clear</Button>
    <Button primary type='submit'>Submit</Button>
  </div>
);
=======
interface FilterFormProps {
  conditions: Condition[];
}

class FilterForm extends PureComponent<FilterFormProps, {}> {
  public render() {
    return (
      <div>
        Test
      </div>
    );
  }
}
>>>>>>> origin/dev

export default FilterForm;

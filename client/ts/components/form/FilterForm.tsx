import React from 'react';
import _ from 'lodash';
import { Button, Divider, Dropdown } from 'semantic-ui-react';
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

const time = [
  { key: 'all', text: '全選', value: 'all' },
  { key: 'breakfast', text: '早餐', value: 'breakfast' },
  { key: 'lunch', text: '午餐', value: 'lunch' },
  { key: 'dinner', text: '晚餐', value: 'dinner' },
  { key: 'tea', text: '下午茶', value: 'tea' },
  { key: 'normal', text: '一般', value: 'normal' }
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


const FilterForm = () => (
  <div id='form'>
    <h3 className="ui dividing header">篩選條件</h3>
    <p>選擇時段:</p>
    <Dropdown placeholder='時段' fluid multiple selection options={time} />
    <br/>
    <p>選擇商圈:</p>
    <Dropdown placeholder='商圈' fluid multiple selection options={zone} />
    <br/>
    <p>選擇欲刪除商品:</p>
    <Dropdown
    placeholder='產品刪除'
    fluid
    multiple
    search
    selection
    options={product}
  />
  </div>
);

export default FilterForm;

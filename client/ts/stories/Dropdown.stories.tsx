import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { DropdownProps } from 'semantic-ui-react';

import { DropdownSearchItem } from 'Component/dropdown';
import DropdownSearch from 'Component/dropdown/DropdownSearch';

const stories = storiesOf('Dropdown', module);

stories
  .add('Drop down', () => {
    const countryOptions = [
      {
        key: 'af',
        value: 'af',
        text: 'Afghanistan',
      },
      {
        key: 'ax',
        value: 'ax',
        text: 'Aland Islands',
      },
      {
        key: 'al',
        value: 'al',
        text: 'Albania',
      },
      {
        key: 'dz',
        value: 'dz',
        text: 'Algeria',
      },
      {
        key: 'as',
        value: 'as',
        text: 'American Samoa',
      },
      {
        key: 'ad',
        value: 'ad',
        text: 'Andorra',
      },
      {
        key: 'ao',
        value: 'ao',
        text: 'Angola',
      },
      {
        key: 'ai',
        value: 'ai',
        text: 'Anguilla',
      },
      {
        key: 'ag',
        value: 'ag',
        text: 'Antigua',
      },
      {
        key: 'ar',
        value: 'ar',
        text: 'Argentina',
      },
      {
        key: 'am',
        value: 'am',
        text: 'Armenia',
      },
      {
        key: 'aw',
        value: 'aw',
        text: 'Aruba',
      },
      {
        key: 'au',
        value: 'au',
        text: 'Australia',
      },
      {
        key: 'at',
        value: 'at',
        text: 'Austria',
      },
      {
        key: 'az',
        value: 'az',
        text: 'Azerbaijan',
      },
    ];

    function onChange(
      event: React.SyntheticEvent<HTMLElement, Event>,
      data: DropdownProps,
    ) {
      console.log(data.value);
    }

    const placeholder = 'Please select a country';

    return (
      <DropdownSearch
        placeholder={placeholder}
        options={countryOptions}
        onChange={onChange}
      />
    );
  })
  .add('Drop down Item', () => {
    const options = [
      {
        key: '0',
        value: '九州抹茶麻糬冰淇淋',
        text: '九州抹茶麻糬冰淇淋',
      },
      {
        key: '1',
        value: '京都宇治抹茶綠茶冷泡版',
        text: '京都宇治抹茶綠茶冷泡版',
      },
      {
        key: '2',
        value: '代銷悠遊卡卡娜赫拉－下午茶時光',
        text: '代銷悠遊卡卡娜赫拉－下午茶時光',
      },
      {
        key: '3',
        value: '代銷悠遊卡大耳狗－午茶時光',
        text: '代銷悠遊卡大耳狗－午茶時光',
      },
      {
        key: '4',
        value: '代銷悠遊卡拉拉熊－午茶',
        text: '代銷悠遊卡拉拉熊－午茶',
      },
      {
        key: '5',
        value: '代銷悠遊卡掰啾台灣珍珠奶茶',
        text: '代銷悠遊卡掰啾台灣珍珠奶茶',
      },
      {
        key: '6',
        value: '伊藤園濃味綠茶',
        text: '伊藤園濃味綠茶',
      },
      {
        key: '7',
        value: '伊藤園濃味綠茶溫罐３４５ｍｌ',
        text: '伊藤園濃味綠茶溫罐３４５ｍｌ',
      },
      {
        key: '8',
        value: '伊藤園綠茶',
        text: '伊藤園綠茶',
      },
      {
        key: '9',
        value: '伊藤園綠茶３４５ＭＬ',
        text: '伊藤園綠茶３４５ＭＬ',
      },
    ];
    const placeholder = 'Please select a country';

    function onChange(
      event: React.SyntheticEvent<HTMLElement, Event>,
      data: DropdownProps,
    ) {
      console.log(data.value);
    }

    return (
      <DropdownSearchItem
        placeholder={placeholder}
        options={options}
        onChange={onChange}
      />
    );
  });

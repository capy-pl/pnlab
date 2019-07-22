import {
  storiesOf,
} from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import {
  SearchHistoryItem,
} from 'Component/list';
import {
  Table,
} from 'semantic-ui-react';

import {
  ReportStatus,
} from '../PnApp/model/Report';

const stories = storiesOf('List', module);

stories
  .add(
    'Search History Item', () => {
      const data = [
          {
          _id: '1234',
          conditions: [{
            values: [
              '早餐時間帶',
            ],
            name: '餐別帶',
            type: 'string',
          }],
          created: new Date('2019-06-07T14:31:15.416Z'),
          modified: new Date('2019-06-07T14:31:15.740Z'),
          status: 'success' as ReportStatus,
          errMessage: '',
          startTime: new Date('2019-06-07T14:31:15.416Z'),
          endTime: new Date('2019-06-07T14:31:15.416Z'),
        },
        {
          _id: '12345',
          conditions: [{
            values: [
              '早餐時間帶',
            ],
            name: '餐別帶',
            type: 'string',
          }],
          created: new Date('2019-06-07T14:31:15.416Z'),
          modified: new Date('2019-06-07T14:31:15.740Z'),
          status: 'error' as ReportStatus,
          errMessage: '',
          startTime: new Date('2019-06-07T14:31:15.416Z'),
          endTime: new Date('2019-06-07T14:31:15.416Z'),
        },
        {
          _id: '123455',
          conditions: [{
            values: [
              '早餐時間帶',
            ],
            name: '餐別帶',
            type: 'string',
          }],
          created: new Date('2019-06-07T14:31:15.416Z'),
          modified: new Date('2019-06-07T14:31:15.740Z'),
          status: 'pending' as ReportStatus,
          errMessage: '',
          startTime: new Date('2019-06-07T14:31:15.416Z'),
          endTime: new Date('2019-06-07T14:31:15.416Z'),
        }];
      const items = data.map((report) => <SearchHistoryItem key={report._id} item={report} onLinkClick={console.log}/>);
      return (
        <Table selectable>
          <Table.Header>
            <Table.HeaderCell width='1' textAlign='center' />
            <Table.HeaderCell width='2' textAlign='center' />
            <Table.HeaderCell width='2' textAlign='center' />
            <Table.HeaderCell width='5' />
            <Table.HeaderCell width='4' />
          </Table.Header>
          <Table.Body>
            {items}
          </Table.Body>
        </Table>
      ) ;
    });

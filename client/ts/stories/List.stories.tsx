import {
  storiesOf,
} from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import {
  Table,
} from 'semantic-ui-react';
import {
  SearchHistoryItem,
} from '../components/list';

const stories = storiesOf('List', module);

stories
  .add(
    'Search History Item', () => {
      const data = [{
        conditions: [{
          values: [
            '早餐時間帶',
          ],
          name: '餐別帶',
          type: 'string',
        }],
        created: new Date('2019-06-07T14:31:15.416Z'),
        modified: new Date('2019-06-07T14:31:15.740Z'),
        status: 'success',
        errMessage: '',
        startTime: new Date('2019-06-07T14:31:15.416Z'),
        endTime: new Date('2019-06-07T14:31:15.416Z'),
      },
        {
          conditions: [{
            values: [
              '早餐時間帶',
            ],
            name: '餐別帶',
            type: 'string',
          }],
          created: new Date('2019-06-07T14:31:15.416Z'),
          modified: new Date('2019-06-07T14:31:15.740Z'),
          status: 'error',
          errMessage: '',
          startTime: new Date('2019-06-07T14:31:15.416Z'),
          endTime: new Date('2019-06-07T14:31:15.416Z'),
        },
        {
          conditions: [{
            values: [
              '早餐時間帶',
            ],
            name: '餐別帶',
            type: 'string',
          }],
          created: new Date('2019-06-07T14:31:15.416Z'),
          modified: new Date('2019-06-07T14:31:15.740Z'),
          status: 'pending',
          errMessage: '',
          startTime: new Date('2019-06-07T14:31:15.416Z'),
          endTime: new Date('2019-06-07T14:31:15.416Z'),
        }];
      const items = data.map((report) => <SearchHistoryItem item={report}/>);
      return (
        <Table>
          <Table.Header>
            <Table.HeaderCell width='1' textAlign='center' />
            <Table.HeaderCell width='7' />
            <Table.HeaderCell width='4' />
          </Table.Header>
          <Table.Body>
            {items}
          </Table.Body>
        </Table>
      ) ;
    });

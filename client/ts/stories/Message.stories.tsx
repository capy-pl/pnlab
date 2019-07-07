import { storiesOf } from '@storybook/react';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import { CharacterMessage, ProductRank, TabPanel } from '../components/message';

const stories = storiesOf('Message', module);

stories
  .add(
    'Tab panel', () => {
      const coreInfo = [
        {community: '1', core: 'A'},
        {community: '2', core: 'B'},
      ];
      const hookInfo = [
        'milk',
        'egg',
      ];
      return <TabPanel coreInfo={coreInfo} hookInfo={hookInfo} />;
    },
  )
  .add(
    'CharacterMessage', () => {
      const coreInfo = [
        {community: '1', core: 'A'},
        {community: '2', core: 'B'},
      ];
      const hookInfo = [
        'milk',
        'egg',
      ];
      return(
        <div style={{ width: '20%' }}>
          <CharacterMessage coreInfo={coreInfo} hookInfo={hookInfo} />
        </div>
      );
    },
  )
  .add(
    'ProductRank', () => {
      const productRankInfo = [
        {rank: '1', name: '鮪魚飯糰'},
        {rank: '2', name: '茶葉蛋'},
      ];
      return(
        <div style={{ width: '20%' }}>
          <ProductRank productRankInfo={productRankInfo} />
        </div>
      );
    },
  );

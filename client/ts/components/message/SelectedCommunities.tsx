import React from 'react';
import { Message } from 'semantic-ui-react';

const SelectedCommunities = (props) => {
  const selectedCommunitiesList = props.selectedCommunities.map((community) => {
    return (
      <h4 key={community.id}>
        <a onClick={() => props.onCommDetailClick(community)} style={{cursor: 'pointer'}}>
          Community {community.id} 詳細資料
        </a>
      </h4>
    );
  });
  return (
    <Message onDismiss={props.onDismiss}>
      <a onClick={props.onBacktoCommunitiesRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>
      <h3 style={{textAlign: 'center'}}>已選取的商品群</h3>
      <div style={{margin: '0 auto', textAlign: 'center'}}>
        {selectedCommunitiesList}
      </div>
    </Message>
  );
};

export default SelectedCommunities;

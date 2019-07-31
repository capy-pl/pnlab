import React from 'react';
import { Message } from 'semantic-ui-react';
import { Community } from '../../PnApp/model/Report';

interface SelectedCommunitiesProps {
  onDismiss: () => void;
  selectedCommunities: Community[];
  onCommDetailClick: (community: Community) => void;
  onBacktoCommunitiesRank: () => void;
}

const SelectedCommunities =
({onDismiss, selectedCommunities, onCommDetailClick, onBacktoCommunitiesRank}: SelectedCommunitiesProps) => {
  const detailClick = (community: Community): () => void  => {
    return () => {
      onCommDetailClick(community);
    };
  };

  const selectedCommunitiesList = selectedCommunities.map((community) => {
    return (
      <h4 key={community.id}>
        <a onClick={detailClick(community)} style={{cursor: 'pointer'}}>
          Community {community.id} 詳細資料
        </a>
      </h4>
    );
  });
  return (
    <Message onDismiss={onDismiss}>
      <a onClick={onBacktoCommunitiesRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>
      <h3 style={{textAlign: 'center'}}>已選取的商品群</h3>
      <div style={{margin: '0 auto', textAlign: 'center'}}>
        {selectedCommunitiesList}
      </div>
    </Message>
  );
};

export default SelectedCommunities;

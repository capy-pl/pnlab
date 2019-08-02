import React from 'react';
import { Message, Table, TableBody } from 'semantic-ui-react';
import { Community } from '../../PnApp/model/Report';

interface CommunityDetailProps {
  community?: Community;
  onDismiss: () => void;
  onBacktoCommunitiesRank: () => void;
  onBacktoSelectedCommunities: () => void;
  backTo?: string;
}

const CommunityDetail =
({community, onDismiss, onBacktoCommunitiesRank, onBacktoSelectedCommunities, backTo}: CommunityDetailProps) => {
  if (community) {
    const productRank = community.items.map((product, index) => {
      return(
        <Table.Row key={product.name} textAlign='center'>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{product.name}</Table.Cell>
          <Table.Cell>{Math.round(product.weight)}</Table.Cell>
        </Table.Row>
      );
    });

    const back = (backTo === 'communitiesRankList') ?
      <a onClick={onBacktoCommunitiesRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a> :
      <a onClick={onBacktoSelectedCommunities} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>;

    return (
      <Message className='report-message' onDismiss={onDismiss}>
        {back}
        <h3 style={{textAlign: 'center'}}>Community {community.id} 產品排名</h3>
        <Table basic='very'>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell>名次</Table.HeaderCell>
              <Table.HeaderCell>產品名稱</Table.HeaderCell>
              <Table.HeaderCell>產品權重</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <TableBody>
            {productRank}
          </TableBody>
        </Table>
      </Message>
    );
  } else {
    return (
      <React.Fragment>
        No Result
      </React.Fragment>
    );
  }
};

export default CommunityDetail;

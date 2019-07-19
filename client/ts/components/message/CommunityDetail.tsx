import React from 'react';
import { Button, Checkbox, Message, Table, TableBody } from 'semantic-ui-react';

const CommunityDetail = (props) => {
  const productRank = props.community.items.map((product, index) => {
    return(
      <Table.Row key={product} textAlign='center'>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{product}</Table.Cell>
      </Table.Row>
    );
  });

  // const back = (() => {
  //   if (props.backTo === 'communitiesRankList') {
  //     return <a onClick={props.onBacktoCommunitiesRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>;
  //   } else if (props.backTo === 'selectedCommunities') {
  //     return <a onClick={props.onBacktoSelectedCommunities} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>;
  //   }
  // });
  const back = (props.backTo === 'communitiesRankList') ?
    <a onClick={props.onBacktoCommunitiesRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a> :
    <a onClick={props.onBacktoSelectedCommunities} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>;

  return (
    <Message onDismiss={props.onDismiss}>
      {back}
      <h3 style={{textAlign: 'center'}}>Community {props.community.id} 產品排名</h3>
      <Table basic='very'>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>名次</Table.HeaderCell>
            <Table.HeaderCell>產品名稱</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <TableBody>
          {productRank}
        </TableBody>
      </Table>
    </Message>
  );
};

export default CommunityDetail;

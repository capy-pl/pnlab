import React from 'react';
import { Button, Checkbox, Message, Table, TableBody } from 'semantic-ui-react';
import { Community } from '../../PnApp/model/Report';

interface CommunityRankProps {
  communitiesInfo: Community[];
  onDismiss: () => void;
  onCommClick: (community: Community) => void;
  onCommCheck: (community: Community) => void;
  onSend: () => void;
}

const CommunitiesRankList = ({
  communitiesInfo,
  onDismiss,
  onCommClick,
  onCommCheck,
  onSend,
}: CommunityRankProps) => {
  const onClick = (community: Community) => {
    return () => {
      onCommClick(community);
    };
  };

  const onCheck = (community: Community) => {
    return () => {
      onCommCheck(community);
    };
  };

  const communitiesRank = communitiesInfo.slice(0, 20).map((community, index) => (
    <Table.Row key={community.id} textAlign='center'>
      <Table.Cell>{index + 1}</Table.Cell>
      <Table.Cell>
        <a onClick={onClick(community)} style={{ cursor: 'pointer' }}>
          {community.id}
        </a>
      </Table.Cell>
      <Table.Cell>{Math.round(community.weight)}</Table.Cell>
      <Table.Cell>
        <Checkbox onChange={onCheck(community)} />
      </Table.Cell>
    </Table.Row>
  ));
  return (
    <Message className='report-message' onDismiss={onDismiss}>
      <h3 style={{ textAlign: 'center' }}>Communities排名(前20名)</h3>
      <Table basic='very'>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>名次</Table.HeaderCell>
            <Table.HeaderCell>商品群編號</Table.HeaderCell>
            <Table.HeaderCell>商品群權重</Table.HeaderCell>
            <Table.HeaderCell>選取</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <TableBody>{communitiesRank}</TableBody>
      </Table>
      <Button content='送出' onClick={onSend} />
    </Message>
  );
};

export default CommunitiesRankList;

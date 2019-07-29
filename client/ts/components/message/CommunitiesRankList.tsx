import React from 'react';
import { Button, Checkbox, Message, Table, TableBody } from 'semantic-ui-react';

const CommunitiesRankList = (props) => {
  const communitiesRank = props.communitiesInfo.slice(0, 20).map((community, index) => (
    <Table.Row key={community.id} textAlign='center'>
      <Table.Cell>{index + 1}</Table.Cell>
      <Table.Cell>
        <a onClick={() => props.onCommClick(community)} style={{cursor: 'pointer'}}>{community.id}</a>
      </Table.Cell>
      <Table.Cell>
        {Math.round(community.weight)}
      </Table.Cell>
      <Table.Cell><Checkbox onChange={() => props.onCommCheck(community)} /></Table.Cell>
    </Table.Row>
  ));
  return (
    <Message onDismiss={props.onDismiss}>
      <h3 style={{textAlign: 'center'}}>Communities排名(前20名)</h3>
      <Table basic='very'>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>名次</Table.HeaderCell>
            <Table.HeaderCell>商品群編號</Table.HeaderCell>
            <Table.HeaderCell>商品群權重</Table.HeaderCell>
            <Table.HeaderCell>選取</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <TableBody>
          {communitiesRank}
        </TableBody>
      </Table>
      <Button content='送出' onClick={props.onSend} />
    </Message>
  );
};

export default CommunitiesRankList;

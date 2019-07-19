import React from 'react';
import { Checkbox, Message, Table, TableBody } from 'semantic-ui-react';

const CommunitiesRankList = (props) => {
  const communitiesRank = props.communitiesInfo.slice(0, 20).map((community, index) => (
    <Table.Row key={community.id} textAlign='center'>
      <Table.Cell>{index + 1}</Table.Cell>
      <Table.Cell>
        <a onClick={() => props.onCommClick(community)} style={{cursor: 'pointer'}}>{community.id}</a>
      </Table.Cell>
      <Table.Cell><Checkbox /></Table.Cell>
    </Table.Row>
  ));
  return (
    <Message onDismiss={props.onDismiss}>
      <h3 style={{textAlign: 'center'}}>Communities排名</h3>
      <Table basic='very'>
        <Table.Header>
          <Table.Row textAlign='center'>
            <Table.HeaderCell>名次</Table.HeaderCell>
            <Table.HeaderCell>商品群</Table.HeaderCell>
            <Table.HeaderCell>選取</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <TableBody>
          {communitiesRank}
        </TableBody>
      </Table>
    </Message>
  );
};

export default CommunitiesRankList;

// interface CommunitiesRankListProps {
//   communitiesInfo?: Community[];
//   onDismiss: () => void;
//   onCommClick: (community) => void;
// }

// interface CommunitiesRankListState {
//   communities?: Community[];
// }

// export default class CommunitiesRankList extends PureComponent<CommunitiesRankListProps, CommunitiesRankListState> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       communities: this.props.communitiesInfo,
//     };
//   }

//   public render() {
//     const communitiesRank = this.state.communities.map((community, index) => (
//       <Table.Row key={community.id} textAlign='center'>
//         <Table.Cell>{index + 1}</Table.Cell>
//         <Table.Cell>
//           <a onClick={() => this.props.onCommClick(community)} style={{cursor: 'pointer'}}>{community.id}</a>
//         </Table.Cell>
//         <Table.Cell><Checkbox /></Table.Cell>
//       </Table.Row>
//     ));
//     return (
//       <Message onDismiss={this.props.onDismiss}>
//         <h3 style={{textAlign: 'center'}}>Communities排名</h3>
//         <Table basic='very'>
//           <Table.Header>
//             <Table.Row textAlign='center'>
//               <Table.HeaderCell>名次</Table.HeaderCell>
//               <Table.HeaderCell>商品群</Table.HeaderCell>
//               <Table.HeaderCell>選取</Table.HeaderCell>
//             </Table.Row>
//           </Table.Header>
//           <TableBody>
//             {communitiesRank}
//           </TableBody>
//         </Table>
//       </Message>
//     );
//   }
// }

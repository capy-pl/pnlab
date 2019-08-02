import React from 'react';
import { Button, Grid, Header, Portal, Segment, Table } from 'semantic-ui-react';
import Report from '../../PnApp/model/Report';

interface ComparePortalProps {
  open: boolean;
  reportA: Report;
  reportB: Report;
  onClose: () => void;
}

const ComparePortal = ({open, reportA, reportB, onClose}: ComparePortalProps) => {
  const nodesA = reportA.rank.map((node) => {
    return (
      <Table.Row key={node.name}>
        <Table.Cell>{node.name}</Table.Cell>
        <Table.Cell>{Math.round(node.weight)}</Table.Cell>
      </Table.Row>
    );
  });
  const nodesB = reportB.rank.map((node) => {
    return (
      <Table.Row key={node.name}>
        <Table.Cell>{node.name}</Table.Cell>
        <Table.Cell>{Math.round(node.weight)}</Table.Cell>
      </Table.Row>
    );
  });
  const shareNodes: JSX.Element[] = [];
  for (const node of reportA.rank) {
    for (const n of reportB.rank) {
      if (n.name === node.name) {
        shareNodes.push(
          <Table.Row key={node.name}>
            <Table.Cell>{node.name}</Table.Cell>
          </Table.Row>,
        );
      }
    }
  }
  return (
    <Portal onClose={onClose} open={open}>
      <Segment
        style={{position: 'fixed', left: '15%', top: '15%', zIndex: 1000, overflow: 'auto', maxHeight: '75%', width: '60%'}}
      >
        <Header>網路圖比較</Header>
        <Grid columns='three' divided>
          <Grid.Row>
            <Grid.Column>
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>圖A產品</Table.HeaderCell>
                    <Table.HeaderCell>權重</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {nodesA}
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>共同產品</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {shareNodes}
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>圖B產品</Table.HeaderCell>
                    <Table.HeaderCell>權重</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {nodesB}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Button
          content='關閉'
          negative
          onClick={onClose}
        />
      </Segment>
    </Portal>
  );
};
export default ComparePortal;

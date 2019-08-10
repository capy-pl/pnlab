import React from 'react';
import { Button, Grid, Header, Portal, Segment, Table } from 'semantic-ui-react';
import Report, { Node } from '../../PnApp/model/Report';

interface ComparePortalProps {
  open: boolean;
  nodesA?: Node[];
  nodesB?: Node[];
  shareNodes?: Node[];
  onClose: () => void;
}

const segmentStyle = {
  position: 'fixed',
  left: '15%',
  top: '15%',
  zIndex: 1000,
  overflow: 'auto',
  maxHeight: '75%',
  width: '60%',
};

const ComparePortal = ({open, nodesA, nodesB, shareNodes, onClose}: ComparePortalProps) => {
  const getTableRow = (nodes: Node[]) => {
    const tableRow = nodes.map((node, index) => {
      return (
        <Table.Row key={node.id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{node.name}</Table.Cell>
          <Table.Cell>{Math.round(node.weight)}</Table.Cell>
        </Table.Row>
      );
    });
    return tableRow;
  };
  const tableRowA = getTableRow(nodesA);
  const tableRowB = getTableRow(nodesB);

  const share = shareNodes.map((node) => {
    return (
      <Table.Row key={node.id}>
        <Table.Cell>{node.name}</Table.Cell>
      </Table.Row>
    );
  });

  const getTable = (name: string, tableRow: JSX.Element[]) => {
    return (
      <Table celled padded color='teal'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名次</Table.HeaderCell>
            <Table.HeaderCell>圖{name}產品</Table.HeaderCell>
            <Table.HeaderCell>權重</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tableRow}
        </Table.Body>
      </Table>
    );
  };
  const tableA = getTable('A', tableRowA);
  const tableB = getTable('B', tableRowB);

  return (
    <Portal onClose={onClose} open={open}>
      <Segment
        style={segmentStyle}
      >
        <Header>網路圖比較</Header>
        <Grid columns='three'>
          <Grid.Row>
            <Grid.Column>
              {tableA}
            </Grid.Column>

            <Grid.Column>
              <Table celled padded color='yellow'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>共同產品</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {share}
                </Table.Body>
              </Table>
            </Grid.Column>

            <Grid.Column>
              {tableB}
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

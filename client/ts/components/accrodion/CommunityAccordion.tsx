import React from 'react';
import { Accordion, Table } from 'semantic-ui-react';

import { Community } from '../../PnApp/model/Report';

interface CommunityAccordionProps {
  core?: string;
  price: number;
  // groups:
  community: Community;
}

const CommunityAccordion = ({ core, price, community }: CommunityAccordionProps) => {
  const basicInfo = (
    <Table basic>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <h5 style={{ display: 'inline' }}>Community核心：</h5> {core}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <h5 style={{ display: 'inline' }}>平均單價：</h5> {price}元
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
  const items = community.items.map((node) => (
    <Table.Row key={node.name}>
      <Table.Cell>{node.name}</Table.Cell>
      <Table.Cell>{Math.round(node.weight)}</Table.Cell>
    </Table.Row>
  ));
  const productTable = (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>名稱</Table.HeaderCell>
          <Table.HeaderCell>權重</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{items}</Table.Body>
    </Table>
  );
  const rootPanels = [
    { key: 'panel-1', title: '基本資訊', content: { content: basicInfo } },
    { key: 'panel-2', title: '包含群號', content: { content: '' } },
    { key: 'panel-3', title: '產品列表', content: { content: productTable } },
  ];
  return <Accordion defaultActiveIndex={-1} panels={rootPanels} styled />;
};

export default CommunityAccordion;

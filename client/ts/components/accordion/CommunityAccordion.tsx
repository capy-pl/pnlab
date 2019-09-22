import React from 'react';
import { Accordion, Table, Label } from 'semantic-ui-react';

import { Community } from '../../PnApp/model/Report';

interface CommunityAccordionProps {
  community?: Community;
}

const getBasicInfo = (community) => {
  return (
    <Table basic>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <h5 style={{ display: 'inline' }}>核心產品：</h5>
            {community.core ? community.core : '此產品群的產品數小於4，故無核心產品'}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <h5 style={{ display: 'inline' }}>平均單價：</h5>{' '}
            {Math.round(community.averagePrice)}元
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

const getTagList = (community) => {
  const tags = community.tags.map((tag) => {
    return <Label key={tag}>{tag}</Label>;
  });
  return (
    <React.Fragment>
      <Label.Group size='medium'>{tags}</Label.Group>
      <Label basic>共{community.tags.length}個群號</Label>
    </React.Fragment>
  );
};

const getProductTable = (community) => {
  const items = community.items.map((node) => (
    <Table.Row key={node.name}>
      <Table.Cell>{node.name}</Table.Cell>
      <Table.Cell>{Math.round(node.weight)}</Table.Cell>
    </Table.Row>
  ));
  return (
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
};

const CommunityAccordion = ({ community }: CommunityAccordionProps) => {
  if (community) {
    const basicInfo = getBasicInfo(community);
    const tagList = getTagList(community);
    const productTable = getProductTable(community);
    const rootPanels = [
      { key: 'panel-1', title: '基本資訊', content: { content: basicInfo } },
      { key: 'panel-2', title: '包含群號', content: { content: tagList } },
      { key: 'panel-3', title: '產品列表', content: { content: productTable } },
    ];
    return <Accordion defaultActiveIndex={-1} panels={rootPanels} styled />;
  } else {
    return <React.Fragment />;
  }
};

export default CommunityAccordion;

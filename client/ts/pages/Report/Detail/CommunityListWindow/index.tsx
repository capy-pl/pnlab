import React, { PureComponent } from 'react';

import { Window } from 'Component/';
import { Community } from '../../../../PnApp/model/Report';
import { Accordion, AccordionTitleProps, Icon, Message, Table } from 'semantic-ui-react';

interface Props {
  close: () => void;
  show: boolean;
  communities: Community[];
  selectedCommunities: number[];
  selectCommunity: (id: number) => void;
}

interface State {
  activeIndex: number;
}

const iconStyle = {
  position: 'absolute',
  right: '2vw',
};

export default class CommunityListWindow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: -1,
    };

    this.onClick = this.onClick.bind(this);
    this.onClickShow = this.onClickShow.bind(this);
  }

  public onClick(e, titleProps: AccordionTitleProps) {
    const { index } = titleProps;
    this.setState({
      activeIndex: index === this.state.activeIndex ? -1 : (index as number),
    });
  }

  public onClickShow(id: number): (e: React.SyntheticEvent<HTMLDivElement>) => void {
    return (e: React.SyntheticEvent<HTMLDivElement>) => {
      e.stopPropagation();
      this.props.selectCommunity(id);
    };
  }

  public getComunityAccordions(): React.ReactNode {
    return this.props.communities.map((community) => {
      const items = community.items.map((node) => (
        <Table.Row key={node.name}>
          <Table.Cell>{node.name}</Table.Cell>
          <Table.Cell>{node.weight}</Table.Cell>
        </Table.Row>
      ));
      const coreRow = community.core && (
        <Table.Row>
          <Table.HeaderCell colSpan='2'>Community核心: {community.core}</Table.HeaderCell>
        </Table.Row>
      );
      return (
        <React.Fragment key={community.id}>
          <Accordion.Title
            style={{ position: 'relative' }}
            index={community.id}
            active={this.state.activeIndex === community.id}
            onClick={this.onClick}
          >
            <Icon name='dropdown' />
            <Icon
              color={
                this.props.selectedCommunities.includes(community.id) ? 'blue' : undefined
              }
              name='eye'
              size='large'
              style={iconStyle}
              onClick={this.onClickShow(community.id)}
            />
            產品群{community.id}
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === community.id}>
            <Table selectable>
              <Table.Header>
                {coreRow}
                <Table.Row>
                  <Table.HeaderCell>名稱</Table.HeaderCell>
                  <Table.HeaderCell>權重</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{items}</Table.Body>
            </Table>
          </Accordion.Content>
        </React.Fragment>
      );
    });
  }

  public render() {
    return (
      <Window
        title='產品Community列表'
        defaultX={250}
        onClickX={this.props.close}
        show={this.props.show}
        defaultHeight={450}
        defaultWidth={500}
      >
        <React.Fragment>
          <Message info content='點擊眼睛圖案可以選擇顯示該產品群' />
          <Accordion styled>{this.getComunityAccordions()}</Accordion>
        </React.Fragment>
      </Window>
    );
  }
}

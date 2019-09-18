import React, { PureComponent } from 'react';

import { Window } from 'Component/';
import { CommunityAccordion } from '../../accordion';
import Report, { Community } from '../../../PnApp/model/Report';
import { Accordion, AccordionTitleProps, Icon, Message } from 'semantic-ui-react';

interface Props {
  close: () => void;
  show: boolean;
  communities: Community[];
  selectedCommunities: number[];
  selectCommunity: (id: number) => void;
  report: Report;
}

interface State {
  activeIndex: number;
  currentCommunity?: Community;
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

  public async onClick(e, titleProps: AccordionTitleProps) {
    const { index } = titleProps;
    const currentCommunity = await this.props.report.getCommunityDetail(index as number);
    this.setState({
      activeIndex: index === this.state.activeIndex ? -1 : (index as number),
      currentCommunity,
    });
  }

  public onClickShow(id: number): (e: React.SyntheticEvent<HTMLDivElement>) => void {
    return (e: React.SyntheticEvent<HTMLDivElement>) => {
      e.stopPropagation();
      this.props.selectCommunity(id);
    };
  }

  public getCommunityAccordions(): React.ReactNode {
    return this.props.communities.map((community) => {
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
            <CommunityAccordion community={this.state.currentCommunity} />
          </Accordion.Content>
        </React.Fragment>
      );
    });
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    return (
      <Window
        title='產品Community列表'
        defaultX={250}
        onClickX={this.props.close}
        defaultHeight={450}
        defaultWidth={500}
      >
        <React.Fragment>
          <Message info content='點擊眼睛圖案可以選擇顯示該產品群' />
          <Accordion styled>{this.getCommunityAccordions()}</Accordion>
        </React.Fragment>
      </Window>
    );
  }
}

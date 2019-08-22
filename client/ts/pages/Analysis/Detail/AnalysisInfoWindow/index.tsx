import React from 'react';
import { Menu, MenuItemProps, Segment } from 'semantic-ui-react';

import { Window } from 'Component/';
import Analysis, { Comment } from '../../../../PnApp/model/Analysis';
import CommentTab from './CommentTab';
import InfoTab from './InfoTab';

interface Props {
  close: () => void;
  show: boolean;
  model: Analysis;
  onSave: () => void;
  comments: Comment[];
}

interface State {
  activeItem: number;
}

export default class AnalysisInfoWindow extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeItem: 0,
    };
  }

  public handleItemClick = (e, { index }: MenuItemProps) => {
    if (index !== undefined) {
      this.setState({ activeItem: index });
    }
  };

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    return (
      <Window
        onClickX={this.props.close}
        defaultHeight={500}
        defaultWidth={700}
        defaultX={350}
        title={this.props.model.title}
      >
        <Menu pointing secondary>
          <Menu.Item
            index={0}
            onClick={this.handleItemClick}
            active={this.state.activeItem === 0}
            name='圖形資訊'
          />
          <Menu.Item
            onClick={this.handleItemClick}
            index={1}
            active={this.state.activeItem === 1}
            name={`留言 (${this.props.comments.length})`}
          />
        </Menu>
        <Segment>
          <InfoTab
            onSaved={this.props.onSave}
            model={this.props.model}
            active={this.state.activeItem === 0}
          />
          <CommentTab
            onSaved={this.props.onSave}
            model={this.props.model}
            active={this.state.activeItem === 1}
            comments={this.props.comments}
          />
        </Segment>
      </Window>
    );
  }
}

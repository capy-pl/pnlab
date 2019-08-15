import React, { PureComponent } from 'react';

import { Window } from 'Component/';

interface Props {
  close: () => void;
  show: boolean;
}

export default class CommunityListWindow extends PureComponent<Props> {
  public render() {
    return (
      <Window
        title='產品Community列表'
        defaultX={250}
        onClickX={this.props.close}
        show={this.props.show}
      >
        community list.
      </Window>
    );
  }
}

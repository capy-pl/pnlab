import React, { PureComponent } from 'react';

import { Window } from 'Component/';
import { SimpleNode } from '../../../../PnApp/model/Report';

interface Props {
  close: () => void;
  show: boolean;
  // productList: SimpleNode[];
}

export default class CommunityCharacterWindow extends PureComponent<Props> {
  public render() {
    return (
      <Window
        title='Community角色列表'
        defaultX={260}
        onClickX={this.props.close}
        show={this.props.show}
      >
        community character.
      </Window>
    );
  }
}

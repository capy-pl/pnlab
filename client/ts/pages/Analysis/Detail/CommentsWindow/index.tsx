import React, { PureComponent } from 'react';
import {
  Menu,
  MenuItemProps,
  Tab,
  Segment,
  Table,
  Comment,
  Button,
} from 'semantic-ui-react';
import { isUndefined } from 'lodash';

import { Window } from 'Component/';
import ModalDeleteComment from 'Component/modal/ModalDeleteComment';
import ModalAddComment from 'Component/modal/ModalAddComment';
import ModalEditComment from 'Component/modal/ModalEditComment';
import Analysis from '../../../../PnApp/model/Analysis';

interface Props {
  close: () => void;
  show: boolean;
  analysis: Analysis;
  onSave: () => Promise<void>;
}

interface State {
  activeIndex: number;
}

export default class CommentsWindow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };

    this.onClickMenu = this.onClickMenu.bind(this);
  }

  public onClickMenu(e, props: MenuItemProps) {
    const { index } = props;
    this.setState({
      activeIndex: index as number,
    });
  }

  public render() {
    if (!this.props.show) {
      return <React.Fragment />;
    }
    const commentDetail = this.props.analysis.comments.map((comment) => {
      return (
        <Table.Row key={comment._id}>
          <Table.Cell textAlign='center'>{comment.name}</Table.Cell>
          <Table.Cell textAlign='center'>{comment.content}</Table.Cell>
          <Table.Cell textAlign='center'>
            <ModalDeleteComment
              model={this.props.analysis}
              comment={comment}
              onSave={this.props.onSave}
            />
            <ModalEditComment
              model={this.props.analysis}
              comment={comment}
              onSave={this.props.onSave}
            />
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Window
        title='Description & Comments'
        defaultX={260}
        onClickX={this.props.close}
        defaultHeight={400}
        defaultWidth={500}
      >
        <React.Fragment>
          <Menu attached='top' tabular>
            <Menu.Item
              onClick={this.onClickMenu}
              index={0}
              active={this.state.activeIndex === 0}
            >
              Description
            </Menu.Item>
            <Menu.Item
              onClick={this.onClickMenu}
              index={1}
              active={this.state.activeIndex === 1}
            >
              Comments
            </Menu.Item>
          </Menu>
          <Segment hidden={this.state.activeIndex !== 0} attached='bottom'>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width='1' textAlign='center'>
                    敘述
                  </Table.HeaderCell>
                  <Table.HeaderCell width='1' textAlign='center'>
                    修改
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell textAlign='center'>
                    {this.props.analysis.description.length
                      ? this.props.analysis.description
                      : '無 Description 資訊。'}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Segment>
          <Segment hidden={this.state.activeIndex !== 1} attached='bottom'>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width='1' textAlign='center'>
                    評論者
                  </Table.HeaderCell>
                  <Table.HeaderCell width='1' textAlign='center'>
                    評論
                  </Table.HeaderCell>
                  <Table.HeaderCell width='1' textAlign='center' />
                </Table.Row>
              </Table.Header>
              <Table.Body>{commentDetail}</Table.Body>
            </Table>
            <ModalAddComment model={this.props.analysis} onSave={this.props.onSave} />
          </Segment>
        </React.Fragment>
      </Window>
    );
  }
}

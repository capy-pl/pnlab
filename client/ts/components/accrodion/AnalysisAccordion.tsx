import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionTitleProps, Button, ButtonProps, Comment, Form, Menu } from 'semantic-ui-react';

import ModalDeleteComment from 'Component/modal/ModalDeleteComment';
import Analysis from '../../PnApp/model/Analysis' ;
import {Comments} from '../../PnApp/model/Analysis' ;

interface AnalysisAccordionState {
  activeItem: number;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  newComment: string;
}

interface AnalysisAccordionProps {
  analysis: Analysis;
  onSave: () => Promise<void>;
}

const accordionStyle: React.CSSProperties = {
  zIndex: 100,
  position: 'absolute',
  width: '20%',
  left: 0,
};

export default class AnalysisAccordion extends PureComponent<AnalysisAccordionProps, AnalysisAccordionState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: -1,
      loading: false,
      error: false,
      errorMessage: '',
      newComment: '',
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAddComment = this.onAddComment.bind(this);
  }

  public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, { index }: AccordionTitleProps): void {
    const activeIndex = this.state.activeItem;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeItem: newIndex });
  }

  public onAddComment(): void {
    if (!(this.state.newComment === '')) {
      try {
        this.setState({ loading: true }, async () => {
          await this.props.analysis.addComment(this.state.newComment);
          this.setState({
            loading: false,
          });
          // this.props.onSave();
        });
      } catch (error) {
        this.setState({
          error: true,
            errorMessage: 'Bad Request',
        });
      }
    }
  }

  public onChange(e, data: { [key: string]: any }): void {
    this.setState({
      newComment: data.value,
    });
  }

  public render() {
    const commentDetail = this.props.analysis.comments.map((comment) => {
      return (
        <Comment key={comment._id}>
          <Comment.Content>
            <Comment.Author>
              {comment.user_id}
            </Comment.Author>
            <Comment.Text>
              {comment.content}
            </Comment.Text>
            <Comment.Actions>
              <ModalDeleteComment
                model={this.props.analysis}
                comment={comment}
                onSave={this.props.onSave}
              />
              <Comment.Action>修改</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      );
    });
    return (
      <Accordion as={Menu} vertical style={accordionStyle}>
        <Menu.Item>
          <Accordion.Title
            active={this.state.activeItem === 0}
            content='Description'
            index={0}
            onClick={this.onClick}
          />
          <Accordion.Content active={this.state.activeItem === 0} >
            {this.props.analysis.description}
          </Accordion.Content>

        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={this.state.activeItem === 1}
            content='Comments'
            index={1}
            onClick={this.onClick}
          />
          <Accordion.Content
            active={this.state.activeItem === 1}
          >
            <Comment.Group>
              {commentDetail}
              <Form reply>
                <Form.TextArea
                  onChange={this.onChange}
                />
                <Button content='新增' labelPosition='left' icon='edit' primary onClick={this.onAddComment}/>
              </Form>
            </Comment.Group>
          </Accordion.Content>
        </Menu.Item>
      </Accordion>
    );
  }
}

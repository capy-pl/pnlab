import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionTitleProps,
  Button,
  Checkbox,
  Comment,
  Divider,
  Form,
  Label,
  Menu,
  Sidebar} from 'semantic-ui-react';

import ModalDeleteComment from 'Component/modal/ModalDeleteComment';
import Analysis from '../../PnApp/model/Analysis' ;
import Report from '../../PnApp/model/Report';

interface AnalysisAccordionState {
  descriptionVisible: boolean;
  commentListVisible: boolean;
  loading: boolean;
  error: boolean;
  errorMessage: string;
  newComment: string;
  rankVisible: boolean;
  commentVisible: boolean;
  communityRankVisible: boolean;
  conditionsVisible: boolean;
}

interface AnalysisAccordionProps {
  analysis: Analysis;
  report: Report;
  onSave: () => Promise<void>;
  visible: boolean;
  showCommunity: boolean;
  onShowProductNetwork: () => void;
  onShowCommunities: () => void;
  onShowProductRank: (event) => void;
  onShowCommunitiesRank: (event) => void;
  onShowCharacter: (event) => void;

}

const sidebarStyle: React.CSSProperties = {
  zIndex: 100,
  height: '100%',
  width: '15%',
  position: 'absolute',
  top: '20%',
  right: 0,
};

const sidebarStyle2: React.CSSProperties = {
  zIndex: 100,
  height: '100%',
  width: '17%',
  position: 'absolute',
  top: '20%',
  right: '15%',
};

export default class AnalysisAccordion extends PureComponent<AnalysisAccordionProps, AnalysisAccordionState> {
  constructor(props) {
    super(props);
    this.state = {
      descriptionVisible: false,
      commentListVisible: false,
      loading: false,
      error: false,
      errorMessage: '',
      newComment: '',
      rankVisible: false,
      commentVisible: false,
      communityRankVisible: false,
      conditionsVisible: false,
    };
    this.ondescriptionClick = this.ondescriptionClick.bind(this);
    this.oncommentsClick = this.oncommentsClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAddComment = this.onAddComment.bind(this);
    this.commentHandle = this.commentHandle.bind(this);
    this.productRankHandle = this.productRankHandle.bind(this);
    this.communityRankHandle = this.communityRankHandle.bind(this);
    this.conditionsHandle = this.conditionsHandle.bind(this);
  }

  public ondescriptionClick() {
    this.setState((prevState) => ({ descriptionVisible: !prevState.descriptionVisible }));
  }

  public oncommentsClick() {
    this.setState((prevState) => ({ commentListVisible: !prevState.commentListVisible }));
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

  public commentHandle() {
    this.setState((prevState) => ({ commentVisible: !prevState.commentVisible }));
  }

  public productRankHandle() {
    this.setState((prevState) => ({ rankVisible: !prevState.rankVisible }));
  }

  public communityRankHandle() {
    this.setState((prevState) => ({ communityRankVisible: !prevState.communityRankVisible }));
  }

  public conditionsHandle() {
    this.setState((prevState) => ({ conditionsVisible: !prevState.conditionsVisible }));
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
    const conditionList = this.props.report.conditions.map((condition) => {
      if (condition.values.length !== 0) {
        const values = condition.values.map((value) => {
          return (<Label key={value} style={{margin: '.2rem'}}>{value}</Label>);
        });
        return (
          <div key={condition.name} style={{margin: '1rem 0 1rem 0' }}>
            <h5>{condition.name}: </h5>
            {values}
            <Divider />
          </div>
        );
      }
    });
    return (
      <React.Fragment>
        <Sidebar.Pushable
          style={sidebarStyle}
        >
          <Sidebar
            visible={this.props.visible}
            as={Menu}
            animation='overlay'
            vertical
            direction='right'
            style={{width: '100%'}}
          >
            <Menu.Item>
              <h5>
                {this.props.analysis.title}
              </h5>
            </Menu.Item>
            <Menu.Item onClick={this.conditionsHandle}>
              條件
            </Menu.Item>
            <Menu.Item onClick={this.commentHandle}>
              註解
            </Menu.Item>
            <Menu.Item >
              <Checkbox
                toggle
                label={this.props.showCommunity ? '隱藏Community' : '顯示Community'}
                onChange={this.props.showCommunity ? this.props.onShowProductNetwork : this.props.onShowCommunities}
              />
            </Menu.Item>
            <Menu.Item>
              <Accordion>
                <Accordion.Title
                  active={this.state.rankVisible}
                  content='Product Network'
                  onClick={this.productRankHandle}
                />
                <Accordion.Content as='a' active={this.state.rankVisible}>
                  <div style={{width: '100%'}}  onClick={this.props.onShowProductRank}>
                    產品排名
                  </div>
                </Accordion.Content>
              </Accordion>
            </Menu.Item>
            <Menu.Item>
              <Accordion>
                <Accordion.Title
                  active={this.state.communityRankVisible}
                  content='Communities'
                  onClick={this.communityRankHandle}
                />
                <Accordion.Content as='a' active={this.state.communityRankVisible}>
                  <div style={{width: '100%'}}  onClick={this.props.onShowCommunitiesRank}>
                    Communities排名
                  </div>
                </Accordion.Content>
                <Accordion.Content as='a' active={this.state.communityRankVisible}>
                  <div style={{width: '100%'}}  onClick={this.props.onShowCharacter}>
                    Communities角色
                  </div>
                </Accordion.Content>
              </Accordion>
            </Menu.Item>
          </Sidebar>
        </Sidebar.Pushable>

        {/* Comment Sidebar */}
        <Sidebar.Pushable
          style={sidebarStyle2}
        >
          <Sidebar
            visible={this.state.commentVisible && this.props.visible}
            as={Menu}
            vertical
            direction='right'
            animation='overlay'
            style={{width: '100%'}}
          >
            <Accordion styled>
              <Accordion.Title
                active={this.state.descriptionVisible}
                content='Description'
                onClick={this.ondescriptionClick}
              />
              <Accordion.Content active={this.state.descriptionVisible} >
                {this.props.analysis.description}
              </Accordion.Content>

              <Accordion.Title
                active={this.state.commentListVisible}
                content='Comments'
                onClick={this.oncommentsClick}
              />
              <Accordion.Content
                active={this.state.commentListVisible}
              >
                <div style={{width: '100%'}}>
                  <Comment.Group>
                    {commentDetail}
                    <Form reply>
                      <Form.TextArea
                        onChange={this.onChange}
                      />
                      <Button content='新增' labelPosition='left' icon='edit' primary onClick={this.onAddComment}/>
                    </Form>
                  </Comment.Group>
                </div>
              </Accordion.Content>
            </Accordion>
          </Sidebar>
          <Sidebar
            visible={this.state.conditionsVisible && this.props.visible}
            as={Menu}
            vertical
            direction='right'
            animation='overlay'
            icon='labeled'
            style={{width: '100%'}}
          >
            {conditionList}
          </Sidebar>
        </Sidebar.Pushable>
    </React.Fragment>
    );
  }
}

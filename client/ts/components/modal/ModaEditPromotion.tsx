import React from 'react';
import { Button, Message, Modal } from 'semantic-ui-react';

import Promotion, { PromotionModel, PromotionType } from '../../PnApp/model/Promotion';
import { FormEditPromotion } from '../form';

interface ModalEditPromotionState {
  show: boolean;
  loading: boolean;
  name: string;
  type: PromotionType;
  groupOne: string[];
  groupTwo: string[];
  startTime?: Date;
  endTime?: Date;
  error: boolean;
  errorMessage: string;
}

interface ModalEditPromotionProps {
  onSave: () => Promise<void>;
  model: Promotion;
}

export default class ModalAddPromotion extends React.PureComponent<ModalEditPromotionProps, ModalEditPromotionState> {
  constructor(props: any) {
    super(props);
    const { model } = this.props;
    this.state = {
      show: false,
      loading: false,
      error: false,
      name: model.name,
      type: model.type,
      groupOne: model.groupOne,
      groupTwo: model.groupTwo,
      startTime: model.startTime,
      endTime: model.endTime,
      errorMessage: '',
    };

    this.save = this.save.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.groupOneChange = this.groupOneChange.bind(this);
    this.groupTwoChange = this.groupTwoChange.bind(this);
    this.startTimeChange = this.startTimeChange.bind(this);
    this.endTimeChange = this.endTimeChange.bind(this);
  }

  public show() {
    this.setState({
      show: true,
    });
  }

  public close() {
    this.setState({
      show: false,
    });
  }

  public validate(): boolean {
    const keys = {
      name: '名稱',
      type: '種類',
      groupOne: `產品群1`,
      groupTwo: `產品群2`,
      startTime: '開始時間',
      endTime: '結束時間',
    };
    for (const key in keys) {
      if (!this.state[key]) {
        this.setState({
          error: true,
          errorMessage: `${keys[key]}尚未填寫。`,
        });
        return false;
      }
    }

    if ((this.state.startTime as Date) > (this.state.endTime as Date)) {
      this.setState({
        error: true,
        errorMessage: `開始時間大於結束時間。`,
      });
      return false;
    }

    if (!this.state.groupOne.length) {
      this.setState({
        error: true,
        errorMessage: `產品群1為空。`,
      });
      return false;
    }

    if (this.state.type === 'combination' && (!this.state.groupTwo || !this.state.groupTwo.length)) {
      this.setState({
        error: true,
        errorMessage: `產品群2為空。`,
      });
      return false;
    }

    return true;
  }

  public typeChange(e, data: { [key: string]: any }): void {
    this.setState({
      type: data.value,
      groupTwo: [],
    });
  }

  public nameChange(e, data: { [key: string]: any }): void {
    this.setState({
      name: data.value,
    });
  }

  public groupOneChange(e, data: { [key: string]: any }): void {
    this.setState({
      groupOne: data.value,
    });
  }

  public groupTwoChange(e, data: { [key: string]: any }): void {
    this.setState({
      groupTwo: data.value,
    });
  }

  public startTimeChange(e, dateTime: Date): void {
    this.setState({
      startTime: dateTime,
    });
  }

  public endTimeChange(e, dateTime: Date): void {
    this.setState({
      endTime: dateTime,
    });
  }

  public save(): void {
    if (this.validate()) {
      this.setState({ loading: true }, async () => {
        try {
          const promotion: PromotionModel = {
            name: this.state.name,
            type: this.state.type,
            groupOne: this.state.groupOne,
            groupTwo: this.state.groupTwo,
            startTime: (this.state.startTime as Date).toISOString(),
            endTime: (this.state.endTime as Date).toISOString(),
          };

          await this.props.model.update(promotion);
          this.setState({
            loading: false,
            show: false,
          });
          this.props.onSave();
        } catch (error) {
          this.setState({
            error: true,
            errorMessage: 'Bad Request',
          });
        }
      });
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Button
          color='blue'
          size='small'
          onClick={this.show}
          icon='edit'
          style={{ marginBottom: '5px' }}
          content='編輯'
        />
        <Modal open={this.state.show} centered={false}
closeOnDimmerClick={false}>
          <Modal.Header>編輯促銷</Modal.Header>
          <Modal.Content>
            <FormEditPromotion
              type={this.state.type}
              model={this.props.model}
              groupOne={this.state.groupOne}
              groupTwo={this.state.groupTwo}
              nameChange={this.nameChange}
              typeChange={this.typeChange}
              groupOneChange={this.groupOneChange}
              groupTwoChange={this.groupTwoChange}
              startTimeChange={this.startTimeChange}
              endTimeChange={this.endTimeChange}
            />
            <Message hidden={!this.state.error} error>
              {this.state.errorMessage}
            </Message>
          </Modal.Content>
          <Modal.Actions>
            <Button loading={this.state.loading} onClick={this.close}
color='red'>
              取消
            </Button>
            <Button loading={this.state.loading} onClick={this.save}>
              儲存
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

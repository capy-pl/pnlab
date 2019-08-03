import React from 'react';
import {
  Button,
  Message,
  Modal,
} from 'semantic-ui-react';

import Promotion, { PromotionModel, PromotionType } from '../../PnApp/model/Promotion';
import FormAddPromotion from '../form/FormAddPromotion';

interface ModalAddPromotionState {
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

interface ModalAddPromotionProps {
  onAdd: () => Promise<void>;
}

export default class ModalAddPromotion extends React.PureComponent<ModalAddPromotionProps, ModalAddPromotionState> {
  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      loading: false,
      error: false,
      name: '',
      type: 'direct',
      groupOne: [],
      groupTwo: [],
      errorMessage: '',
    };

    this.add = this.add.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
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
      name: '',
      type: 'direct',
      groupOne: [],
      groupTwo: [],
    });
  }

  public clear() {
    this.setState({
      name: '',
      type: 'direct',
      groupOne: [],
      groupTwo: [],
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
      if (!(this.state[key])) {
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

  public typeChange(e, data: {[key: string]: any}): void {
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

  public add(): void {
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

          await Promotion.add(promotion);
          this.setState({
            loading: false,
            show: false,
          });
          this.props.onAdd();
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
          onClick={this.show}
          floated='right'
          style={{ marginBottom: '5px' }}
        >
          新增
        </Button>
        <Modal
          open={this.state.show}
          centered={false}
          closeOnDimmerClick={false}
          onClose={this.clear}
        >
          <Modal.Header>新增促銷</Modal.Header>
          <Modal.Content>
            <FormAddPromotion
              type={this.state.type}
              groupOne={this.state.groupOne}
              groupTwo={this.state.groupTwo}
              nameChange={this.nameChange}
              typeChange={this.typeChange}
              groupOneChange={this.groupOneChange}
              groupTwoChange={this.groupTwoChange}
              startTimeChange={this.startTimeChange}
              endTimeChange={this.endTimeChange}
            />
          <Message
            hidden={!this.state.error}
            error
          >
            {this.state.errorMessage}
          </Message>
          </Modal.Content>
          <Modal.Actions>
            <Button loading={this.state.loading} onClick={this.close} color='red'>取消</Button>
            <Button loading={this.state.loading} onClick={this.add}>新增</Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

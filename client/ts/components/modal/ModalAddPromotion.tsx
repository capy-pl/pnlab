import React from 'react';
import {
  Button,
  Message,
  Modal,
} from 'semantic-ui-react';

import Promotion, { PromotionModel } from '../../PnApp/model/Promotion';
import AddPromotionForm from '../form/PromotionForm';

interface ModalAddPromotionState {
  show: boolean;
  loading: boolean;
  promotion?: PromotionModel;
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
      errorMessage: '',
    };

    this.add = this.add.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public show() {
    this.setState({
      show: true,
    });
  }

  public close() {
    this.setState({
      show: false,
      promotion: undefined,
    });
  }

  public clear() {
    this.setState({
      promotion: undefined,
    });
  }

  public validate(promotion: PromotionModel): boolean {
    const keys = {
      name: '名稱',
      type: '種類',
      groupOne: `產品群1`,
      startTime: '開始時間',
      endTime: '結束時間',
    };
    for (const key in keys) {
      if (!(key in promotion)) {
        this.setState({
          error: true,
          errorMessage: `${keys[key]}尚未填寫。`,
        });
        return false;
      }
    }

    if (new Date(promotion.startTime) > new Date(promotion.endTime)) {
      this.setState({
        error: true,
        errorMessage: `開始時間大於結束時間。`,
      });
      return false;
    }

    if (!promotion.groupOne.length) {
      this.setState({
        error: true,
        errorMessage: `產品群1為空。`,
      });
      return false;
    }

    if (promotion.type === 'combination' && (!promotion.groupTwo || !promotion.groupTwo.length)) {
      this.setState({
        error: true,
        errorMessage: `產品群2為空。`,
      });
      return false;
    }

    return true;
  }

  public onChange<T>(key: string): (e, data: {[key: string]: T }) => void {
    return (e, data) => {
      const promotion = this.state.promotion ? Object.assign({}, this.state.promotion) : {};
      promotion[key] = data.value as T;
      this.setState({
        promotion: promotion as PromotionModel,
        error: false,
      });
    };
  }

  public add(): void {
    const promotion = this.state.promotion;
    if (promotion && this.validate(promotion)) {
      this.setState({ loading: true }, async () => {
        try {
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
            <AddPromotionForm
              onChange={this.onChange}
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

import React from 'react';
import {
  Button,
  Modal,
  TextAreaProps,
  InputOnChangeData,
  Message,
} from 'semantic-ui-react';
import { isUndefined } from 'lodash';

import FormAddAnalysis from '../form/FormAddAnalysis';
import { Report } from '../../PnApp/model';
import { Analysis } from '../../PnApp/model';

interface Props {
  show: boolean;
  report: Report;
  onSuccess?: () => void;
  close: () => void;
}

interface State {
  loading: boolean;
  title: string;
  description: string;
}

class ModalAddAnalysis extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
      title: '',
      description: '',
    };

    this.add = this.add.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  public onTitleChange(e, data: InputOnChangeData): void {
    const { value } = data;
    this.setState({
      title: value,
    });
  }

  public onDescriptionChange(e, data: TextAreaProps): void {
    const { value } = data;
    this.setState({
      description: value as string,
    });
  }

  public add(): void {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await Analysis.add({
          report: this.props.report.id,
          title: this.state.title,
          description: this.state.description,
        });
        this.setState({
          loading: false,
          description: '',
          title: '',
        });
        this.props.close();
      },
    );
  }

  public render() {
    return (
      <Modal open={this.props.show}>
        <Modal.Header>另存圖片</Modal.Header>
        <Modal.Content>
          <FormAddAnalysis
            onDescriptionChange={this.onDescriptionChange}
            onTitleChange={this.onTitleChange}
            description={this.state.description}
            title={this.state.title}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button loading={this.state.loading} onClick={this.props.close} color='red'>
            取消
          </Button>
          <Button onClick={this.add} loading={this.state.loading} color='blue'>
            新增
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalAddAnalysis;

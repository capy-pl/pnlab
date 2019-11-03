import React from 'react';
import { Button, Modal, TextAreaProps, InputOnChangeData } from 'semantic-ui-react';

import FormAddAnalysis from '../form/FormAddAnalysis';
import { Report } from '../../PnApp/model';
import { Analysis } from '../../PnApp/model';

interface Props {
  show: boolean;
  report: Report;
  onSuccess?: (id: string) => void;
  close: () => void;
}

interface State {
  loading: boolean;
  title: string;
  description: string;
}

class ModalAddAnalysis extends React.PureComponent<Props, State> {
  public state: State = {
    loading: false,
    title: '',
    description: '',
  };

  public onTitleChange = (e, data: InputOnChangeData) => {
    const { value } = data;
    this.setState({
      title: value,
    });
  };

  public onDescriptionChange = (e, data: TextAreaProps) => {
    const { value } = data;
    this.setState({
      description: value as string,
    });
  };

  public add = () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const { id } = await Analysis.add({
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
        if (this.props.onSuccess) {
          this.props.onSuccess(id);
          return;
        }
      },
    );
  };

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

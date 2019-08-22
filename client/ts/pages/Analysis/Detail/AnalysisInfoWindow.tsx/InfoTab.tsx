import React from 'react';
import {
  Button,
  Form,
  Input,
  InputOnChangeData,
  Message,
  Table,
  TextArea,
  TextAreaProps,
} from 'semantic-ui-react';

import { Analysis } from '../../../../PnApp/model';

interface Props {
  active: boolean;
  model: Analysis;
  onSaved: () => void;
}

interface State {
  editMode: boolean;
  title: string;
  description: string;
  loading: boolean;
  err: boolean;
  errMessage: string;
}

export default class InfoTab extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false,
      loading: false,
      title: props.model.title,
      description: props.model.description,
      err: false,
      errMessage: '',
    };
  }

  public toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
    });
  };

  public onTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => {
    const { value } = data;
    this.setState({
      title: value,
    });
  };

  public onDescriptionChange = (
    event: React.FormEvent<HTMLTextAreaElement>,
    data: TextAreaProps,
  ) => {
    const { value } = data;
    this.setState({
      description: value as string,
    });
  };

  public save = () => {
    if (!this.state.title.length) {
      this.setState({
        err: true,
        errMessage: '標題不得為空。',
      });
      return;
    }
    this.setState(
      {
        loading: true,
        err: false,
        errMessage: '',
      },
      async () => {
        await this.props.model.update({
          title: this.state.title,
          description: this.state.description,
        });
        this.props.onSaved();
        this.setState({
          loading: false,
          editMode: false,
        });
      },
    );
  };

  public cancel = () => {
    this.toggleEditMode();
    this.setState({
      title: this.props.model.title,
      description: this.props.model.description,
      err: false,
      errMessage: '',
    });
  };

  public render() {
    if (this.props.active) {
      return (
        <Form error={this.state.err} loading={this.state.loading}>
          {this.state.editMode ? (
            <Button.Group floated='right'>
              <Button onClick={this.save} color='blue' style={{ marginBottom: '1em' }}>
                儲存
              </Button>
              <Button.Or />
              <Button
                inverted
                color='blue'
                style={{ marginBottom: '1em' }}
                onClick={this.cancel}
              >
                取消
              </Button>
            </Button.Group>
          ) : (
            <Button
              style={{ marginBottom: '1em' }}
              onClick={this.toggleEditMode}
              floated='right'
              color='blue'
            >
              編輯
            </Button>
          )}
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width='2'>標題</Table.Cell>
                {this.state.editMode ? (
                  <Table.Cell>
                    <Input
                      fluid
                      value={this.state.title}
                      onChange={this.onTitleChange}
                      defaultValue={this.state.title}
                    />
                  </Table.Cell>
                ) : (
                  <Table.Cell>{this.props.model.title}</Table.Cell>
                )}
              </Table.Row>
              <Table.Row>
                <Table.Cell>敘述</Table.Cell>
                {!this.state.editMode ? (
                  <Table.Cell>{this.props.model.description}</Table.Cell>
                ) : (
                  <Table.Cell>
                    <TextArea
                      value={this.state.description}
                      onChange={this.onDescriptionChange}
                      defaultValue={this.state.description}
                    />
                  </Table.Cell>
                )}
              </Table.Row>
            </Table.Body>
          </Table>
          <Message error content={this.state.errMessage} />
        </Form>
      );
    }
    return <React.Fragment />;
  }
}

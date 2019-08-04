import React, { PureComponent } from 'react';
import {
  Form,
  InputOnChangeData,
  TextAreaProps,
} from 'semantic-ui-react';

interface FormAddAnalysisProps {
  updateFormAdd: (title) => void;
}

interface FormAddAnalysisState {
  title: string;
  note: string;
  [key: string]: string;
}

export default class FormAddAnalysis extends PureComponent<FormAddAnalysisProps, FormAddAnalysisState> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      note: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  public onChange(keyName: 'title' | 'note'):
  (event: React.SyntheticEvent<HTMLInputElement, Event> | React.FormEvent<HTMLTextAreaElement>,
   data: TextAreaProps | InputOnChangeData) => void {
    return (e, { value }) => {
      this.setState({ [keyName]: value as string}, () => {
        this.props.updateFormAdd(this.state.title);
      });
    };
  }

  public render() {
    const { title, note } = this.state;

    return (
      <div style={{backgroundColor: 'white', padding: '20px'}}>
        <Form>
          <Form.Input
            required
            label='圖片名稱'
            placeholder='圖片名稱'
            name='title'
            value={title}
            onChange={this.onChange('title')}
          />
          <Form.TextArea
            label='圖片註解'
            placeholder='圖片註解'
            name='note'
            value={note}
            onChange={this.onChange('note')}
          />
        </Form>
      </div>
    );
  }
}

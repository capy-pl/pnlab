import React, { PureComponent } from 'react';
import { Form, InputOnChangeData, TextAreaProps } from 'semantic-ui-react';

interface Props {
  onTitleChange: (e, data: InputOnChangeData) => void;
  onDescriptionChange: (e, data: TextAreaProps) => void;
  description: string;
  title: string;
}

export default class FormAddAnalysis extends PureComponent<Props> {
  public render() {
    return (
      <div style={{ backgroundColor: 'white', padding: '20px' }}>
        <Form>
          <Form.Input
            required
            label='圖片名稱'
            placeholder='圖片名稱'
            name='title'
            value={this.props.title}
            onChange={this.props.onTitleChange}
          />
          <Form.TextArea
            label='圖片註解'
            placeholder='圖片註解'
            name='note'
            value={this.props.description}
            onChange={this.props.onDescriptionChange}
          />
        </Form>
      </div>
    );
  }
}

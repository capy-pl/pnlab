import React, { PureComponent } from 'react';
import { Form } from 'semantic-ui-react';

interface FormSaveState {
  title: string;
  note: string;
}
export default class SaveGraphForm extends PureComponent<{}, FormSaveState> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      note: '',
    };
    this.handleChange = this.handleChange.bind(this);

  }
  public handleChange(keyName: 'title' | 'note', value: string): void {
    if (keyName === 'title') {
      this.setState({ title: value });
    } else {
      this.setState({ note: value });
    }
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
            onChange={(e, { value }) => { this.handleChange('title', value as string); }}
          />
          <Form.TextArea
            label='圖片註解'
            placeholder='圖片註解'
            name='note'
            value={note}
            onChange={(e, { value }) => { this.handleChange('note', value as string); }}
          />
        </Form>
      </div>
    );
  }
}

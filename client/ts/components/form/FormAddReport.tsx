import React, { PureComponent } from 'react';
import {
  Button,
  Dropdown,
  DropdownProps,
  Header,
  Icon,
  Message,
  Segment,
  Step,
} from 'semantic-ui-react';

import { AddReportTime } from 'Component/input';
import { Condition } from '../../PnApp/model/Report';

interface FormAddReportInputProps {
  condition: Condition;
  defaultValue: string[];
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const FormAddReportInput = ({ condition, onChange, defaultValue }: FormAddReportInputProps) => {
  if (condition.type === 'string' || condition.type === 'promotion') {
    const options = condition.values.map((value) => {
      return {
        text: value,
        value,
      };
    });

    return (
      <Segment color='teal'>
        <Header block>{condition.name}</Header>
        <Dropdown
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={`Please select ${condition.name}`}
          fluid
          multiple
          search
          selection
          options={options}
        />
      </Segment>
    );
  } else if (condition.type === 'date') {
    return (
      <AddReportTime
        onChange={onChange}
        condition={condition}
        defaultValues={defaultValue}
      />
    );
  } else {
    return <React.Fragment />;
  }
};

type PartType = 'add' | 'remove' | 'time' | 'confirm';

interface Part {
  type: PartType;
  conditions: Condition[];
}

interface PartProps {
  type: PartType;
  onAdd: () => void;
  conditions: Condition[];
  defaultValues: { [key: string]: string[] };
  onChange: (name: string) =>
    ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

const Part = ({ conditions, onChange, type, defaultValues, onAdd }: PartProps) => {
  if (type === 'confirm') {
    return (
      <Segment textAlign='center'>
        <Button
          color='blue'
          fluid
          onClick={onAdd}
        >
          確認新增
        </Button>
      </Segment>
    );
  }

  const inputs = conditions.map((condition) => (
    <FormAddReportInput
      defaultValue={condition.name in defaultValues ? defaultValues[condition.name] : []}
      key={condition.name}
      condition={condition}
      onChange={onChange(condition.name)}
    />));
  return (
      <React.Fragment>
        {inputs}
      </React.Fragment>
  );
};

interface FormAddReportProps {
  conditions: Condition[];
  defaultValues: { [key: string]: string[] };
  validate: () => string[];
  onAdd: () => void;
  onChange: (name: string) =>
    ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

interface FormAddReportState {
  counter: number;
  error: boolean;
  errorMessages: string[];
}

class FormAddReport extends PureComponent<FormAddReportProps, FormAddReportState> {
  public parts: Part[];
  public types: PartType[];
  constructor(props: FormAddReportProps) {
    super(props);
    this.state = {
      counter: 0,
      error: false,
      errorMessages: [],
    };
    this.types = ['add', 'remove', 'time', 'confirm'];
    this.parts = this.getParts(this.props.conditions);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  public nextPage(): void {
    if (this.state.counter === this.types.length - 1) {
      return;
    }
    const errorMessages = this.props.validate();
    if (errorMessages.length > 0) {
      this.setState({
        error: true,
        errorMessages,
      });
      return;
    }
    this.setState({
      counter: this.state.counter + 1,
      error: false,
      errorMessages: [],
    });
  }

  public previousPage(): void {
    if (this.state.counter === 0) {
      return;
    }
    if (this.state.errorMessages.length > 0) {
      return;
    }
    this.setState({
      error: false,
      errorMessages: [],
      counter: this.state.counter - 1,
    });
  }

  public getParts(conditions: Condition[]): Part[] {
    const add: Part = {
      type: 'add',
      conditions: [],
    };
    const remove: Part = {
      type: 'remove',
      conditions: [],
    };
    const time: Part = {
      type: 'time',
      conditions: [],
    };

    const confirm: Part = {
      type: 'confirm',
      conditions: [],
    };

    // TODO: Should use condition.actions to categorize. 懶得弄zz
    for (const condition of conditions) {
      if (condition.type === 'string') {
        add.conditions.push(condition);
      }
      if (condition.type === 'promotion') {
        remove.conditions.push(condition);
      }
      if (condition.type === 'date') {
        time.conditions.push(condition);
      }
    }

    return [add, remove, time, confirm];
  }

  public render() {
    const part = this.parts[this.state.counter];
    const errorMessages = this.state.errorMessages
    .map((err) => <Message.Item key={err}>{err}</Message.Item>);
    return (
      <Segment>
        <Step.Group
          fluid
          ordered
        >
          <Step
            active={this.state.counter === 0}
            completed={0 < this.state.counter}
          >
            <Step.Content>
              <Step.Title>
                請選擇要篩選標籤
              </Step.Title>
            </Step.Content>
          </Step>
          <Step
            active={this.state.counter === 1}
            completed={1 < this.state.counter}
          >
            <Step.Content>
              <Step.Title>
                請選擇要刪除的項目
              </Step.Title>
            </Step.Content>
          </Step>
          <Step
            active={this.state.counter === 2}
            completed={2 < this.state.counter}
          >
            <Step.Content>
              <Step.Title>
                請選擇時間範圍
              </Step.Title>
            </Step.Content>
          </Step>
          <Step
            active={this.state.counter === 3}
            completed={3 < this.state.counter}
          >
            <Step.Content>
              <Step.Title>
                確認新增
              </Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
        <Button.Group attached='top'>
          <Button
            icon
            labelPosition='left'
            onClick={this.previousPage}
            disabled={this.state.counter === 0}
          >
            <Icon name='arrow left' />
            前一步
          </Button>
          <Button
            icon
            labelPosition='right'
            onClick={this.nextPage}
            disabled={this.state.counter === this.types.length - 1}
          >
            <Icon name='arrow right' />
            下一步
          </Button>
        </Button.Group>
        <Message
          hidden={!this.state.error}
          error
        >
          <Message.Header>錯誤</Message.Header>
          <Message.List>
            {errorMessages}
          </Message.List>
        </Message>
        <Part
          onAdd={this.props.onAdd}
          defaultValues={this.props.defaultValues}
          key={part.type}
          type={part.type}
          onChange={this.props.onChange}
          conditions={part.conditions}
        />
      </Segment>
    );
  }
}

export default FormAddReport;

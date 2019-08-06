import React, { PureComponent } from 'react';
import {
  Button,
  Dropdown,
  DropdownProps,
  Header,
  Icon,
  Message,
  Segment,
  SemanticCOLORS,
} from 'semantic-ui-react';

import { DatetimeInput } from 'Component/';
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
    <Segment color='grey'>
      <Header block>開始時間</Header>
      <Header block>結束時間</Header>
    </Segment>
    );
  } else {
    return <React.Fragment />;
  }
};

type PartType = 'add' | 'remove' | 'time';
interface Part {
  title: string;
  type: PartType;
  conditions: Condition[];
}

interface PartProps {
  title: string;
  type: PartType;
  conditions: Condition[];
  defaultValues: { [key: string]: string[] };
  onChange: (name: string) =>
    ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

const Part = ({ conditions, onChange, title, type, defaultValues }: PartProps) => {
  const inputs = conditions.map((condition) => (
    <FormAddReportInput
      defaultValue={condition.name in defaultValues ? defaultValues[condition.name] : []}
      key={condition.name}
      condition={condition}
      onChange={onChange(condition.name)}
    />));
  let color: SemanticCOLORS = 'blue';
  if (type === 'remove') {
    color = 'red';
  }
  return (
      <React.Fragment>
      <Message color={color}>
        <Message.Header>{title}</Message.Header>
      </Message>
        {inputs}
      </React.Fragment>
  );
};

interface FormAddReportProps {
  conditions: Condition[];
  defaultValues: { [key: string]: string[] };
  onChange: (name: string) =>
    ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

interface FormAddReportState {
  counter: number;
}

class FormAddReport extends PureComponent<FormAddReportProps, FormAddReportState> {
  public parts: Part[];
  public types: PartType[];
  constructor(props: FormAddReportProps) {
    super(props);
    this.state = {
      counter: 0,
    };
    this.types = ['add', 'remove', 'time'];
    this.parts = this.getParts(this.props.conditions);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  public nextPage(): void {
    if (this.state.counter === this.types.length - 1) {
      return;
    }
    this.setState({
      counter: this.state.counter + 1,
    });
  }

  public previousPage(): void {
    if (this.state.counter === 0) {
      return;
    }
    this.setState({
      counter: this.state.counter - 1,
    });
  }

  public getParts(conditions: Condition[]): Part[] {
    const add: Part = {
      type: 'add',
      title: '選擇要留下的項目',
      conditions: [],
    };
    const remove: Part = {
      type: 'remove',
      title: '請選擇要刪除的項目',
      conditions: [],
    };
    const time: Part = {
      type: 'time',
      title: '請選擇時間範圍',
      conditions: [],
    };

    // TODO: Should condition.actions to categorize. 懶得弄zz
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

    return [add, remove, time];
  }

  public render() {
    const part = this.parts[this.state.counter];
    return (
      <Segment>
        <Button.Group attached='top'>
          <Button
            icon
            labelPosition='left'
            onClick={this.previousPage}
            disabled={this.state.counter === 0}
          >
            <Icon name='arrow left' />
            Previous
          </Button>
          <Button
            icon
            labelPosition='right'
            onClick={this.nextPage}
            disabled={this.state.counter === this.types.length - 1}
          >
            <Icon name='arrow right' />
            Next
          </Button>
        </Button.Group>
          <Part
            defaultValues={this.props.defaultValues}
            key={part.type}
            type={part.type}
            onChange={this.props.onChange}
            title={part.title}
            conditions={part.conditions}
          />
      </Segment>
    );
  }
}

export default FormAddReport;

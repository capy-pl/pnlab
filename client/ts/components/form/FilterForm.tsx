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

import { Condition } from '../../PnApp/model/Report';

interface FilterFormInputProps {
  condition: Condition;
  defaultValue: string[];
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const FilterFormInput = ({ condition, onChange, defaultValue }: FilterFormInputProps) => {
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
    <FilterFormInput
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

interface FilterFormProps {
  conditions: Condition[];
  defaultValues: { [key: string]: string[] };
  onChange: (name: string) =>
    ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

interface FilterFormState {
  counter: number;
}

class FilterForm extends PureComponent<FilterFormProps, FilterFormState> {
  public parts: Part[];
  public types: PartType[];
  constructor(props: FilterFormProps) {
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

export default FilterForm;

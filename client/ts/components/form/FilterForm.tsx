import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Button, Dropdown, DropdownProps, Header, Segment } from 'semantic-ui-react';

import { Condition } from '../../PnApp/model/Report';

interface FilterFormProps {
  conditions: Condition[];
  onChange: (name: string) =>
  ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

interface FilterFormInputProps {
  condition: Condition;
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const FilterFormInput = ({ condition, onChange }: FilterFormInputProps) => {
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
  conditions: Condition[];
  onChange: (name: string) =>
    ((event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void);
}

const Part = ({ conditions, onChange, title }: PartProps) => {
  const inputs = conditions.map((condition) => (
    <FilterFormInput
      key={condition.name}
      condition={condition}
      onChange={onChange(condition.name)}
    />));
  return (
    <React.Fragment>
      <Header textAlign='center' >{title}</Header>
      {inputs}
    </React.Fragment>
  );
};

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
    const partPages = this.parts
    .filter((part) => part.type === this.types[this.state.counter])
    .map((part) => (
      <Part
        onChange={this.props.onChange}
        title={part.title}
        conditions={part.conditions}
      />
    ));
    return (
      <Segment>
        <Button.Group attached='top'>
          <Button
            onClick={this.previousPage}
            disabled={this.state.counter === 0}
          >
            Previous
          </Button>
          <Button
            onClick={this.nextPage}
            disabled={this.state.counter === this.types.length - 1}
          >
            Next
          </Button>
        </Button.Group>
        {/* <CSSTransition> */}
          {partPages}
        {/* </CSSTransition> */}
      </Segment>
    );
  }
}

export default FilterForm;

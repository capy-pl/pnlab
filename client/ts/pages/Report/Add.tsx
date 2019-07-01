import React, { PureComponent } from 'react';
import { Button, Container, DropdownProps, Segment } from 'semantic-ui-react';

import FilterForm from '../../components/form/FilterForm';
import { Report } from '../../PnApp/Model';
import { Condition, ConditionType } from '../../PnApp/Model/Report';

interface AddState {
  loading: boolean;
  conditions: Condition[];
  conditionArgs: Map<string, Condition>;
}

export default class Add extends PureComponent<{}, AddState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      conditions: [],
      conditionArgs: new Map(),
    };

    this.onChange = this.onChange.bind(this);
  }

  public async componentDidMount() {
    const conditions = await Report.getConditions();
    this.setState({
      conditions,
      loading: false,
    });
  }

  public onChange(name: string, type: string):
  (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void {
    return (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
      const values = data.value as string[];
      const condition = {
        name,
        type: type as ConditionType,
        values,
      };
      console.log(name, condition);
      this.state.conditionArgs.set(name, condition);
    };
  }

  public render() {
    return (
      <Container>
        <Segment.Group
          loading={this.state.loading}
        >
          <FilterForm onChange={this.onChange} conditions={this.state.conditions} />
          <Button
            color='blue'
            fluid
          >Confirm
          </Button>
        </Segment.Group>
      </Container>
    );
  }
}

import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, DropdownProps, Segment } from 'semantic-ui-react';

import FilterForm from 'Component/form/FilterForm';
import Loader from 'Component/Loader';
import ModalConfirm from 'Component/modal/Confirm';
import { Report } from '../../PnApp/model';
import { Condition, ConditionType } from '../../PnApp/model/Report';

interface AddState {
  loading: boolean;
  buttonLoading: boolean;
  conditions: Condition[];
  conditionArgs: { [key: string]: string[]};
  modalOpen: boolean;
}

export default class Add extends PureComponent<RouteComponentProps, AddState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      conditions: [],
      conditionArgs: {},
      modalOpen: false,
      buttonLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  public async componentDidMount() {
    const conditions = await Report.getConditions();
    this.setState({
      conditions,
      loading: false,
    });
  }

  public onChange(name: string):
  (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void {
    return (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void => {
      const values = data.value as string[];
      this.setState({
        conditionArgs: {
          ...this.state.conditionArgs,
          [name]: values,
        },
      });
    };
  }

  public transformArgsToCondition(): Condition[] {
    const conditionTypeMap = new Map<string, string>();
    const conditionList: Condition[] = [];
    for (const condition of this.state.conditions) {
      conditionTypeMap.set(condition.name, condition.type);
    }
    for (const name in this.state.conditionArgs) {
      if (conditionTypeMap.get(name)) {
        const condition = {
          type: conditionTypeMap.get(name) as ConditionType,
          name,
          values: this.state.conditionArgs[name],
        };
        conditionList.push(condition);
      }
    }
    return conditionList;
  }

  public onConfirm() {
    this.setState({
      modalOpen: false,
      loading: true,
    });
    Report.add(this.transformArgsToCondition())
      .then(() => {
        this.props.history.push('/');
      });
  }

  public onCancel() {
    this.setState({
      modalOpen: false,
    });
  }

  public onAdd() {
    if (!this.state.loading) {
      this.setState({
        modalOpen: true,
      });
    }
  }

  public render() {
    if (this.state.loading) {
      return <Loader size='huge' />;
    }
    return (
      <Container>
        <Segment.Group>
          <FilterForm
            defaultValues={this.state.conditionArgs}
            onChange={this.onChange}
            conditions={this.state.conditions}
          />
          <ModalConfirm
            header='Confirm'
            content='Are you sure?'
            open={this.state.modalOpen}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}
          >
            <Button
              color='blue'
              fluid
              onClick={this.onAdd}
            >Confirm
            </Button>
          </ModalConfirm>
        </Segment.Group>
      </Container>
    );
  }
}

import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Container,
  DropdownProps,
  Segment,
} from 'semantic-ui-react';

import FormAddReport from 'Component/form/FormAddReport';
import Loader from 'Component/Loader';
import { ModalConfirmReport } from 'Component/modal';
import { Report } from '../../PnApp/model';
import { Condition } from '../../PnApp/model/Report';

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
    const conditionTypeMap = new Map<string, Condition>();
    const conditionList: Condition[] = [];
    for (const condition of this.state.conditions) {
      conditionTypeMap.set(condition.name, condition);
    }
    for (const name in this.state.conditionArgs) {
      if (conditionTypeMap.get(name)) {
        const condition = {
          type: (conditionTypeMap.get(name) as Condition).type,
          name,
          belong: (conditionTypeMap.get(name) as Condition).belong,
          actions: [],
          values: this.state.conditionArgs[name],
        };
        conditionList.push(condition);
      }
    }
    return conditionList;
  }

  public async onConfirm() {
    this.setState({
      modalOpen: false,
      loading: true,
    }, async () => {
        await Report.add(this.transformArgsToCondition());
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
          <FormAddReport
            onAdd={this.onAdd}
            defaultValues={this.state.conditionArgs}
            onChange={this.onChange}
            conditions={this.state.conditions}
          />
          <ModalConfirmReport
            header='新增一個Report'
            content='請確認是否要新增一個Report？在沒有設定任何條件的情況下，有可能需要等候一些時間。'
            open={this.state.modalOpen}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}
          />
        </Segment.Group>
      </Container>
    );
  }
}

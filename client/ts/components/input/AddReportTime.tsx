import React from 'react';
import {
  DropdownProps,
  Form,
  Header,
  Segment,
} from 'semantic-ui-react';
import { stringToDate } from '../../PnApp/Helper';
import { Condition } from '../../PnApp/model/Report';
import Datetime from './Datetime';

interface AddReportTimeProps {
  condition: Condition;
  defaultValues: string[];
  onChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

interface AddReportTimeState {
  values: string[];
}

export default class AddReportTime extends React.PureComponent<AddReportTimeProps, AddReportTimeState> {
  constructor(props: AddReportTimeProps) {
    super(props);
    this.state = {
      values: props.defaultValues.length ? props.defaultValues : props.condition.values,
    };
    this.startTimeChange = this.startTimeChange.bind(this);
    this.endTimeChange = this.endTimeChange.bind(this);
  }

  public startTimeChange(event: React.SyntheticEvent<HTMLElement, Event>, data: Date): void {
    const copy = this.state.values.slice();
    copy[0] = data.toISOString();
    this.setState({
      values: copy,
    }, () => {
      this.props.onChange(event, { value: this.state.values });
    });
  }

  public endTimeChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps): void {
    const copy = this.state.values.slice();
    copy[1] = data.toISOString();
    this.setState({
      values: copy,
    }, () => {
      this.props.onChange(event, { value: this.state.values });
    });
  }

  public render() {
    return (
      <Segment color='grey'>
        <Form>
          <Header block>開始時間</Header>
            <Datetime
              onChange={this.startTimeChange}
              defaultValue={this.props.defaultValues[0]}
              min={stringToDate(this.props.condition.values[0])}
              max={stringToDate(this.props.condition.values[1])}
            />
          <Header block>結束時間</Header>
          <Datetime
            onChange={this.endTimeChange}
            defaultValue={this.props.defaultValues[1]}
            min={stringToDate(this.props.condition.values[0])}
            max={stringToDate(this.props.condition.values[1])}
          />
        </Form>
      </Segment>
    );
  }
}

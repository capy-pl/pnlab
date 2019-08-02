import React from 'react';
import { DropdownProps, Form } from 'semantic-ui-react';

interface DatetimeInputProps {
  yearStart?: number;
  yearEnd?: number;
  onChange?: (e, data: {[key: string]: any}) => void;
}

interface DatetimeInputState {
  year: number;
  month: number;
  day: number;
}

interface Option {
  key: number;
  text: number;
  value: number;
}

type DatetimeKeys = 'year' | 'month' | 'day';

class DatetimeInput extends React.Component<DatetimeInputProps, DatetimeInputState> {
  constructor(props: DatetimeInputProps) {
    super(props);
    this.state = {
      year: 1970,
      month: 1,
      day: 1,
    };
  }

  public getYearOptions(): Option[] {
    let start = 1970;
    let end = 2200;
    const options: Option[] = [];
    if (this.props.yearStart) {
      start = this.props.yearStart;
    }
    if (this.props.yearEnd) {
      end = this.props.yearEnd;
    }
    for (let i = start; i <= end; i++ ) {
      options.push(
        {
          key: i,
          text: i,
          value: i,
        });
    }
    return options;
  }

  public getMonthOptions(): Option[] {
    const options: Option[] = [];
    for (let i = 1; i < 13; i++) {
      options.push({
        key: i,
        text: i,
        value: i,
      });
    }
    return options;
  }

  public isLeapYear(year: number): boolean {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

  public getDayOptions(): Option[] {
    const monthToDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const options: Option[] = [];
    if (this.isLeapYear(this.state.year)) {
      monthToDay[1] = 29;
    }

    for (let i = 1; i <= monthToDay[this.state.month - 1]; i++) {
      options.push({
        text: i,
        value: i,
        key: i,
      });
    }

    return options;
  }

  public onChange(key: DatetimeKeys) {
    return (e, { value }: DropdownProps) => {
      this.setState({
        [key]: value,
      } as any, () => {
        if (this.props.onChange) {
          this.props.onChange(e, {
            value: new Date(this.state.year, this.state.month - 1, this.state.day, 8).toISOString(),
          });
        }
      });
    };
  }

  public render() {
    return (
        <Form.Group>
          <Form.Dropdown
            width={6}
            search
            onChange={this.onChange('year')}
            options={this.getYearOptions()}
            placeholder='年'
            selection
            fluid
          />
          <Form.Dropdown
            width={5}
            search
            placeholder='月'
            closeOnChange={true}
            onChange={this.onChange('month')}
            options={this.getMonthOptions()}
            fluid
            selection
          />
          <Form.Dropdown
            width={5}
            search
            closeOnChange={true}
            placeholder='日'
            onChange={this.onChange('day')}
            options={this.getDayOptions()}
            fluid
            selection
          />
        </Form.Group>
    );
  }
}

export default DatetimeInput;

import React from 'react';
import { DropdownProps, Form } from 'semantic-ui-react';

interface DatetimeInputProps {
  yearStart?: number;
  yearEnd?: number;
  max?: Date;
  min?: Date;
  defaultValue?: string;
  onChange?: (e, dateTime: Date) => void;
}

interface DatetimeInputState {
  year: number;
  month: number;
  day: number;
}

interface Option {
  key: string;
  text: number;
  value: number;
}

type DatetimeKeys = 'year' | 'month' | 'day';

const DEFAULT_MIN_YEAR = new Date(1990, 0, 1, 8);
const DEFAULT_MAX_YEAR = new Date(2040, 11, 31, 8);

class DatetimeInput extends React.PureComponent<DatetimeInputProps, DatetimeInputState> {
  constructor(props: DatetimeInputProps) {
    super(props);
    if (props.defaultValue) {
      const parsed = new Date(props.defaultValue);
      this.state = {
        year: parsed.getFullYear(),
        month: parsed.getMonth() + 1,
        day: parsed.getDate(),
      };
    } else {
      this.state = {
        year: DEFAULT_MIN_YEAR.getFullYear(),
        month: DEFAULT_MIN_YEAR.getMonth(),
        day: DEFAULT_MIN_YEAR.getDate(),
      };
    }
  }

  public getYearOptions(): Option[] {
    let start = DEFAULT_MIN_YEAR.getFullYear();
    let end = DEFAULT_MAX_YEAR.getFullYear();
    const options: Option[] = [];
    if (this.props.min) {
      start = this.props.min.getFullYear();
    }
    if (this.props.max) {
      end = this.props.max.getFullYear();
    }
    for (let i = start; i <= end; i++ ) {
      options.push(
        {
          key: i.toString(),
          text: i,
          value: i,
        });
    }
    return options;
  }

  public getMonthOptions(): Option[] {
    const options: Option[] = [];
    let start = 1;
    let end = 12;
    if (this.props.min && this.state.year === this.props.min.getFullYear()) {
      start = this.props.min.getMonth() + 1;
    }

    if (this.props.max && this.state.year === this.props.max.getFullYear()) {
      end = this.props.max.getMonth() + 1;
    }

    for (let i = start; i <= end; i++) {
      options.push({
        key: i.toString(),
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
    let start = 1;
    let end = monthToDay[this.state.month - 1];
    if (this.props.min
      && this.state.year === this.props.min.getFullYear()
      && this.state.month === this.props.min.getMonth() + 1
    ) {
      start = this.props.min.getDate();
    }

    if (this.props.max
      && this.state.year === this.props.max.getFullYear()
      && this.state.month === this.props.max.getMonth() + 1
    ) {
      console.log(this.props.max.getDate());
      end = this.props.max.getDate();
    }
    for (let i = start; i <= end; i++) {
      options.push({
        text: i,
        value: i,
        key: i.toString(),
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
          this.props.onChange(e, new Date(this.state.year, this.state.month - 1, this.state.day, 8));
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
            defaultValue={this.state.year}
            selection
            fluid
          />
          <Form.Dropdown
            width={5}
            search
            placeholder='月'
            closeOnChange={true}
            defaultValue={this.state.month}
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
            defaultValue={this.state.day}
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

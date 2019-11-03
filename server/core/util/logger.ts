import moment from 'moment';

import Color from './color';

type LoggerLevel = 'critical' | 'error' | 'warning' | 'info' | 'debug' | 'default';

const CRITICAL = 50;
const ERROR = 40;
const WARNING = 30;
const INFO = 20;
const DEBUG = 10;
const DEFAULT = 0;

const levelMap: { [key: string]: number } = {
  critical: CRITICAL,
  error: ERROR,
  warning: WARNING,
  info: INFO,
  debug: DEBUG,
  default: DEFAULT,
};

class Logger {
  private level: LoggerLevel = 'default';

  public info(message: string): void {
    const level = 'info';
    this.log(level, message);
  }

  public debug(message: string): void {
    const level = 'debug';
    this.log(level, message);
  }

  public warning(message: string): void {
    const level = 'warning';
    this.log(level, message);
  }

  public error(err: Error | string): void {
    const level = 'error';
    if (err instanceof Error) {
      this.logError(level, `${err.name}: ${err.message}`);
      if (err.stack) {
        console.error(err);
      }
    } else {
      this.logError(level, err);
    }
  }

  public setLevel(level: LoggerLevel): void {
    this.level = level;
  }

  private logError(level: string, message: string): void {
    if (levelMap[this.level] <= levelMap[level]) {
      console.log(
        `${Color.FgRed}[${moment().format()}] ${level.toUpperCase()} ${message}${
          Color.Reset
        }`,
      );
    }
  }

  private log(level: string, message: string): void {
    if (levelMap[this.level] <= levelMap[level]) {
      console.log(`[${moment().format()}] ${level.toUpperCase()} ${message}`);
    }
  }
}

const logger = new Logger();

export default logger;

import moment from 'moment';

import Color from './color';

export default class Logger {
  public static log(message: string): void {
    console.log(`[${moment().format()}] ${message}`);
  }

  public static error(err: Error): void {
    Logger.errorMessage(`${err.name}: ${err.message}`);
    if (err.stack) {
      console.error(err);
    }
  }

  public static errorMessage(message: string): void {
    console.log(`${Color.BgRed}[${moment().format()}] ${message}${Color.Reset}`);
  }
}

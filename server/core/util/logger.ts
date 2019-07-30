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

  private static errorMessage(message: string): void {
    console.log(`${Color.FgRed}[${moment().format()}] ${message}${Color.Reset}`);
  }
}

/* eslint-disable no-console */
import chalk from 'chalk';

function isDebug() {
  return process.env.DEBUG === 'true';
}

export function logInit(message: string): void {
  if (process.env.NODE_ENV !== 'test') {
    console.log('------------------------------------');
    const initMessage = chalk.hex('#DEADED')(`${message}`);
    console.log(`${chalk.hex('#DEADED').bold('INIT')}: ${initMessage}`);
  }
}

export function logInfo(namespace: string, message: string): void {
  if (isDebug() || process.env.NODE_ENV !== 'test') {
    const infoMessage = chalk.green(`[${namespace}] ${message}`);
    console.info(`${chalk.bgGreen.underline.bold('INFO')}: ${infoMessage}`);
  }
}

export function logWarn(namespace: string, message: string): void {
  if (isDebug() || process.env.NODE_ENV !== 'test') {
    const warnMessage = chalk.yellow(`[${namespace}] ${message}`);
    console.warn(`${chalk.bgYellow.underline.bold('WARN')}: ${warnMessage}`);
  }
}

export const logError = (namespace: string, message: string): void => {
  const errorMessage = chalk.redBright(`[${namespace}] ${message}`);
  console.log(`${chalk.bgRed.underline.bold('ERROR')}: ${errorMessage}`);
};

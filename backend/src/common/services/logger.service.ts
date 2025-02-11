import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as clc from 'cli-color';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly environment: 'development' | 'production' | 'test';
  private readonly isNetworkMode: boolean;
  private readonly logLevels: LogLevel[];

  constructor(private configService: ConfigService) {
    super();
    this.environment = this.configService.get(
      'environment.nodeEnv',
      'development'
    );
    this.isNetworkMode = this.configService.get(
      'environment.isNetworkMode',
      false
    );
    this.logLevels = this.getLogLevels();
  }

  private getLogLevels(): LogLevel[] {
    switch (this.environment) {
      case 'production':
        return ['error', 'warn', 'log'];
      case 'test':
        return ['error', 'warn'];
      case 'development':
        return ['error', 'warn', 'log', 'debug', 'verbose'];
      default:
        return ['error', 'warn', 'log'];
    }
  }

  protected formatMessage(
    level: string,
    message: string,
    context?: string
  ): string {
    const timestamp = clc.blue(`[${new Date().toISOString()}]`);
    const levelStr = `[${level}]`;
    const envMode = `[${(this.environment || 'development').toUpperCase()}:${this.isNetworkMode ? 'NETWORK' : 'LOCAL'}]`;
    const pidInfo = clc.yellow(`[${process.pid}]`);
    const contextInfo = clc.yellow(
      `[${context || this.context || 'Application'}]`
    );

    let coloredLevel: string;
    switch (level) {
      case 'ERROR':
        coloredLevel = clc.red(levelStr);
        break;
      case 'WARN':
        coloredLevel = clc.yellow(levelStr);
        break;
      case 'INFO':
        coloredLevel = clc.green(levelStr);
        break;
      case 'DEBUG':
        coloredLevel = clc.magentaBright(levelStr);
        break;
      case 'VERBOSE':
        coloredLevel = clc.cyanBright(levelStr);
        break;
      default:
        coloredLevel = levelStr;
    }

    return `${timestamp} ${coloredLevel} ${envMode} ${pidInfo} ${contextInfo} ${message}\n`;
  }

  error(message: string | Error, trace?: string, context?: string): void {
    if (this.logLevels.includes('error')) {
      const errorMessage =
        message instanceof Error
          ? `${message.message}\n${message.stack}`
          : message;
      const formattedMessage = this.formatMessage(
        'ERROR',
        errorMessage,
        context
      );
      super.error(formattedMessage, trace, context || this.context);
    }
  }

  warn(message: string, context?: string): void {
    if (this.logLevels.includes('warn')) {
      const formattedMessage = this.formatMessage('WARN', message, context);
      super.warn(formattedMessage, context || this.context);
    }
  }

  log(message: string, context?: string): void {
    if (this.logLevels.includes('log')) {
      const formattedMessage = this.formatMessage('INFO', message, context);
      super.log(formattedMessage, context || this.context);
    }
  }

  debug(message: string, context?: string): void {
    if (this.logLevels.includes('debug')) {
      const formattedMessage = this.formatMessage('DEBUG', message, context);
      super.debug(formattedMessage, context || this.context);
    }
  }

  verbose(message: string, context?: string): void {
    if (this.logLevels.includes('verbose')) {
      const formattedMessage = this.formatMessage('VERBOSE', message, context);
      super.verbose(formattedMessage, context || this.context);
    }
  }

  logObject(
    level: LogLevel,
    obj: any,
    message: string = '',
    context?: string
  ): void {
    const formattedMessage = message
      ? `${message}\n${JSON.stringify(obj, null, 2)}`
      : JSON.stringify(obj, null, 2);

    switch (level) {
      case 'error':
        this.error(formattedMessage, undefined, context);
        break;
      case 'warn':
        this.warn(formattedMessage, context);
        break;
      case 'debug':
        this.debug(formattedMessage, context);
        break;
      case 'verbose':
        this.verbose(formattedMessage, context);
        break;
      default:
        this.log(formattedMessage, context);
    }
  }

  logDevelopmentInfo(message: string, context?: string): void {
    if (this.environment === 'development') {
      const modeInfo = `Running in ${this.isNetworkMode ? 'NETWORK' : 'LOCAL'} development mode`;
      const fullMessage = `${modeInfo} - ${message}`;
      this.log(fullMessage, context);
    }
  }
}

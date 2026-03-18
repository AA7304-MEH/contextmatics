/**
 * Production-Grade Structured Logger
 * weaponized for ContextMatic Phase 9.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  userId?: string;
  projectId?: string;
  transactionId?: string;
  path?: string;
  error?: any;
  [key: string]: any;
}

class Logger {
  private static instance: Logger;
  private isProduction = process.env.NODE_ENV === 'production';

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const structuredLog = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...context,
      environment: process.env.NODE_ENV
    };

    if (this.isProduction) {
      // In production, we would send this to Sentry, Axiom, or Datadog
      // For now, we use a single-line JSON log for easy ingestion by cloud loggers
      console.log(JSON.stringify(structuredLog));
    } else {
      // In development, keep it readable
      const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
      const reset = '\x1b[0m';
      console.log(`${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`, context || '');
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    if (!this.isProduction) {
      this.log('debug', message, context);
    }
  }
}

export const logger = Logger.getInstance();

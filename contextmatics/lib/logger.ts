import { NextResponse } from 'next/server';

type LogLevel = 'info' | 'warn' | 'error';

interface LogData {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  route?: string;
  userId?: string;
  data?: LogData;
  timestamp: string;
}

/**
 * Standardised JSON Logger for production tracking.
 * Supports both logger.info({ message, data }) and logger.info(message, data).
 */
export const logger = {
  info: (msgOrEntry: string | Omit<LogEntry, 'level' | 'timestamp'>, data?: LogData) => 
    log('info', msgOrEntry, data),
  warn: (msgOrEntry: string | Omit<LogEntry, 'level' | 'timestamp'>, data?: LogData) => 
    log('warn', msgOrEntry, data),
  error: (msgOrEntry: string | Omit<LogEntry, 'level' | 'timestamp'>, data?: LogData) => 
    log('error', msgOrEntry, data),
};

function log(level: LogLevel, msgOrEntry: string | Omit<LogEntry, 'level' | 'timestamp'>, data?: LogData) {
  let entry: Partial<LogEntry>;

  if (typeof msgOrEntry === 'string') {
    entry = { message: msgOrEntry, data };
  } else {
    entry = { ...msgOrEntry };
    if (data) entry.data = { ...(entry.data || {}), ...data };
  }

  const output = {
    ...entry,
    level,
    timestamp: new Date().toISOString(),
  };

  // In production, we'd send this to Axiom, Datadog, or Cloudwatch.
  // For standard Next.js, we use console[level] so it appears in Vercel logs.
  if (level === 'error') {
    console.error(JSON.stringify(output));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(output));
  } else {
    console.info(JSON.stringify(output));
  }
}

export function apiError(message: string, code: string, status: number = 500) {
    return NextResponse.json({
        success: false,
        message,
        code
    }, { status });
}

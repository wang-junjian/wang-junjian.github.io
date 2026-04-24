export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: Record<string, any>;
}

const MAX_LOGS = 1000;

let logs: LogEntry[] = [];
let minLevel: LogLevel = 'info';

const levelOrder: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function setMinLevel(level: LogLevel) {
  minLevel = level;
}

export function getMinLevel(): LogLevel {
  return minLevel;
}

export function log(
  level: LogLevel,
  category: string,
  message: string,
  data?: Record<string, any>
) {
  if (levelOrder[level] < levelOrder[minLevel]) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    data,
  };

  logs.push(entry);

  if (logs.length > MAX_LOGS) {
    logs = logs.slice(-MAX_LOGS);
  }

  // Also output to console for development
  const consoleMsg = `[${entry.timestamp}] [${level.toUpperCase()}] [${category}] ${message}`;
  if (data) {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](consoleMsg, data);
  } else {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](consoleMsg);
  }
}

export function debug(category: string, message: string, data?: Record<string, any>) {
  log('debug', category, message, data);
}

export function info(category: string, message: string, data?: Record<string, any>) {
  log('info', category, message, data);
}

export function warn(category: string, message: string, data?: Record<string, any>) {
  log('warn', category, message, data);
}

export function error(category: string, message: string, data?: Record<string, any>) {
  log('error', category, message, data);
}

export function getLogs(
  filter?: {
    level?: LogLevel;
    category?: string;
    since?: string;
    until?: string;
  }
): LogEntry[] {
  let result = [...logs];

  if (filter?.level) {
    const min = levelOrder[filter.level];
    result = result.filter((e) => levelOrder[e.level] >= min);
  }

  if (filter?.category) {
    result = result.filter((e) => e.category === filter.category);
  }

  if (filter?.since) {
    result = result.filter((e) => e.timestamp >= filter.since!);
  }

  if (filter?.until) {
    result = result.filter((e) => e.timestamp <= filter.until!);
  }

  return result;
}

export function clearLogs() {
  logs = [];
}

export function exportLogs(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      total: logs.length,
      logs,
    },
    null,
    2
  );
}

export function downloadLogs(filename?: string) {
  const blob = new Blob([exportLogs()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `ai-chat-logs-${new Date().toISOString().slice(0, 19)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getLogStats(): {
  total: number;
  byLevel: Record<LogLevel, number>;
  byCategory: Record<string, number>;
} {
  const byLevel: Record<string, number> = { debug: 0, info: 0, warn: 0, error: 0 };
  const byCategory: Record<string, number> = {};

  for (const entry of logs) {
    byLevel[entry.level] = (byLevel[entry.level] || 0) + 1;
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
  }

  return {
    total: logs.length,
    byLevel: byLevel as Record<LogLevel, number>,
    byCategory,
  };
}

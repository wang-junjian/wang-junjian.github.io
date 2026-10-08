interface WithDate {
  data: { date?: Date | string };
}

const SHANGHAI_TIME_ZONE = 'Asia/Shanghai';

interface ShanghaiDateComponents {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}

/** 将日期按 Asia/Shanghai（北京时间）拆分为年月日时分，避免构建服务器时区影响。 */
export function getShanghaiDateComponents(date: Date | string): ShanghaiDateComponents {
  const d = typeof date === 'string' ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: SHANGHAI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    hours: parseInt(get('hour'), 10),
    minutes: parseInt(get('minute'), 10),
  };
}

export function sortPostsByDate<T extends WithDate>(posts: T[], direction: 'asc' | 'desc' = 'desc'): T[] {
  return [...posts].sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    const delta = dateB - dateA;
    return direction === 'asc' ? -delta : delta;
  });
}

export function formatDate(
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', { ...options, timeZone: SHANGHAI_TIME_ZONE });
}

export function formatTime(date: Date | string | undefined): string {
  if (!date) return '';
  const { year, month, day, hours, minutes } = getShanghaiDateComponents(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatDateTimeChinese(date: Date | string | undefined): string {
  if (!date) return '';
  const { year, month, day, hours, minutes } = getShanghaiDateComponents(date);
  return `${year}年${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日 ${String(hours).padStart(2, '0')}时${String(minutes).padStart(2, '0')}分`;
}

/** 上海时区的日键 `YYYY-MM-DD`，用于按日分组、data-date 与 llms.txt 等场景。 */
export function formatDayKey(date: Date | string): string {
  const { year, month, day } = getShanghaiDateComponents(date);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** 上海时区的月键 `YYYY-MM`。 */
export function formatMonthKey(date: Date | string): string {
  const { year, month } = getShanghaiDateComponents(date);
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * 把日键解析回 Date（上海时区午夜）。
 * 不能用 `new Date(dayKey + 'T00:00:00')`——本地时区解析在 UTC+13/+14
 * 构建机上会把日键错回前一天。
 */
export function parseDayKey(dayKey: string): Date {
  return new Date(`${dayKey}T00:00:00+08:00`);
}

export function groupPostsByDay<T extends WithDate>(posts: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const post of posts) {
    const date = post.data.date ? new Date(post.data.date) : new Date(0);
    // Use Asia/Shanghai components so the grouping key matches the locale-formatted
    // date shown in EntryCard (avoiding UTC vs local timezone mismatch).
    const key = formatDayKey(date);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(post);
  }
  return groups;
}

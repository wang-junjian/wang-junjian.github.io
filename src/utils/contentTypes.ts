/**
 * 内容类型注册表：type（frontmatter 值）↔ alias（URL 段）↔ label（中文标签）
 * 的单一事实源。路由解析、StreamTabs、类型页文案、卡片徽标全部从这里派生；
 * 新增/改名一个类型只需改这一张表。
 */
export interface ContentType {
  /** frontmatter 的 type 值，如 'quote' */
  type: string;
  /** URL 段（复数别名），如 'quotes' → /quotes/ */
  alias: string;
  /** 中文标签：tab 文案、类型页标题、卡片徽标 */
  label: string;
  /** 类型页 description（SEO） */
  description: string;
  countLabel: (count: number) => string;
  emptyMessage: string;
}

/** 数组顺序即 StreamTabs 的 tab 顺序。 */
export const CONTENT_TYPES: ContentType[] = [
  {
    type: 'article',
    alias: 'articles',
    label: '文档',
    description: '技术文章与教程。',
    countLabel: (count) => `共 ${count} 篇文章`,
    emptyMessage: '暂无文档',
  },
  {
    type: 'quote',
    alias: 'quotes',
    label: '引用',
    description: '收集的文本引用。',
    countLabel: (count) => `共 ${count} 条文本引用`,
    emptyMessage: '暂无文本引用',
  },
  {
    type: 'note',
    alias: 'notes',
    label: '笔记',
    description: '短小的笔记与思考。',
    countLabel: (count) => `共 ${count} 条笔记`,
    emptyMessage: '暂无笔记',
  },
  {
    type: 'link',
    alias: 'links',
    label: '链接',
    description: '收集的链接与推荐。',
    countLabel: (count) => `共 ${count} 条链接`,
    emptyMessage: '暂无链接',
  },
  {
    type: 'release',
    alias: 'releases',
    label: '发布',
    description: '软件发布与版本更新。',
    countLabel: (count) => `共 ${count} 条发布`,
    emptyMessage: '暂无发布',
  },
];

export const CONTENT_TYPE_MAP: Record<string, ContentType> = Object.fromEntries(
  CONTENT_TYPES.map((ct) => [ct.type, ct])
);

const ALIAS_MAP: Record<string, ContentType> = Object.fromEntries(
  CONTENT_TYPES.map((ct) => [ct.alias, ct])
);

/** 由 URL 别名解析内容类型，未命中返回 undefined。 */
export function resolveTypeAlias(alias: string): ContentType | undefined {
  return ALIAS_MAP[alias];
}

/** 类型页 URL：/quotes/ 等。 */
export function getTypeUrl(type: string): string {
  return `/${CONTENT_TYPE_MAP[type].alias}/`;
}

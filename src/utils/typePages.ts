import type { CollectionEntry } from 'astro:content';
import { groupPostsByDay, getAllTags, normalizeTags, getPostDisplayTitle } from './posts';
import { paginate, PAGE_SIZE } from './pagination';

export interface TypePageConfig {
  title: string;
  description: string;
  pageTitle: string;
  countLabel: (count: number) => string;
  emptyMessage: string;
  typeFilter: string;
}

export const TYPE_PAGE_CONFIG: Record<string, TypePageConfig> = {
  article: {
    title: '文档',
    description: '技术文章与教程。',
    pageTitle: '文档',
    countLabel: (count) => `共 ${count} 篇文章`,
    emptyMessage: '暂无文档',
    typeFilter: 'article',
  },
  quote: {
    title: '引用',
    description: '收集的文本引用。',
    pageTitle: '引用',
    countLabel: (count) => `共 ${count} 条文本引用`,
    emptyMessage: '暂无文本引用',
    typeFilter: 'quote',
  },
  note: {
    title: '笔记',
    description: '短小的笔记与思考。',
    pageTitle: '笔记',
    countLabel: (count) => `共 ${count} 条笔记`,
    emptyMessage: '暂无笔记',
    typeFilter: 'note',
  },
  link: {
    title: '链接',
    description: '收集的链接与推荐。',
    pageTitle: '链接',
    countLabel: (count) => `共 ${count} 条链接`,
    emptyMessage: '暂无链接',
    typeFilter: 'link',
  },
  release: {
    title: '发布',
    description: '软件发布与版本更新。',
    pageTitle: '发布',
    countLabel: (count) => `共 ${count} 条发布`,
    emptyMessage: '暂无发布',
    typeFilter: 'release',
  },
};

export interface TypePageData {
  typePosts: CollectionEntry<'posts'>[];
  pageResult: {
    items: CollectionEntry<'posts'>[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  dayGroups: Map<string, CollectionEntry<'posts'>[]>;
  sortedDays: string[];
}

export function getTypePageData(
  allPosts: CollectionEntry<'posts'>[],
  type: string,
  page = 1
): TypePageData {
  const typePosts = allPosts
    .filter((post) => post.data.type === type)
    .sort((a, b) => {
      const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
      const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
      return dateB - dateA;
    });

  const pageResult = paginate(typePosts, page, PAGE_SIZE);
  const dayGroups = groupPostsByDay(pageResult.items);
  const sortedDays = Array.from(dayGroups.keys()).sort((a, b) => b.localeCompare(a));

  return {
    typePosts,
    pageResult,
    dayGroups,
    sortedDays,
  };
}

export interface TypeSidebarData {
  recentContent: Array<{ id: string; title: string; date: Date | string }>;
  recentTags: Array<[string, number]>;
}

export function getTypeSidebarData(typePosts: CollectionEntry<'posts'>[]): TypeSidebarData {
  const recentContent = typePosts.slice(0, 10).map((post) => ({
    id: post.id,
    title: getPostDisplayTitle(post),
    date: post.data.date,
  }));

  const allTags = getAllTags(typePosts);
  const recentTags = Array.from(allTags.entries())
    .map(([tag, posts]) => [tag, posts.length] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  return {
    recentContent,
    recentTags,
  };
}

export function getTypePageTotalPages(allPosts: CollectionEntry<'posts'>[], type: string): number {
  const typePosts = allPosts.filter((post) => post.data.type === type);
  return Math.max(1, Math.ceil(typePosts.length / PAGE_SIZE));
}

export function getTypeStaticPaths(allPosts: CollectionEntry<'posts'>[], type: string) {
  const totalPages = getTypePageTotalPages(allPosts, type);
  const paths: Array<{ params: { path: string | undefined } }> = [{ params: { path: undefined } }];
  for (let p = 2; p <= totalPages; p++) {
    paths.push({ params: { path: `page/${p}` } });
  }
  return paths;
}

export function parseTypePageParam(path: string | undefined): number {
  if (!path) return 1;
  const match = path.match(/^page\/(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

export function typePageNeedsKatex(posts: CollectionEntry<'posts'>[]): boolean {
  const mathRegex = /(?<!\$)\$[^$\n]+?\$(?!\$)|\$\$[\s\S]+?\$\$/;
  return posts.some((post) => mathRegex.test(post.body || ''));
}

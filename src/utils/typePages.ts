import { getPostDisplayTitle } from './displayTitle';
import { getAllTags, normalizeTags } from './tags';
import { PAGE_SIZE, getPagePaths } from './pagination';
import { getStreamPageData } from './streamPage';
import { getEntryUrl, type StreamEntry } from './htmlPosts';

export interface TypePageData {
  typePosts: StreamEntry[];
  pageResult: {
    items: StreamEntry[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  dayGroups: Map<string, StreamEntry[]>;
  sortedDays: string[];
  pageNeedsKatex: boolean;
}

export function getTypePageData(
  allPosts: StreamEntry[],
  type: string,
  page = 1
): TypePageData {
  const filtered = allPosts.filter((post) => post.data.type === type);
  const { sortedPosts, pageResult, dayGroups, sortedDays, pageNeedsKatex } =
    getStreamPageData(filtered, { page });

  return {
    typePosts: sortedPosts,
    pageResult,
    dayGroups,
    sortedDays,
    pageNeedsKatex,
  };
}

export interface TypeSidebarData {
  recentContent: Array<{ id: string; title: string; date: Date | string; url: string }>;
  recentTags: Array<[string, number]>;
}

export function getTypeSidebarData(typePosts: StreamEntry[]): TypeSidebarData {
  const recentContent = typePosts.slice(0, 10).map((post) => ({
    id: post.id,
    title: getPostDisplayTitle(post),
    date: post.data.date,
    url: getEntryUrl(post),
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

export function getTypePageTotalPages(allPosts: StreamEntry[], type: string): number {
  const typePosts = allPosts.filter((post) => post.data.type === type);
  return Math.max(1, Math.ceil(typePosts.length / PAGE_SIZE));
}

export function getTypeStaticPaths(allPosts: StreamEntry[], type: string) {
  const totalPages = getTypePageTotalPages(allPosts, type);
  return getPagePaths(totalPages).map((path) => ({ params: { path } }));
}

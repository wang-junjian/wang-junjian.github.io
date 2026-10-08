import { groupPostsByDay, needsKatex } from './posts';
import { paginate, PAGE_SIZE, type PaginatedResult } from './pagination';
import type { StreamEntry } from './htmlPosts';

/**
 * 文章流页流水线：分页 → 按日分组 → 日序 → KaTeX 探测。
 * 首页、月归档、类型页、标签页共用；月归档等不分页场景传 `paginate: false`。
 *
 * 输入契约：posts 须为 getMergedPosts 的结果或其保序子集（按日期降序），
 * 本函数不再重复排序。
 */
export interface StreamPageData {
  sortedPosts: StreamEntry[];
  pageResult: PaginatedResult<StreamEntry>;
  dayGroups: Map<string, StreamEntry[]>;
  sortedDays: string[];
  pageNeedsKatex: boolean;
}

export function getStreamPageData(
  posts: StreamEntry[],
  { page = 1, paginate: shouldPaginate = true }: { page?: number; paginate?: boolean } = {}
): StreamPageData {
  const sortedPosts = posts;
  const pageResult = shouldPaginate
    ? paginate(sortedPosts, page, PAGE_SIZE)
    : paginate(sortedPosts, 1, Math.max(sortedPosts.length, 1));
  const dayGroups = groupPostsByDay(pageResult.items);
  const sortedDays = Array.from(dayGroups.keys()).sort((a, b) => b.localeCompare(a));

  // Load KaTeX CSS if any post on this page contains math syntax.
  const pageNeedsKatex = needsKatex(pageResult.items);

  return {
    sortedPosts,
    pageResult,
    dayGroups,
    sortedDays,
    pageNeedsKatex,
  };
}

import { getAllTags, normalizeTags } from './tags';
import { PAGE_SIZE, getPagePaths } from './pagination';
import { getStreamPageData } from './streamPage';
import type { StreamEntry } from './htmlPosts';

export interface TagPageData {
  sortedPosts: StreamEntry[];
  pageResult: {
    items: StreamEntry[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  dayGroups: Map<string, StreamEntry[]>;
  sortedDays: string[];
  recentTags: [string, number][];
  pageNeedsKatex: boolean;
}

/**
 * 生成 tags/[tag]/[...page] 的完整静态路径：
 * 每个标签含首页（page 为 undefined）与 page/2..N 分页。
 */
export function getTagStaticPaths(posts: StreamEntry[]) {
  const tags = getAllTags(posts);
  const allTagCounts = new Map(
    Array.from(tags.entries()).map(([tagName, tagPosts]) => [tagName, tagPosts.length])
  );

  const paths: Array<{
    params: { tag: string; page: string | undefined };
    props: { tag: string; posts: StreamEntry[]; allTagCounts: Map<string, number> };
  }> = [];
  for (const [tag, tagPosts] of tags.entries()) {
    const totalPages = Math.max(1, Math.ceil(tagPosts.length / PAGE_SIZE));
    for (const page of getPagePaths(totalPages)) {
      paths.push({
        params: { tag, page },
        props: { tag, posts: tagPosts, allTagCounts },
      });
    }
  }
  return paths;
}

export function getTagPageData(
  tag: string,
  posts: StreamEntry[],
  allTagCounts: Map<string, number>,
  page = 1
): TagPageData {
  const { sortedPosts, pageResult, dayGroups, sortedDays, pageNeedsKatex } =
    getStreamPageData(posts, { page });

  // Related tags: union of tags from posts in this tag, excluding the current tag.
  // Display counts use the global total for each tag.
  const relatedTagSet = new Set<string>();
  for (const post of sortedPosts) {
    for (const t of normalizeTags(post.data.tags)) {
      if (t !== tag) relatedTagSet.add(t);
    }
  }
  const recentTags = Array.from(relatedTagSet)
    .map((t) => [t, allTagCounts.get(t) || 0] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  return {
    sortedPosts,
    pageResult,
    dayGroups,
    sortedDays,
    recentTags,
    pageNeedsKatex,
  };
}

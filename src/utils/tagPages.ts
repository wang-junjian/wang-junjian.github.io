import type { CollectionEntry } from 'astro:content';
import { getAllTags, groupPostsByDay, normalizeTags, sortPostsByDate, needsKatex } from './posts';
import { paginate, PAGE_SIZE } from './pagination';

export interface TagPageData {
  sortedPosts: CollectionEntry<'posts'>[];
  pageResult: {
    items: CollectionEntry<'posts'>[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  dayGroups: Map<string, CollectionEntry<'posts'>[]>;
  sortedDays: string[];
  recentTags: [string, number][];
  pageNeedsKatex: boolean;
}

export function getTagStaticPaths(posts: CollectionEntry<'posts'>[]) {
  const tags = getAllTags(posts);
  const allTagCounts = new Map(
    Array.from(tags.entries()).map(([tagName, tagPosts]) => [tagName, tagPosts.length])
  );

  return Array.from(tags.entries()).map(([tag, tagPosts]) => ({
    params: { tag },
    props: { tag, posts: tagPosts, allTagCounts },
  }));
}

export function getTagPageData(
  tag: string,
  posts: CollectionEntry<'posts'>[],
  allTagCounts: Map<string, number>,
  page = 1
): TagPageData {
  const sortedPosts = sortPostsByDate(posts);
  const pageResult = paginate(sortedPosts, page, PAGE_SIZE);
  const dayGroups = groupPostsByDay(pageResult.items);
  const sortedDays = Array.from(dayGroups.keys()).sort((a, b) => b.localeCompare(a));

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

  // Load KaTeX CSS if any post on this page contains math syntax.
  const pageNeedsKatex = needsKatex(pageResult.items);

  return {
    sortedPosts,
    pageResult,
    dayGroups,
    sortedDays,
    recentTags,
    pageNeedsKatex,
  };
}

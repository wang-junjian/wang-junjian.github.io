import type { CollectionEntry } from 'astro:content';

export function getAllCategories(posts: CollectionEntry<'posts'>[]): Set<string> {
  const categories = new Set<string>();
  for (const post of posts) {
    if (post.data.categories) {
      const cats = Array.isArray(post.data.categories)
        ? post.data.categories
        : [String(post.data.categories)];
      for (const cat of cats) {
        if (cat && cat.trim()) {
          categories.add(cat.trim());
        }
      }
    }
  }
  return categories;
}

export function getAllTags(posts: CollectionEntry<'posts'>[]): Set<string> {
  const tags = new Set<string>();
  for (const post of posts) {
    if (post.data.tags) {
      const postTags = Array.isArray(post.data.tags)
        ? post.data.tags
        : [String(post.data.tags)];
      for (const tag of postTags) {
        if (tag && tag.trim()) {
          tags.add(tag.trim());
        }
      }
    }
  }
  return tags;
}

export function getPostsByCategory(
  posts: CollectionEntry<'posts'>[],
  category: string
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => {
    if (!post.data.categories) return false;
    const cats = Array.isArray(post.data.categories)
      ? post.data.categories
      : [String(post.data.categories)];
    return cats.some(c => c && c.trim() === category);
  });
}

export function getPostsByTag(
  posts: CollectionEntry<'posts'>[],
  tag: string
): CollectionEntry<'posts'>[] {
  return posts.filter((post) => {
    if (!post.data.tags) return false;
    const tags = Array.isArray(post.data.tags)
      ? post.data.tags
      : [String(post.data.tags)];
    return tags.some(t => t && t.trim() === tag);
  });
}

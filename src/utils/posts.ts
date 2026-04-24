import type { CollectionEntry } from 'astro:content';

export function normalizeCategories(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v));

  let str = String(value).trim();

  // Handle YAML list format: [item1, item2]
  if (str.startsWith('[') && str.endsWith(']')) {
    str = str.slice(1, -1).trim();
    // For YAML list in categories, use comma separator
    return str.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  }

  // Split by spaces for categories
  return str.split(/\s+/).map(s => s.trim()).filter(Boolean);
}

export function normalizeTags(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v));

  let str = String(value).trim();

  // Handle YAML list format: [item1, item2]
  if (str.startsWith('[') && str.endsWith(']')) {
    str = str.slice(1, -1).trim();
  }

  // Split by commas (both English and Chinese) for tags
  return str.split(/[,，]/).map(s => s.trim()).filter(Boolean);
}

// Kept for backward compatibility
export function normalizeToArray(value: any): string[] {
  return normalizeTags(value);
}

export function getAllCategories(posts: CollectionEntry<'posts'>[]): Map<string, CollectionEntry<'posts'>[]> {
  const categories = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const cats = normalizeCategories(post.data.categories);
    for (const cat of cats) {
      if (!categories.has(cat)) {
        categories.set(cat, []);
      }
      categories.get(cat)!.push(post);
    }
  }
  return categories;
}

export function getAllTags(posts: CollectionEntry<'posts'>[]): Map<string, CollectionEntry<'posts'>[]> {
  const tags = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const tagList = normalizeTags(post.data.tags);
    for (const tag of tagList) {
      if (!tags.has(tag)) {
        tags.set(tag, []);
      }
      tags.get(tag)!.push(post);
    }
  }
  return tags;
}

export function formatDate(
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', options);
}

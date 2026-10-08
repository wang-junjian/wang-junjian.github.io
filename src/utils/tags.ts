export function normalizeTags(value: unknown): string[] {
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

export function getAllTags<T extends { data: { tags?: unknown } }>(posts: T[]): Map<string, T[]> {
  const tags = new Map<string, T[]>();
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

import fs from 'fs';
import path from 'path';

export interface Post {
  file: string;
  slug: string;
  data: {
    title?: string;
    date?: string;
    categories?: string | string[] | null;
    tags?: string | string[] | null;
    [key: string]: any;
  };
}

export function getPosts(projectRoot: string): Post[] {
  const postsDir = path.join(projectRoot, 'src', 'content', 'posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  return files.map((file) => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
    let frontmatter: any = {};

    if (frontmatterMatch) {
      const frontmatterStr = frontmatterMatch[1];
      const lines = frontmatterStr.split('\n').filter(l => l.trim());
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.slice(0, colonIndex).trim();
          let value = line.slice(colonIndex + 1).trim();

          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          // Parse YAML list format: [item1, item2]
          if (value.startsWith('[') && value.endsWith(']')) {
            const listContent = value.slice(1, -1).trim();
            if (listContent) {
              frontmatter[key] = listContent.split(/[,，]/).map(s => s.trim()).filter(Boolean);
            } else {
              frontmatter[key] = [];
            }
          } else {
            frontmatter[key] = value;
          }
        }
      }
    }

    return {
      file,
      slug: file.replace(/\.md$/, ''),
      data: frontmatter,
    };
  });
}

export function getSortedPosts(projectRoot: string): Post[] {
  const posts = getPosts(projectRoot);
  return posts.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });
}

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

export function getAllCategories(posts: Post[]): Map<string, Post[]> {
  const categories = new Map<string, Post[]>();
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

export function getAllTags(posts: Post[]): Map<string, Post[]> {
  const tags = new Map<string, Post[]>();
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

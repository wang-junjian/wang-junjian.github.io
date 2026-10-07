import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { metaContent, titleContent } from './htmlMeta';

const TOOLS_DIR = 'tools';

export interface ToolMeta {
  file: string;
  title: string;
  excerpt?: string;
  tags: string[];
  date?: string;
  author?: string;
}

export function getTools(baseDir = process.cwd()): ToolMeta[] {
  const toolsDir = join(baseDir, TOOLS_DIR);

  try {
    const files = readdirSync(toolsDir).filter(
      (f) => f.endsWith('.html') && f !== 'index.html' && !f.startsWith('_')
    );

    return files
      .map((file) => {
        const raw = readFileSync(join(toolsDir, file), 'utf-8');
        const title = titleContent(raw) ?? file.replace(/\.html$/, '');
        const excerpt = metaContent(raw, 'description');
        const keywords = metaContent(raw, 'keywords');
        const tags = keywords
          ? keywords
              .split(/[,，]/)
              .map((t) => t.trim())
              .filter(Boolean)
          : [];
        const date = metaContent(raw, 'date');
        const author = metaContent(raw, 'author');

        return {
          file,
          title,
          excerpt,
          tags,
          date,
          author,
        };
      })
      .sort((a, b) => {
        // Sort by date descending, then title
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return a.title.localeCompare(b.title, 'zh-CN');
      });
  } catch {
    return [];
  }
}

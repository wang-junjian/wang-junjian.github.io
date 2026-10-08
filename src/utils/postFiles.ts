import { readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

/**
 * posts/ 目录文件查找与校验的共享模块：
 * dev 中间件、静态路由与 build 钩子都需要在 posts/YYYY/ 递归定位
 * 某个 id 对应的文件，并保证 basename（剥掉年份目录后的 id）全库唯一。
 */

/** 在 postsDir 下递归查找 `${id}${ext}` 文件，找到返回绝对/拼接路径，否则 null。 */
export function findPostFile(postsDir: string, id: string, ext: '.md' | '.html'): string | null {
  for (const entry of readdirSync(postsDir, { withFileTypes: true })) {
    const fullPath = join(postsDir, entry.name);
    if (entry.isDirectory()) {
      const found = findPostFile(fullPath, id, ext);
      if (found) return found;
    } else if (entry.isFile() && entry.name === `${id}${ext}`) {
      return fullPath;
    }
  }
  return null;
}

/**
 * 校验文件列表的 basename（去扩展名）唯一，冲突直接抛错；
 * 通过时返回 id → 文件路径的映射，供调用方继续使用。
 */
export function assertUniqueBasenames(files: string[], ext: '.md' | '.html'): Map<string, string> {
  const byId = new Map<string, string>();
  for (const file of files) {
    const id = basename(file, ext);
    const existing = byId.get(id);
    if (existing) {
      throw new Error(`[html-posts] HTML 文章 basename 冲突：${existing} 与 ${file}（id 均为 ${id}）`);
    }
    byId.set(id, file);
  }
  return byId;
}

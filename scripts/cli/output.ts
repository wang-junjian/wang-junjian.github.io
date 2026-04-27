import type { SearchResult } from './embeddings.js';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function colorize(text: string, color: keyof typeof colors, noColor: boolean): string {
  if (noColor) return text;
  return `${colors[color]}${text}${colors.reset}`;
}

export function formatSearchResultsText(results: SearchResult[], noColor: boolean = false): string {
  if (results.length === 0) {
    return colorize('未找到相关结果', 'yellow', noColor);
  }

  let output = '';
  output += colorize(`找到 ${results.length} 个相关结果:\n\n`, 'cyan', noColor);

  results.forEach((result, index) => {
    const { chunk, similarity } = result;
    const num = index + 1;

    output += colorize(`[${num}] ${chunk.title}`, 'bold', noColor);
    output += colorize(` (${chunk.type === 'summary' ? '摘要' : '内容'})`, 'dim', noColor);
    output += '\n';

    // 显示时归一化到 0-100%，保持内部 summaryBoost 用于排序
    const displaySimilarity = Math.min(1, Math.max(0, similarity / 1.5));
    const similarityColor = displaySimilarity >= 0.8 ? 'green' : displaySimilarity >= 0.6 ? 'yellow' : 'red';
    output += colorize(`  相似度: ${(displaySimilarity * 100).toFixed(1)}%`, similarityColor, noColor);
    output += '\n';

    const url = `https://wangjunjian.com/posts/${chunk.slug.toLowerCase()}.html`;
    output += colorize(`  链接: `, 'dim', noColor);
    output += colorize(url, 'blue', noColor);
    output += '\n';

    const contentPreview = chunk.content.length > 200
      ? chunk.content.slice(0, 200) + '...'
      : chunk.content;
    output += `  ${contentPreview.replace(/\n/g, '\n  ')}\n`;
    output += '\n';
  });

  return output;
}

export function formatSearchResultsPretty(results: SearchResult[], noColor: boolean = false): string {
  if (results.length === 0) {
    return colorize('未找到相关结果', 'yellow', noColor);
  }

  let output = '';

  const separator = colorize('─'.repeat(60), 'dim', noColor);

  output += separator + '\n';
  output += colorize('  博客搜索结果\n', 'bold', noColor);
  output += separator + '\n\n';

  results.forEach((result, index) => {
    const { chunk, similarity } = result;
    const num = index + 1;

    output += colorize(`  ${num}. ${chunk.title}`, 'bold', noColor);
    output += '\n';

    // 显示时归一化到 0-100%，保持内部 summaryBoost 用于排序
    const displaySimilarity = Math.min(1, Math.max(0, similarity / 1.5));
    const barLength = Math.round(displaySimilarity * 30);
    const bar = '█'.repeat(barLength) + '░'.repeat(30 - barLength);
    output += `  ${bar} ${(displaySimilarity * 100).toFixed(1)}%\n`;

    output += colorize(`     类型: ${chunk.type === 'summary' ? '摘要' : '内容'}`, 'dim', noColor);
    output += '\n';
    const url = `https://wangjunjian.com/posts/${chunk.slug.toLowerCase()}.html`;
    output += colorize(`     链接: `, 'dim', noColor);
    output += colorize(url, 'blue', noColor);
    output += '\n\n';

    const contentPreview = chunk.content.length > 300
      ? chunk.content.slice(0, 300) + '...'
      : chunk.content;
    output += `     ${contentPreview.replace(/\n/g, '\n     ')}\n`;

    if (index < results.length - 1) {
      output += '\n' + colorize('  ' + '─'.repeat(58), 'dim', noColor) + '\n\n';
    }
  });

  output += '\n' + separator + '\n';

  return output;
}

export function formatSearchResultsJson(results: SearchResult[]): string {
  const data = results.map((r) => ({
    title: r.chunk.title,
    slug: r.chunk.slug,
    url: `https://wangjunjian.com/posts/${r.chunk.slug.toLowerCase()}.html`,
    type: r.chunk.type,
    similarity: r.similarity,
    content: r.chunk.content,
  }));
  return JSON.stringify(data, null, 2);
}

export function formatAnswer(answer: string, noColor: boolean = false): string {
  let output = '';
  output += colorize('回答:\n', 'bold', noColor);
  output += colorize('─'.repeat(60), 'dim', noColor) + '\n\n';
  output += answer;
  output += '\n\n' + colorize('─'.repeat(60), 'dim', noColor) + '\n';
  return output;
}

export function print(text: string): void {
  console.log(text);
}

export function printError(text: string, noColor: boolean = false): void {
  console.error(colorize(`错误: ${text}`, 'red', noColor));
}

export function printInfo(text: string, noColor: boolean = false): void {
  console.log(colorize(text, 'cyan', noColor));
}

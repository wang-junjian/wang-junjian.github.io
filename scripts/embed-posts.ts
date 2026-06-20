#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { computeRelated } from './compute-related.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'bge-m3:latest';
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 150;
const EMBEDDINGS_VERSION = '2.0';

interface Chunk {
  id: string;
  slug: string;
  title: string;
  type: 'summary' | 'content';
  content: string;
  embedding: number[];
  startIndex: number;
  endIndex: number;
}

interface PostMeta {
  slug: string;
  title: string;
  tags: string[];
  date?: string;
}

interface FileMetadata {
  hash: string;
  mtime: number;
}

interface EmbeddingsData {
  version: string;
  model: string;
  baseUrl: string;
  chunkSize: number;
  chunkOverlap: number;
  chunks: Chunk[];
  posts: PostMeta[];
  fileMetadata: Record<string, FileMetadata>;
  generatedAt: string;
}

function parseFrontmatterValue(value: string): string | string[] {
  value = value.trim();
  if (value.startsWith('[') && value.endsWith(']')) {
    const content = value.slice(1, -1).trim();
    return content ? content.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [];
  }
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function extractFrontmatter(content: string): { frontmatter: Record<string, any>; content: string } {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
  let frontmatter: Record<string, any> = {};
  let mainContent = content;

  if (frontmatterMatch) {
    const frontmatterStr = frontmatterMatch[1];
    mainContent = content.slice(frontmatterMatch[0].length).trim();

    const lines = frontmatterStr.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        frontmatter[key] = parseFrontmatterValue(value);
      }
    }
  }
  return { frontmatter, content: mainContent };
}

function cleanMarkdown(content: string): string {
  return content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    let slice = text.slice(i, end);

    if (end < text.length) {
      const breakers = ['。', '？', '！', '\n', ' '];
      let bestBreak = -1;
      for (const ch of breakers) {
        const idx = slice.lastIndexOf(ch);
        if (idx > chunkSize * 0.5) {
          bestBreak = Math.max(bestBreak, idx);
        }
      }
      if (bestBreak > 0) {
        slice = slice.slice(0, bestBreak + 1);
      }
    }

    chunks.push(slice.trim());
    const advance = slice.length - overlap;
    if (advance <= 0) break;
    i += advance;
  }
  return chunks;
}

function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function normalizeTags(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const str = String(value).trim();
  if (str.startsWith('[') && str.endsWith(']')) {
    return str.slice(1, -1).split(/[,，]/).map(s => s.trim()).filter(Boolean);
  }
  return str.split(/[,，]/).map(s => s.trim()).filter(Boolean);
}

async function createEmbedding(text: string): Promise<number[]> {
  const baseUrl = OLLAMA_BASE_URL.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create embedding: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

interface ProcessResult {
  chunks: Chunk[];
  meta: PostMeta;
}

async function processPost(filePath: string): Promise<ProcessResult> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, content: mainContent } = extractFrontmatter(content);
  const slug = path.basename(filePath, '.md');
  const title = frontmatter.title || slug;
  const date = frontmatter.date || '';
  const tags = normalizeTags(frontmatter.tags);
  const cleanContent = cleanMarkdown(mainContent);

  const allChunks: Chunk[] = [];

  // Summary chunk
  const summaryContent = cleanContent.slice(0, 500);
  const summaryText = `标题：${title}\n标签：${tags.join('，')}\n日期：${date}\n\n${summaryContent}`;
  const summaryEmbedding = await createEmbedding(summaryText);

  allChunks.push({
    id: `${slug}-summary`,
    slug,
    title,
    type: 'summary',
    content: summaryContent,
    embedding: summaryEmbedding,
    startIndex: 0,
    endIndex: summaryContent.length,
  });

  // Content chunks
  const contentChunks = splitIntoChunks(cleanContent, CHUNK_SIZE, CHUNK_OVERLAP);
  for (let i = 0; i < contentChunks.length; i++) {
    const chunk = contentChunks[i];
    const fullText = `标题：${title}\n标签：${tags.join('，')}\n\n${chunk}`;
    const embedding = await createEmbedding(fullText);

    allChunks.push({
      id: `${slug}-${i}`,
      slug,
      title,
      type: 'content',
      content: chunk,
      embedding,
      startIndex: i * (CHUNK_SIZE - CHUNK_OVERLAP),
      endIndex: i * (CHUNK_SIZE - CHUNK_OVERLAP) + chunk.length,
    });

    console.log(`  Processed chunk ${i + 1}/${contentChunks.length} for ${slug}`);
  }

  return {
    chunks: allChunks,
    meta: {
      slug,
      title,
      tags,
      date,
    },
  };
}

function loadExistingEmbeddings(outputPath: string): EmbeddingsData | null {
  if (!fs.existsSync(outputPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(outputPath, 'utf-8');
    const data = JSON.parse(content) as EmbeddingsData;
    if (data.version !== EMBEDDINGS_VERSION) {
      console.log(`Embeddings version mismatch (${data.version} vs ${EMBEDDINGS_VERSION}), will rebuild all`);
      return null;
    }
    return data;
  } catch (error) {
    console.warn('Failed to load existing embeddings, will create new:', error);
    return null;
  }
}

async function main() {
  const projectRoot = path.join(__dirname, '..');
  const postsDir = path.join(projectRoot, 'src', 'content', 'posts');
  const outputPath = path.join(projectRoot, 'public', 'embeddings.json');

  console.log('Configuration:');
  console.log(`  Ollama URL: ${OLLAMA_BASE_URL}`);
  console.log(`  Embedding model: ${OLLAMA_EMBEDDING_MODEL}`);
  console.log(`  Chunk size: ${CHUNK_SIZE} chars`);
  console.log(`  Chunk overlap: ${CHUNK_OVERLAP} chars`);

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} posts`);

  const existingData = loadExistingEmbeddings(outputPath);
  const fileMetadata: Record<string, FileMetadata> = {};
  const allChunks: Chunk[] = [];
  const allPosts: PostMeta[] = [];

  let filesToProcess: string[] = [];
  let filesSkipped = 0;

  if (existingData) {
    console.log('\nChecking for changes...');

    for (const file of files) {
      const filePath = path.join(postsDir, file);
      const hash = getFileHash(filePath);

      const existingMetadata = existingData.fileMetadata?.[file];
      if (existingMetadata && existingMetadata.hash === hash) {
        filesSkipped++;
        const existingChunks = existingData.chunks.filter(c => c.slug === path.basename(file, '.md'));
        allChunks.push(...existingChunks);
        const existingPost = existingData.posts?.find(p => p.slug === path.basename(file, '.md'));
        if (existingPost) allPosts.push(existingPost);
        fileMetadata[file] = existingMetadata;
        console.log(`  ✅ ${file} (unchanged, skipped)`);
      } else {
        filesToProcess.push(file);
        const action = existingMetadata ? 'updated' : 'new';
        console.log(`  📝 ${file} (${action})`);
      }
    }

    const deletedFiles = Object.keys(existingData.fileMetadata || {}).filter(f => !files.includes(f));
    for (const deletedFile of deletedFiles) {
      console.log(`  🗑️ ${deletedFile} (deleted)`);
    }
  } else {
    filesToProcess = files;
    console.log('\nNo existing embeddings found, processing all files...');
  }

  console.log(`\n${filesToProcess.length} files to process, ${filesSkipped} files skipped`);

  for (let i = 0; i < filesToProcess.length; i++) {
    const file = filesToProcess[i];
    console.log(`\nProcessing post ${i + 1}/${filesToProcess.length}: ${file}`);

    try {
      const filePath = path.join(postsDir, file);
      const result = await processPost(filePath);
      allChunks.push(...result.chunks);
      allPosts.push(result.meta);

      const hash = getFileHash(filePath);
      const stats = fs.statSync(filePath);
      fileMetadata[file] = {
        hash,
        mtime: stats.mtimeMs,
      };
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }

    if (i < filesToProcess.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  console.log(`\nTotal chunks: ${allChunks.length}`);
  console.log(`Total posts: ${allPosts.length}`);

  const output: EmbeddingsData = {
    version: EMBEDDINGS_VERSION,
    model: OLLAMA_EMBEDDING_MODEL,
    baseUrl: OLLAMA_BASE_URL,
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    chunks: allChunks,
    posts: allPosts,
    fileMetadata,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(output));
  console.log(`\nEmbeddings saved to: ${outputPath}`);

  // Generate related posts from embeddings
  const relatedPath = path.join(projectRoot, 'public', 'related-posts.json');
  computeRelated(outputPath, relatedPath);

  console.log('Done!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

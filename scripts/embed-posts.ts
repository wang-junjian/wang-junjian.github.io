#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'bge-m3:latest';
const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 50;

interface Chunk {
  id: string;
  slug: string;
  title: string;
  content: string;
  embedding: number[];
  startIndex: number;
  endIndex: number;
}

interface FileMetadata {
  hash: string;
  mtime: number;
}

interface EmbeddingsData {
  model: string;
  baseUrl: string;
  chunkSize: number;
  chunkOverlap: number;
  chunks: Chunk[];
  fileMetadata: Record<string, FileMetadata>;
  generatedAt: string;
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

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        frontmatter[key] = value;
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
  const words = text.split(/\s+/);

  let i = 0;
  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize);
    chunks.push(chunkWords.join(' '));
    i += chunkSize - overlap;
  }

  return chunks;
}

function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
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

async function processPost(filePath: string): Promise<Chunk[]> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, content: mainContent } = extractFrontmatter(content);
  const slug = path.basename(filePath, '.md');
  const title = frontmatter.title || slug;
  const cleanContent = cleanMarkdown(mainContent);

  const chunks = splitIntoChunks(cleanContent, CHUNK_SIZE, CHUNK_OVERLAP);
  const processedChunks: Chunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const fullText = `${title}\n\n${chunk}`;
    const embedding = await createEmbedding(fullText);

    processedChunks.push({
      id: `${slug}-${i}`,
      slug,
      title,
      content: chunk,
      embedding,
      startIndex: i * (CHUNK_SIZE - CHUNK_OVERLAP),
      endIndex: i * (CHUNK_SIZE - CHUNK_OVERLAP) + chunk.split(/\s+/).length,
    });

    console.log(`  Processed chunk ${i + 1}/${chunks.length} for ${slug}`);
  }

  return processedChunks;
}

function loadExistingEmbeddings(outputPath: string): EmbeddingsData | null {
  if (!fs.existsSync(outputPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(outputPath, 'utf-8');
    return JSON.parse(content);
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

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} posts`);

  const existingData = loadExistingEmbeddings(outputPath);
  const fileMetadata: Record<string, FileMetadata> = {};
  const allChunks: Chunk[] = [];

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
      const chunks = await processPost(filePath);
      allChunks.push(...chunks);

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

  const output: EmbeddingsData = {
    model: OLLAMA_EMBEDDING_MODEL,
    baseUrl: OLLAMA_BASE_URL,
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    chunks: allChunks,
    fileMetadata,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(output));
  console.log(`\nEmbeddings saved to: ${outputPath}`);
  console.log('Done!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

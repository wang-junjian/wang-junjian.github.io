#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cosineSimilarity } from '../src/utils/ai.js';
import type { EmbeddingsData } from '../src/utils/ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_RELATED = 4;

interface PostVector {
  slug: string;
  title: string;
  vector: number[];
}

function meanPooling(chunkVectors: number[][]): number[] {
  const dim = chunkVectors[0].length;
  const result = new Array(dim).fill(0);
  for (const vec of chunkVectors) {
    for (let i = 0; i < dim; i++) {
      result[i] += vec[i];
    }
  }
  for (let i = 0; i < dim; i++) {
    result[i] /= chunkVectors.length;
  }
  return result;
}

function computeRelated(embeddingsPath: string, outputPath: string): void {
  if (!fs.existsSync(embeddingsPath)) {
    console.error(`Embeddings file not found: ${embeddingsPath}`);
    console.error('Run "npm run embed" first to generate embeddings.');
    process.exit(1);
  }

  console.log(`Loading embeddings from ${embeddingsPath}...`);
  const raw = fs.readFileSync(embeddingsPath, 'utf-8');
  const data: EmbeddingsData = JSON.parse(raw);

  console.log(`  Model: ${data.model}`);
  console.log(`  Chunks: ${data.chunks.length}`);
  console.log(`  Posts: ${data.posts.length}`);

  // Group chunks by slug
  const bySlug = new Map<string, number[][]>();
  for (const chunk of data.chunks) {
    if (!bySlug.has(chunk.slug)) {
      bySlug.set(chunk.slug, []);
    }
    bySlug.get(chunk.slug)!.push(chunk.embedding);
  }

  // Mean pooling: one vector per post
  const postVectors: PostVector[] = [];
  for (const [slug, chunkVectors] of bySlug) {
    const postMeta = data.posts.find((p) => p.slug === slug);
    postVectors.push({
      slug,
      title: postMeta?.title || slug,
      vector: meanPooling(chunkVectors),
    });
  }

  console.log(`Computing similarities for ${postVectors.length} posts...`);

  // For each post, find top-N most similar
  const relatedMap: Record<string, string[]> = {};

  for (let i = 0; i < postVectors.length; i++) {
    const current = postVectors[i];
    const scored = postVectors
      .filter((p) => p.slug !== current.slug)
      .map((p) => ({
        slug: p.slug,
        score: cosineSimilarity(current.vector, p.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RELATED);

    relatedMap[current.slug] = scored.map((s) => s.slug);

    if ((i + 1) % 100 === 0) {
      console.log(`  Processed ${i + 1}/${postVectors.length} posts`);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(relatedMap));
  console.log(`Related posts saved to ${outputPath} (${Object.keys(relatedMap).length} entries)`);
}

// Run only when executed directly (not imported by embed-posts.ts)
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const projectRoot = path.join(__dirname, '..');
  const embeddingsPath = path.join(projectRoot, 'public', 'embeddings.json');
  const outputPath = path.join(projectRoot, 'public', 'related-posts.json');
  computeRelated(embeddingsPath, outputPath);
}

export { computeRelated };

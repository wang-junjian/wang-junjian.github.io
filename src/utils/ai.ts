export interface Chunk {
  id: string;
  slug: string;
  title: string;
  type: 'summary' | 'content';
  content: string;
  embedding: number[];
  startIndex: number;
  endIndex: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  date?: string;
}

export interface EmbeddingsData {
  version: string;
  model: string;
  chunkSize: number;
  chunkOverlap: number;
  chunks: Chunk[];
  posts: PostMeta[];
  fileMetadata: Record<string, { hash: string; mtime: number }>;
  generatedAt: string;
}

export interface SearchResult {
  chunk: Chunk;
  similarity: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

let embeddingsData: EmbeddingsData | null = null;

export async function loadEmbeddings(): Promise<EmbeddingsData> {
  if (embeddingsData) {
    return embeddingsData;
  }

  const response = await fetch('/embeddings.json');
  if (!response.ok) {
    throw new Error('Failed to load embeddings');
  }
  embeddingsData = await response.json();
  return embeddingsData;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function searchSimilar(
  queryEmbedding: number[],
  topK: number = 10,
  minSimilarity: number = 0.7
): Promise<SearchResult[]> {
  const data = await loadEmbeddings();

  const results: SearchResult[] = data.chunks.map((chunk) => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  results.sort((a, b) => b.similarity - a.similarity);

  return results
    .filter((r) => r.similarity >= minSimilarity)
    .slice(0, topK);
}

export async function generateAnswer(
  query: string,
  contextChunks: SearchResult[],
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    chatModel: string;
  },
  history: Message[] = []
): Promise<string> {
  const context = contextChunks
    .map((r, i) => `[${i + 1}] ${r.chunk.title}\n${r.chunk.content}`)
    .join('\n\n');

  const uniquePosts = Array.from(new Set(contextChunks.map(r => r.chunk.slug)));
  const postTitles = Array.from(new Map(contextChunks.map(r => [r.chunk.slug, r.chunk.title])).entries());

  const systemPrompt = `你是一个专业的技术助手，专门回答关于这个博客内容的问题。请遵循以下规则：

1. 只使用提供的上下文信息来回答问题，不要编造信息
2. 如果上下文中没有相关信息，请诚实地告诉用户
3. 回答要简洁、准确、有帮助
4. 适当使用中文进行回答
5. 在回答的最后，引用相关的文章链接，格式如下：

参考文章：
- [文章标题](/posts/文章slug.html)

请确保引用的文章与回答内容相关。
6. 这是多轮对话，请结合历史对话理解用户的后续问题。如果当前问题比较模糊（如"如何配置""它的原理是什么"），请参考之前的对话内容进行理解`;

  const userPrompt = `用户问题：${query}

相关上下文：
${context}

请根据以上上下文回答用户的问题。`;

  const baseUrl = apiConfig.baseUrl.replace(/\/$/, '');

  const messages: Message[] = [{ role: 'system', content: systemPrompt }];
  if (history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push(msg);
    }
  }
  messages.push({ role: 'user', content: userPrompt });

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: apiConfig.chatModel,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate answer: ${error}`);
  }

  const data = await response.json();
  let answer = data.choices[0].message.content;

  if (postTitles.length > 0 && !answer.includes('参考文章：')) {
    const referencesSection = '\n\n参考文章：\n' + postTitles
      .map(([slug, title]) => `- [${title}](/posts/${slug.toLowerCase()}.html)`)
      .join('\n');
    answer += referencesSection;
  }

  return answer;
}

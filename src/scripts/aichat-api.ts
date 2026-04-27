import type { SearchResult, Message } from '../utils/ai';

export interface ApiConfig {
  ollamaBaseUrl: string;
  ollamaEmbeddingModel: string;
  baseUrl: string;
  apiKey: string;
  chatModel: string;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  ollamaBaseUrl: 'http://localhost:11434/v1',
  ollamaEmbeddingModel: 'bge-m3:latest',
  baseUrl: 'https://api.longcat.chat/openai/',
  apiKey: '',
  chatModel: 'LongCat-Flash-Lite',
};

export async function createEmbedding(text: string, config: ApiConfig): Promise<number[]> {
  const baseUrl = (config.ollamaBaseUrl || DEFAULT_API_CONFIG.ollamaBaseUrl).replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.ollamaEmbeddingModel,
      input: text,
    }),
  });
  if (!response.ok) throw new Error(`Ollama embedding failed: ${await response.text()}`);
  const data = await response.json();
  return data.data[0].embedding;
}

export interface CurrentDoc {
  title: string;
  content: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: (fullText: string) => void;
  onError: (err: Error) => void;
}

function buildLlmMessages(query: string, contextChunks: SearchResult[], currentDoc: CurrentDoc | null, history: Message[]): Message[] {
  const context = contextChunks
    .map((r, i) => `[${i + 1}] ${r.chunk.title}\n${r.chunk.content}`)
    .join('\n\n');

  let currentDocSection = '';
  if (currentDoc) {
    currentDocSection = `\n\n用户当前正在阅读的文章：\n标题：${currentDoc.title}\n正文：${currentDoc.content}`;
  }

  const systemPrompt = `你是一个专业的技术助手，专门回答关于这个博客内容的问题。请遵循以下规则：
1. 只使用提供的上下文信息来回答问题，不要编造信息
2. 如果上下文中没有相关信息，请诚实地告诉用户
3. 回答要简洁、准确、有帮助
4. 适当使用中文进行回答
5. 如果用户正在阅读某篇文章，优先结合该文章内容回答
6. 不要在回答中添加文章链接，链接会在最后自动添加
7. 这是多轮对话，请结合历史对话理解用户的后续问题。如果当前问题比较模糊（如"如何配置""它的原理是什么"），请参考之前的对话内容进行理解`;

  const userPrompt = `用户问题：${query}\n\n相关上下文：\n${context}${currentDocSection}\n\n请根据以上上下文回答用户的问题。`;

  const llmMessages: Message[] = [{ role: 'system', content: systemPrompt }];
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      llmMessages.push(msg);
    }
  }
  llmMessages.push({ role: 'user', content: userPrompt });

  return llmMessages;
}

export function getPostTitles(contextChunks: SearchResult[]): [string, string][] {
  const slugMap = new Map<string, { title: string; similarity: number }>();
  for (const r of contextChunks) {
    const slug = r.chunk.slug;
    if (!slugMap.has(slug) || r.similarity > slugMap.get(slug)!.similarity) {
      slugMap.set(slug, { title: r.chunk.title, similarity: r.similarity });
    }
  }
  return Array.from(slugMap.entries()).map(([slug, info]) => [slug, info.title]);
}

export function appendReferences(answer: string, postTitles: [string, string][]): string {
  if (postTitles.length > 0 && !answer.includes('参考文章：')) {
    const referencesSection = '\n\n参考文章：\n' + postTitles
      .map(([slug, title]) => `- [${title}](/posts/${slug.toLowerCase()}.html)`)
      .join('\n');
    answer += referencesSection;
  }
  return answer;
}

export function getEndpoint(config: ApiConfig): string {
  const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  return isLocalhost
    ? '/api/chat'
    : `${(config.baseUrl || DEFAULT_API_CONFIG.baseUrl).replace(/\/$/, '')}/chat/completions`;
}

/**
 * 解析 SSE buffer，提取完整的 data 行
 * 兼容 \n 和 \r\n 分隔符
 */
function parseSseBuffer(buffer: string): { lines: string[]; remainder: string } {
  // 统一处理 \r\n -> \n
  const normalized = buffer.replace(/\r\n/g, '\n');
  const parts = normalized.split('\n');
  // 最后一个元素可能是不完整的行，保留到下次
  const remainder = parts.pop()!;
  return { lines: parts, remainder };
}

/**
 * 流式调用 LLM，逐 token 回调
 */
export async function streamAnswer(
  query: string,
  contextChunks: SearchResult[],
  currentDoc: CurrentDoc | null,
  config: ApiConfig,
  history: Message[],
  callbacks: StreamCallbacks,
  onDebug?: (label: string, message: string, data?: any) => void,
  onInfo?: (label: string, message: string, data?: any) => void,
): Promise<void> {
  const llmMessages = buildLlmMessages(query, contextChunks, currentDoc, history);
  const endpoint = getEndpoint(config);

  if (onDebug) {
    onDebug('llm', '发送流式 LLM 消息', { messageCount: llmMessages.length, messages: llmMessages, endpoint });
  }

  const llmStart = performance.now();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.chatModel,
        messages: llmMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    return;
  }

  if (!response.ok) {
    const errText = await response.text();
    callbacks.onError(new Error(`LLM failed: ${errText}`));
    return;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';
  let aborted = false;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (value) {
        buffer += decoder.decode(value, { stream: true });
      }

      // 解析 buffer 中的完整行
      const { lines, remainder } = parseSseBuffer(buffer);
      buffer = remainder;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed === 'data: [DONE]') {
          aborted = true;
          break;
        }
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const json = JSON.parse(trimmed.slice(6));
          const token = json.choices?.[0]?.delta?.content;
          if (token) {
            fullText += token;
            callbacks.onToken(token);
          }
          // 检查 finish_reason
          const finishReason = json.choices?.[0]?.finish_reason;
          if (finishReason === 'stop' || finishReason === 'length') {
            aborted = true;
          }
        } catch {
          // skip malformed JSON
        }
      }

      if (aborted) break;

      // 流结束但 buffer 中可能还有未处理的数据
      if (done) {
        // 处理 buffer 中剩余的不完整行
        if (buffer.trim()) {
          const { lines: finalLines } = parseSseBuffer(buffer + '\n');
          for (const line of finalLines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]' || !trimmed.startsWith('data: ')) continue;
            try {
              const json = JSON.parse(trimmed.slice(6));
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                fullText += token;
                callbacks.onToken(token);
              }
            } catch {
              // skip
            }
          }
        }
        break;
      }
    }
  } catch (err) {
    // 网络中断等错误：如果已经收到了部分内容，仍然触发 onDone 而非 onError
    if (fullText.length > 0) {
      if (onInfo) {
        onInfo('llm', '流中断但已有部分内容', { answerLength: fullText.length });
      }
    } else {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
      return;
    }
  }

  const postTitles = getPostTitles(contextChunks);
  fullText = appendReferences(fullText, postTitles);

  if (onInfo) {
    onInfo('llm', 'LLM 流式响应完成', {
      model: config.chatModel,
      answerLength: fullText.length,
      answer: fullText,
      durationMs: Math.round(performance.now() - llmStart),
    });
  }

  callbacks.onDone(fullText);
}

/**
 * 非流式调用 LLM（降级方案）
 */
export async function generateAnswerWithProxy(
  query: string,
  contextChunks: SearchResult[],
  currentDoc: CurrentDoc | null,
  config: ApiConfig,
  history: Message[],
  onDebug?: (label: string, message: string, data?: any) => void,
  onInfo?: (label: string, message: string, data?: any) => void,
): Promise<string> {
  const llmMessages = buildLlmMessages(query, contextChunks, currentDoc, history);
  const endpoint = getEndpoint(config);

  if (onDebug) {
    onDebug('llm', '发送 LLM 消息', { messageCount: llmMessages.length, messages: llmMessages, endpoint });
  }

  const llmStart = performance.now();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.chatModel,
      messages: llmMessages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) throw new Error(`LLM failed: ${await response.text()}`);
  const data = await response.json();
  let answer: string = data.choices[0].message.content;

  if (onInfo) {
    onInfo('llm', 'LLM 响应完成', {
      model: config.chatModel,
      answerLength: answer.length,
      answer,
      durationMs: Math.round(performance.now() - llmStart),
    });
  }

  const postTitles = getPostTitles(contextChunks);
  answer = appendReferences(answer, postTitles);
  return answer;
}

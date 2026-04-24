import { cosineSimilarity, loadEmbeddings } from '../utils/ai';
import { info, debug, error, setMinLevel, downloadLogs } from '../utils/logger';

const STORAGE_KEY_CONFIG = 'ai_chat_config';
const STORAGE_KEY_MESSAGES = 'ai_chat_messages';
const STORAGE_KEY_WINDOW_OPEN = 'ai_chat_window_open';
const STORAGE_KEY_LOG_LEVEL = 'ai_chat_log_level';

let apiConfig = {
  ollamaBaseUrl: 'http://localhost:11434/v1',
  ollamaEmbeddingModel: 'bge-m3:latest',
  baseUrl: 'https://api.longcat.chat/openai/',
  apiKey: '',
  chatModel: 'LongCat-Flash-Lite',
};
let messages: Array<{ role: string; content: string }> = [];
let embeddingsLoaded = false;
let isWindowOpen = false;

const toggleBtn = document.getElementById('aiChatToggle') as HTMLButtonElement;
const chatWindow = document.getElementById('aiChatWindow') as HTMLDivElement;
const closeBtn = document.getElementById('aiChatClose') as HTMLButtonElement;
const configBtn = document.getElementById('aiChatConfig') as HTMLButtonElement;
const clearBtn = document.getElementById('aiChatClear') as HTMLButtonElement;
const configPanel = document.getElementById('aiChatConfigPanel') as HTMLDivElement;
const statusEl = document.getElementById('aiChatStatus') as HTMLDivElement;
const messagesEl = document.getElementById('aiChatMessages') as HTMLDivElement;
const inputEl = document.getElementById('aiChatInput') as HTMLTextAreaElement;
const sendBtn = document.getElementById('aiChatSend') as HTMLButtonElement;
const quickQuestionsEl = document.getElementById('quickQuestions') as HTMLDivElement;
const ollamaBaseUrlInput = document.getElementById('ollamaBaseUrlInput') as HTMLInputElement;
const ollamaEmbeddingModelInput = document.getElementById('ollamaEmbeddingModelInput') as HTMLInputElement;
const apiBaseUrlInput = document.getElementById('apiBaseUrlInput') as HTMLInputElement;
const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
const chatModelInput = document.getElementById('chatModelInput') as HTMLInputElement;
const saveConfigBtn = document.getElementById('saveApiConfig') as HTMLButtonElement;
const logLevelInput = document.getElementById('logLevelInput') as HTMLSelectElement;
const exportLogsBtn = document.getElementById('exportLogsBtn') as HTMLButtonElement;

function updateStatus(text: string, type = 'warning') {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = 'ai-chat-status ' + type;
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(apiConfig));
  localStorage.setItem(STORAGE_KEY_LOG_LEVEL, logLevelInput?.value || 'info');
}

function loadConfig() {
  const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (saved) {
    apiConfig = { ...apiConfig, ...JSON.parse(saved) };
  }
  if (ollamaBaseUrlInput) ollamaBaseUrlInput.value = apiConfig.ollamaBaseUrl;
  if (ollamaEmbeddingModelInput) ollamaEmbeddingModelInput.value = apiConfig.ollamaEmbeddingModel;
  if (apiBaseUrlInput) apiBaseUrlInput.value = apiConfig.baseUrl;
  if (apiKeyInput) apiKeyInput.value = apiConfig.apiKey;
  if (chatModelInput) chatModelInput.value = apiConfig.chatModel;

  const savedLogLevel = localStorage.getItem(STORAGE_KEY_LOG_LEVEL);
  if (savedLogLevel) {
    setMinLevel(savedLogLevel as any);
    if (logLevelInput) logLevelInput.value = savedLogLevel;
  }
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
}

function loadMessages() {
  const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (saved) {
    messages = JSON.parse(saved);
  }
  renderMessages();
}

function renderMessages() {
  if (!messagesEl) return;
  if (messages.length === 0) {
    messagesEl.innerHTML = `
      <div style="text-align: center; padding: 30px 16px; color: var(--text-secondary, #666666);">
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">👋</span>
        <p style="margin: 0 0 6px 0; font-size: 13px;">你好！我是智能问答助手</p>
        <p style="margin: 0; font-size: 11px;">配置完成后开始提问</p>
      </div>
    `;
    if (quickQuestionsEl) quickQuestionsEl.style.display = 'flex';
    return;
  }

  if (quickQuestionsEl) quickQuestionsEl.style.display = 'none';
  messagesEl.innerHTML = messages.map(msg => renderMessage(msg)).join('');
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderMessage(msg: { role: string; content: string }) {
  const avatar = msg.role === 'user' ? '👤' : '🤖';
  let content: string;

  if (typeof (window as any).marked !== 'undefined') {
    content = (window as any).marked.parse(msg.content);
  } else {
    content = msg.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  return `
    <div class="ai-chat-message ${msg.role}">
      <div class="ai-chat-message-avatar">${avatar}</div>
      <div class="ai-chat-message-content">${content}</div>
    </div>
  `;
}

function addLoadingMessage(text = '思考中...') {
  if (!messagesEl) return;
  const div = document.createElement('div');
  div.id = 'aiChatLoading';
  div.className = 'ai-chat-message assistant';
  div.innerHTML = `
    <div class="ai-chat-message-avatar">🤖</div>
    <div class="ai-chat-message-content">
      <span style="color: var(--text-secondary, #666666);">${text}</span>
      <div class="ai-chat-loading">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeLoadingMessage() {
  const loading = document.getElementById('aiChatLoading');
  if (loading) loading.remove();
}

function checkReadyState() {
  if (embeddingsLoaded && apiConfig.apiKey) {
    if (inputEl) inputEl.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    if (configPanel) configPanel.classList.remove('open');
    updateStatus('✅ 就绪 - AI 问答', 'success');
  } else if (embeddingsLoaded) {
    if (configPanel) configPanel.classList.add('open');
    updateStatus('⚙️ 请配置 API Key', 'warning');
  }
}

let embeddingsData: any = null;

async function initEmbeddings() {
  try {
    updateStatus('📚 加载向量索引...', 'info');
    embeddingsData = await loadEmbeddings();
    embeddingsLoaded = true;
    checkReadyState();
  } catch (err: any) {
    updateStatus(`❌ 加载失败: ${err.message}`, 'error');
    console.error('Failed to load embeddings:', err);
  }
}

async function searchSimilar(queryEmbedding: number[], topK = 10, minSimilarity = 0.6) {
  if (!embeddingsData) {
    throw new Error('向量索引未加载');
  }
  const startTime = performance.now();
  const results = embeddingsData.chunks.map((chunk: any) => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding) * (chunk.type === 'summary' ? 1.05 : 1)
  }));
  results.sort((a: any, b: any) => b.similarity - a.similarity);

  const topRaw = results.slice(0, 20).map((r: any) => ({
    slug: r.chunk.slug,
    title: r.chunk.title,
    type: r.chunk.type,
    similarity: +r.similarity.toFixed(4)
  }));
  debug('search', '原始相似度 Top 20', { totalChunks: results.length, topRaw });

  const seen = new Set();
  const deduped: any[] = [];
  const filtered: any[] = [];
  for (const r of results) {
    if (!seen.has(r.chunk.slug)) {
      seen.add(r.chunk.slug);
      if (r.similarity >= minSimilarity) {
        deduped.push(r);
      } else {
        filtered.push({ slug: r.chunk.slug, title: r.chunk.title, similarity: +r.similarity.toFixed(4) });
      }
      if (deduped.length >= topK) break;
    }
  }

  info('search', '搜索结果', {
    topK,
    minSimilarity,
    totalChunks: results.length,
    uniqueSlugs: seen.size,
    returned: deduped.length,
    filtered: filtered.length,
    results: deduped.map((r: any) => ({
      slug: r.chunk.slug,
      title: r.chunk.title,
      type: r.chunk.type,
      similarity: +r.similarity.toFixed(4)
    })),
    filteredOut: filtered.slice(0, 10),
    durationMs: Math.round(performance.now() - startTime)
  });

  return deduped;
}

async function createEmbedding(text: string) {
  const baseUrl = (apiConfig.ollamaBaseUrl || 'http://localhost:11434/v1').replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: apiConfig.ollamaEmbeddingModel,
      input: text,
    }),
  });
  if (!response.ok) throw new Error(`Ollama embedding failed: ${await response.text()}`);
  const data = await response.json();
  return data.data[0].embedding;
}

async function generateAnswer(query: string, contextChunks: any[], currentDoc: any, history: any[]) {
  const context = contextChunks
    .map((r: any, i: number) => `[${i + 1}] ${r.chunk.title}\n${r.chunk.content}`)
    .join('\n\n');

  debug('llm', '构建上下文', {
    query,
    contextLength: context.length,
    chunksCount: contextChunks.length,
    historyLength: history ? history.length : 0,
    currentDoc: currentDoc ? { title: currentDoc.title, contentLength: currentDoc.content.length } : null
  });

  const slugMap = new Map();
  for (const r of contextChunks) {
    const slug = r.chunk.slug;
    const title = r.chunk.title;
    const similarity = r.similarity;
    if (!slugMap.has(slug) || similarity > slugMap.get(slug).similarity) {
      slugMap.set(slug, { title, similarity });
    }
  }
  const postTitles = Array.from(slugMap.entries()).map(([slug, info]: [string, any]) => [slug, info.title]);

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
  const baseUrl = (apiConfig.baseUrl || 'https://api.longcat.chat/openai/').replace(/\/$/, '');

  const llmMessages: Array<{ role: string; content: string }> = [{ role: 'system', content: systemPrompt }];
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      llmMessages.push({ role: msg.role, content: msg.content });
    }
  }
  llmMessages.push({ role: 'user', content: userPrompt });

  debug('llm', '发送 LLM 消息', { messageCount: llmMessages.length });

  const llmStart = performance.now();
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: apiConfig.chatModel,
      messages: llmMessages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) throw new Error(`LLM failed: ${await response.text()}`);
  const data = await response.json();
  let answer: string = data.choices[0].message.content;

  info('llm', 'LLM 响应完成', {
    model: apiConfig.chatModel,
    answerLength: answer.length,
    durationMs: Math.round(performance.now() - llmStart)
  });

  if (postTitles.length > 0 && !answer.includes('参考文章：')) {
    const referencesSection = '\n\n参考文章：\n' + postTitles
      .map(([slug, title]: [string, string]) => `- [${title}](/posts/${slug.toLowerCase()}.html)`)
      .join('\n');
    answer += referencesSection;
  }
  return answer;
}

async function sendMessage(text: string) {
  if (!text || !apiConfig.apiKey) return;

  messages.push({ role: 'user', content: text });
  saveMessages();
  renderMessages();
  inputEl.value = '';
  inputEl.style.height = 'auto';

  const msgStart = performance.now();
  info('chat', '开始处理用户提问', { query: text, model: apiConfig.chatModel });

  try {
    addLoadingMessage('正在调用向量化...');
    const embedStart = performance.now();
    const queryEmbedding = await createEmbedding(text);
    debug('chat', '向量化完成', { durationMs: Math.round(performance.now() - embedStart) });

    removeLoadingMessage();
    addLoadingMessage('正在本地搜索相关文章...');
    const similarChunks = await searchSimilar(queryEmbedding, 10, 0.6);

    removeLoadingMessage();
    addLoadingMessage('正在生成回答...');

    let currentDoc = null;
    if (location.pathname.startsWith('/posts/')) {
      const proseEl = document.querySelector('.prose');
      const titleEl = document.querySelector('article h1');
      if (proseEl) {
        currentDoc = {
          title: titleEl ? titleEl.textContent!.trim() : document.title,
          content: proseEl.textContent!.trim().slice(0, 8000),
        };
      }
    }

    const history = messages.slice(0, -1);
    const answer = await generateAnswer(text, similarChunks, currentDoc, history);

    removeLoadingMessage();
    messages.push({ role: 'assistant', content: answer });
    saveMessages();
    renderMessages();

    info('chat', '回答完成', { totalDurationMs: Math.round(performance.now() - msgStart) });
  } catch (err: any) {
    removeLoadingMessage();
    error('chat', '处理提问时出错', { error: err.message, query: text });
    messages.push({
      role: 'assistant',
      content: `抱歉，发生了错误：${err.message}。请检查 Ollama 是否运行以及 API 配置。`
    });
    saveMessages();
    renderMessages();
  }
}

function autoResize() {
  if (!inputEl) return;
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
}

function toggleWindow() {
  isWindowOpen = !isWindowOpen;
  if (isWindowOpen) {
    chatWindow.classList.add('open');
    toggleBtn.textContent = '✕';
  } else {
    chatWindow.classList.remove('open');
    toggleBtn.textContent = '🤖';
  }
  localStorage.setItem(STORAGE_KEY_WINDOW_OPEN, JSON.stringify(isWindowOpen));
}

function restoreWindowState() {
  const saved = localStorage.getItem(STORAGE_KEY_WINDOW_OPEN);
  if (saved && JSON.parse(saved)) {
    toggleWindow();
  }
}

function bindEvents() {
  toggleBtn.addEventListener('click', toggleWindow);
  closeBtn.addEventListener('click', toggleWindow);

  configBtn.addEventListener('click', () => {
    configPanel.classList.toggle('open');
  });

  clearBtn.addEventListener('click', () => {
    messages = [];
    saveMessages();
    renderMessages();
  });

  saveConfigBtn.addEventListener('click', () => {
    apiConfig = {
      ollamaBaseUrl: ollamaBaseUrlInput.value.trim() || 'http://localhost:11434/v1',
      ollamaEmbeddingModel: ollamaEmbeddingModelInput.value.trim() || 'bge-m3:latest',
      baseUrl: apiBaseUrlInput.value.trim() || 'https://api.longcat.chat/openai/',
      apiKey: apiKeyInput.value.trim(),
      chatModel: chatModelInput.value.trim() || 'LongCat-Flash-Lite',
    };
    saveConfig();
    checkReadyState();
  });

  if (logLevelInput) {
    logLevelInput.addEventListener('change', () => {
      setMinLevel(logLevelInput.value as any);
      info('logger', '日志级别已切换为 ' + logLevelInput.value);
    });
  }

  if (exportLogsBtn) {
    exportLogsBtn.addEventListener('click', () => {
      downloadLogs();
      info('logger', '日志已导出');
    });
  }

  sendBtn.addEventListener('click', () => sendMessage(inputEl.value.trim()));
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value.trim());
    }
  });
  inputEl.addEventListener('input', autoResize);

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-question]');
    if (btn && !inputEl.disabled) {
      sendMessage((btn as HTMLElement).dataset.question!);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.metaKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      toggleWindow();
    }
  });
}

function init() {
  bindEvents();
  loadConfig();
  loadMessages();
  restoreWindowState();
  initEmbeddings();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

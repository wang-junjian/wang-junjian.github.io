import hljs from 'highlight.js';

// Initialize Mermaid (loaded via CDN as it's too large for bundling)
declare const mermaid: any;

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ERROR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const ZOOM_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const CONTENT_SELECTOR = ':where(.prose, .slide-page)';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function createCodeBlockWrapper(
  pre: HTMLPreElement,
  lang: string,
  options?: {
    visualElements?: HTMLElement[];
    extraActions?: HTMLButtonElement[];
  }
): { wrapper: HTMLDivElement; copyBtn: HTMLButtonElement; actions: HTMLDivElement } | null {
  if (pre.closest('.code-block-wrapper')?.querySelector('.copy-btn')) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  pre.parentNode!.insertBefore(wrapper, pre);

  const visualElements = options?.visualElements;
  if (visualElements) {
    visualElements.forEach((el) => wrapper.appendChild(el));
  }

  wrapper.appendChild(pre);

  const langLabel = document.createElement('span');
  langLabel.className = 'code-language';
  langLabel.textContent = lang;
  wrapper.appendChild(langLabel);

  const actions = document.createElement('div');
  actions.className = 'code-block-actions';
  wrapper.appendChild(actions);

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.innerHTML = COPY_ICON;
  copyBtn.setAttribute('aria-label', '复制代码');
  actions.appendChild(copyBtn);

  if (options?.extraActions) {
    options.extraActions.forEach((btn) => actions.insertBefore(btn, copyBtn));
  }

  return { wrapper, copyBtn, actions };
}

function wrapMermaidDiagram(
  diagramDiv: HTMLElement,
  insertBefore: Node,
  extraActions?: HTMLButtonElement[]
): { wrapper: HTMLDivElement; copyBtn: HTMLButtonElement } | null {
  if (diagramDiv.closest('.code-block-wrapper')?.querySelector('.copy-btn')) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  insertBefore.parentNode!.insertBefore(wrapper, insertBefore);
  wrapper.appendChild(diagramDiv);

  const langLabel = document.createElement('span');
  langLabel.className = 'code-language';
  langLabel.textContent = 'mermaid';
  wrapper.appendChild(langLabel);

  const actions = document.createElement('div');
  actions.className = 'code-block-actions';
  wrapper.appendChild(actions);

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.innerHTML = COPY_ICON;
  copyBtn.setAttribute('aria-label', '复制代码');
  actions.appendChild(copyBtn);

  if (extraActions) {
    extraActions.forEach((btn) => actions.insertBefore(btn, copyBtn));
  }

  return { wrapper, copyBtn };
}

function showMermaidModal(sourceDiagram: HTMLElement) {
  const existing = document.querySelector('.mermaid-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'mermaid-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '放大查看 Mermaid 图');

  const modal = document.createElement('div');
  modal.className = 'mermaid-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mermaid-modal-close';
  closeBtn.innerHTML = CLOSE_ICON;
  closeBtn.setAttribute('aria-label', '关闭');

  const content = document.createElement('div');
  content.className = 'mermaid-modal-content';

  const svg = sourceDiagram.querySelector('svg');
  if (svg) {
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    clonedSvg.removeAttribute('style');
    clonedSvg.setAttribute('width', '100%');
    clonedSvg.setAttribute('height', '100%');
    clonedSvg.style.maxWidth = '100%';
    clonedSvg.style.maxHeight = '100%';
    content.appendChild(clonedSvg);
  } else {
    content.appendChild(sourceDiagram.cloneNode(true));
  }

  modal.appendChild(closeBtn);
  modal.appendChild(content);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function close() {
    document.body.style.overflow = originalOverflow;
    overlay.remove();
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', onKey);
    }
  }
  document.addEventListener('keydown', onKey);
}

async function initMermaid(): Promise<boolean> {
  const codeBlocks = document.querySelectorAll(`${CONTENT_SELECTOR} pre code.language-mermaid`);
  const rawDiagrams = document.querySelectorAll(`${CONTENT_SELECTOR} .mermaid`);

  if (codeBlocks.length === 0 && rawDiagrams.length === 0) return false;

  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js');
  } catch {
    return false;
  }

  if (typeof mermaid === 'undefined') return false;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
  });

  const wrappedDiagrams: { div: HTMLElement; source: string }[] = [];

  codeBlocks.forEach((code) => {
    const pre = code.parentElement!;
    const source = code.textContent || '';

    const diagramDiv = document.createElement('div');
    diagramDiv.className = 'mermaid';
    diagramDiv.textContent = source;

    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'zoom-btn';
    zoomBtn.innerHTML = ZOOM_ICON;
    zoomBtn.setAttribute('aria-label', '放大查看');

    const result = createCodeBlockWrapper(pre, 'mermaid', {
      visualElements: [diagramDiv],
      extraActions: [zoomBtn],
    });
    if (!result) return;

    const { copyBtn } = result;
    pre.style.display = 'none';

    zoomBtn.addEventListener('click', () => {
      showMermaidModal(diagramDiv);
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(source);
        copyBtn.innerHTML = CHECK_ICON;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.innerHTML = ERROR_ICON;
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
        }, 2000);
      }
    });

    wrappedDiagrams.push({ div: diagramDiv, source });
  });

  rawDiagrams.forEach((raw) => {
    const diagramDiv = raw as HTMLElement;
    const source = diagramDiv.textContent || '';

    if (diagramDiv.closest('.code-block-wrapper')?.querySelector('.copy-btn')) {
      // Already wrapped from a code block; just ensure it gets rendered individually.
      const existing = wrappedDiagrams.find((w) => w.div === diagramDiv);
      if (!existing) wrappedDiagrams.push({ div: diagramDiv, source });
      return;
    }

    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'zoom-btn';
    zoomBtn.innerHTML = ZOOM_ICON;
    zoomBtn.setAttribute('aria-label', '放大查看');

    const result = wrapMermaidDiagram(diagramDiv, diagramDiv, [zoomBtn]);
    if (!result) return;

    const { copyBtn } = result;

    zoomBtn.addEventListener('click', () => {
      showMermaidModal(diagramDiv);
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(source);
        copyBtn.innerHTML = CHECK_ICON;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.innerHTML = ERROR_ICON;
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
        }, 2000);
      }
    });

    wrappedDiagrams.push({ div: diagramDiv, source });
  });

  for (const { div, source } of wrappedDiagrams) {
    try {
      const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
      const { svg } = await mermaid.render(id, source);
      div.innerHTML = svg;
    } catch {
      // Ignore individual render failures so one bad diagram doesn't break others.
    }
  }

  return wrappedDiagrams.length > 0;
}

function applySyntaxHighlighting() {
  const remainingCodeElements = document.querySelectorAll<HTMLDivElement>(`${CONTENT_SELECTOR} pre:not([style*="display: none"]) > code`);
  remainingCodeElements.forEach((code) => {
    let lang = 'plaintext';
    const match = code.className?.match(/language-(\w+)/);
    if (match) lang = match[1];

    code.classList.add('hljs', lang);
    try {
      hljs.highlightElement(code as HTMLElement);
    } catch {
      // skip failed highlights
    }
  });
}

function addCopyButtons() {
  const codeBlocks = document.querySelectorAll<HTMLPreElement>(`${CONTENT_SELECTOR} pre`);

  codeBlocks.forEach((pre) => {
    const code = pre.querySelector('code');
    let lang = 'plaintext';
    const match = code?.className?.match(/language-(\w+)/);
    if (match) lang = match[1];

    const result = createCodeBlockWrapper(pre, lang);
    if (!result) return;

    const { copyBtn } = result;

    copyBtn.addEventListener('click', async () => {
      let text = '';

      if (code) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = code.innerHTML;
        text = tempDiv.textContent || '';
      } else {
        text = pre.textContent || '';
      }

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.innerHTML = CHECK_ICON;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.innerHTML = ERROR_ICON;
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
        }, 2000);
      }
    });
  });
}

function lazyLoadImages() {
  const images = document.querySelectorAll<HTMLImageElement>(`${CONTENT_SELECTOR} img`);
  images.forEach((img) => {
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
  });
}

async function enhancePostContent() {
  // Skip if already processed
  if (document.querySelector('.code-block-wrapper .copy-btn')) {
    return;
  }

  await initMermaid();
  applySyntaxHighlighting();
  addCopyButtons();
  lazyLoadImages();
}

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhancePostContent);
} else {
  enhancePostContent();
}

// Run on Turbo Drive navigation
document.addEventListener('turbo:load', enhancePostContent);

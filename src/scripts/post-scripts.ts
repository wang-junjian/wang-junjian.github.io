import hljs from 'highlight.js';

// Initialize Mermaid (loaded via CDN as it's too large for bundling)
declare const mermaid: any;

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

async function initMermaid(): Promise<boolean> {
  const mermaidBlocks = document.querySelectorAll('.prose pre code.language-mermaid');
  if (mermaidBlocks.length === 0) return false;

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

  let mermaidCount = 0;
  mermaidBlocks.forEach((code) => {
    const pre = code.parentElement!;
    const mermaidContent = code.textContent || '';

    const diagramDiv = document.createElement('div');
    diagramDiv.className = 'mermaid';
    diagramDiv.style.margin = '2rem 0';
    diagramDiv.style.padding = '1.5rem';
    diagramDiv.style.background = 'var(--white)';
    diagramDiv.style.border = '1px solid var(--border)';
    diagramDiv.style.borderRadius = '0.5rem';
    diagramDiv.textContent = mermaidContent;

    pre.parentNode!.insertBefore(diagramDiv, pre);
    pre.style.display = 'none';
    mermaidCount++;
  });

  if (mermaidCount > 0) {
    mermaid.init(undefined, '.mermaid');
  }

  return true;
}

function applySyntaxHighlighting() {
  const remainingCodeElements = document.querySelectorAll<HTMLDivElement>('.prose pre:not([style*="display: none"]) code');
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
  const codeBlocks = document.querySelectorAll<HTMLPreElement>('.prose pre');

  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
  const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  codeBlocks.forEach((pre) => {
    if (pre.closest('.code-block-wrapper')?.querySelector('.copy-btn')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode!.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const code = pre.querySelector('code');
    let lang = 'plaintext';
    const match = code?.className?.match(/language-(\w+)/);
    if (match) lang = match[1];

    const langLabel = document.createElement('span');
    langLabel.className = 'code-language';
    langLabel.textContent = lang;
    wrapper.appendChild(langLabel);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = copyIcon;
    copyBtn.setAttribute('aria-label', '复制代码');

    wrapper.appendChild(copyBtn);

    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
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
        copyBtn.innerHTML = checkIcon;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = copyIcon;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch {
        copyBtn.innerHTML = errorIcon;
        setTimeout(() => {
          copyBtn.innerHTML = copyIcon;
        }, 2000);
      }
    });
  });
}

function lazyLoadImages() {
  const images = document.querySelectorAll<HTMLImageElement>('.prose img');
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

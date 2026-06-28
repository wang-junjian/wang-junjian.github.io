export {};

declare global {
  interface Window {
    /** AI 问答组件初始化标志，防止重复初始化。 */
    __aiChatInit?: boolean;
    /** AI 问答组件全局 API。 */
    __aiChat?: {
      toggleWindow: () => void;
      sendMessage: (text: string) => void;
    };
  }

  /** Mermaid 全局对象，通过 CDN 加载。 */
  const mermaid: {
    initialize: (config: Record<string, unknown>) => void;
    init: (config?: unknown, nodes?: string | NodeListOf<Element> | Element[]) => Promise<unknown>;
  } | undefined;
}

---
layout: single
title:  "Continue 源码分析 - 键盘快捷键"
date:   2024-08-26 08:00:00 +0800
categories: Continue AICodingAssistant
tags: [Continue, Shortcut, GitHubCopilot]
---

## 聊天窗口

![](/images/2024/Continue/Continue-GUI.png)

### 输入框（TipTapEditor）
#### Enter (`⏎`)
- 不使用 `Codebase`

#### Cmd-Enter (`⌘` `⏎`)
- 使用 `Codebase`

#### Alt-Enter (`⌥` `⏎`)
- 使用 `ActiveFile`（打开且激活的文件）

#### Cmd-Backspace (`⌘` `⌫`)
- 放弃响应

#### Shift-Enter (`↑` `⏎`)
- 换行

源代码：gui/src/components/mainInput/TipTapEditor.tsx

```typescript
function TipTapEditor(props: TipTapEditorProps) {
  //...
  const editor: Editor = useEditor({
    extensions: [
      Document,
      History,
      Image,
      Placeholder.configure({
        placeholder: () =>
          historyLengthRef.current === 0
            ? "提出任何问题，'/' 斜杠命令，'@' 添加上下文"
            : "提出后续问题",
      }),
      Paragraph.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              if (inDropdownRef.current) {
                return false;
              }

              onEnterRef.current({
                useCodebase: false,
                noContext: !useActiveFile,
              });
              return true;
            },

            "Cmd-Enter": () => {
              onEnterRef.current({
                useCodebase: true,
                noContext: !useActiveFile,
              });
              return true;
            },
            "Alt-Enter": () => {
              posthog.capture("gui_use_active_file_enter");

              onEnterRef.current({
                useCodebase: false,
                noContext: useActiveFile,
              });

              return true;
            },
            "Cmd-Backspace": () => {
              // If you press cmd+backspace wanting to cancel,
              // but are inside of a text box, it shouldn't
              // delete the text
              if (activeRef.current) {
                return true;
              }
            },
            "Shift-Enter": () =>
              this.editor.commands.first(({ commands }) => [
                () => commands.newlineInCode(),
                () => commands.createParagraphNear(),
                () => commands.liftEmptyBlock(),
                () => commands.splitBlock(),
              ]),

            ArrowUp: () => {
              if (this.editor.state.selection.anchor > 1) {
                return false;
              }

              const previousInput = prevRef.current(
                this.editor.state.toJSON().doc,
              );
              if (previousInput) {
                this.editor.commands.setContent(previousInput);
                setTimeout(() => {
                  this.editor.commands.blur();
                  this.editor.commands.focus("start");
                }, 0);
                return true;
              }
            },
            ArrowDown: () => {
              if (
                this.editor.state.selection.anchor <
                this.editor.state.doc.content.size - 1
              ) {
                return false;
              }
              const nextInput = nextRef.current();
              if (nextInput) {
                this.editor.commands.setContent(nextInput);
                setTimeout(() => {
                  this.editor.commands.blur();
                  this.editor.commands.focus("end");
                }, 0);
                return true;
              }
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class: "my-1",
        },
      }),
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: getContextProviderDropdownOptions(
          availableContextProvidersRef,
          getSubmenuContextItemsRef,
          enterSubmenu,
          onClose,
          onOpen,
          inSubmenuRef,
          ideMessenger,
        ),
        renderHTML: (props) => {
          return `@${props.node.attrs.label || props.node.attrs.id}`;
        },
      }),
      SlashCommand.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: getSlashCommandDropdownOptions(
          availableSlashCommandsRef,
          onClose,
          onOpen,
          ideMessenger,
        ),
        renderText: (props) => {
          return props.node.attrs.label;
        },
      }),
      CodeBlockExtension,
    ],
    //...
  });
  //...
}
```

### 新会话 (`⌘` `L`)

源代码：gui/src/pages/gui.tsx

```tsx
//...
            <NewSessionButton
              onClick={() => {
                saveSession();
              }}
              className="mr-auto"
            >
              新会话 ({getMetaKeyLabel()} {isJetBrains() ? "J" : "L"})
            </NewSessionButton>
//...
```

### Debug Terminal (`⌘` `↑` `R`)

源代码：extensions/vscode/src/commands.ts

```typescript
    "continue.debugTerminal": async () => {
      captureCommandTelemetry("debugTerminal");

      const terminalContents = await ide.getTerminalContents();

      vscode.commands.executeCommand("continue.continueGUIView.focus");

      sidebar.webviewProtocol?.request("userInput", {
        input: `I got the following error, can you please help explain how to fix it?\n\n${terminalContents.trim()}`,
      });
    },
```


## 代码编辑器

源代码：extensions/vscode/src/activation/inlineTips.ts

```typescript
const inlineTipDecoration = vscode.window.createTextEditorDecorationType({
  after: {
    contentText: `Add to chat (${getMetaKeyName()}+L) | Edit highlighted code (${getMetaKeyName()}+I).`,
    color: "#888",
    margin: "0 0 0 6em",
    fontWeight: "bold",
  },
});

function showInlineTip() {
  return vscode.workspace
    .getConfiguration("continue")
    .get<boolean>("showInlineTip");
}

function handleSelectionChange(e: vscode.TextEditorSelectionChangeEvent) {
  const selection = e.selections[0];
  const editor = e.textEditor;

  if (editor.document.uri.toString().startsWith("output:")) {
    return;
  }

  if (selection.isEmpty || showInlineTip() === false) {
    editor.setDecorations(inlineTipDecoration, []);
    return;
  }

  const line = Math.max(0, selection.start.line - 1);

  const hoverMarkdown = new vscode.MarkdownString(
    `Click [here](command:continue.hideInlineTip) to hide these suggestions`,
  );
  hoverMarkdown.isTrusted = true;
  hoverMarkdown.supportHtml = true;
  editor.setDecorations(inlineTipDecoration, [
    {
      range: new vscode.Range(
        new vscode.Position(line, Number.MAX_VALUE),
        new vscode.Position(line, Number.MAX_VALUE),
      ),
      hoverMessage: [hoverMarkdown],
    },
  ]);
}
```

### Edit Highlighted Code (`⌘` `I`)
![](/images/2024/Continue/Edit-Highlighted-Code.png)

### Add to Chat (`⌘` `L`)
![](/images/2024/Continue/Add-to-Chat.png)

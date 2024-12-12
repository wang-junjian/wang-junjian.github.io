---
layout: post
title:  "Chat Extensions (VS Code)"
date:   2024-12-10 10:00:00 +0800
categories: ChatExtensions GitHubCopilot
tags: [ChatExtensions, GitHubCopilot, ChatParticipant, Agent, VSCode]
---

- [Chat extensions](https://code.visualstudio.com/api/extension-guides/chat)

## 聊天用户体验的组成部分

下面的截图显示了示例扩展中 Visual Studio Code 聊天体验中的不同聊天概念。

![](/images/2024/GitHubCopilot/chat.png)

1. 使用 `@` 语法调用 `@cat` 聊天参与者
2. 使用 `/` 语法调用 `/teach` 命令
3. 用户提供的查询，也称为用户提示
4. 图标和参与者的 `fullName`，表示 Copilot 正在使用 `@cat` 聊天参与者
5. 由 `@cat` 提供的 Markdown 响应
6. 包含在 Markdown 响应中的代码片段
7. 包含在 `@cat` 响应中的按钮，按钮调用 VS Code 命令
8. 聊天参与者提供的建议`后续问题`
9. 聊天输入字段，其中的占位文本由聊天参与者的 `description` 属性提供


## 开发聊天扩展（chat extension）

![](/images/2024/GitHubCopilot/diagram.png)

聊天扩展是一种扩展，它向 Chat 视图提供了一个聊天参与者。

实现聊天扩展所需的最小功能是：
- 注册聊天参与者，让用户可以在 VS Code Chat 视图中使用 `@` 符号调用它。
- 定义一个请求处理程序，解释用户的问题，并在 Chat 视图中返回响应。

您可以使用以下可选功能进一步扩展聊天扩展的功能：
- 注册聊天命令，为用户提供常见问题的简写符号
- 定义建议的后续问题，帮助用户继续对话

作为开发聊天扩展的起点，您可以参考我们的 [chat extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)。此示例实现了一个简单的猫导师，可以使用猫隐喻解释计算机科学主题。

### 注册聊天扩展（chat extension）

创建聊天扩展的第一步是在 `package.json` 中注册它，提供一个唯一的 `id`、`name` 和 `description`。

```json
{
    "contributes": {
        "chatParticipants": [
            {
                "id": "chat-sample.cat",
                "name": "cat",
                "fullName": "Cat",
                "description": "Meow! What can I teach you?",
                "isSticky": true
            }
        ]
    }
}
```

通过使用您提供的 `@` 符号和 `name`，用户可以在 Chat 视图中引用聊天参与者。`fullName` 显示在参与者响应的标题区域中。`description` 用作聊天输入字段中的占位文本。

`isSticky` 属性控制聊天参与者是否是持久的，这意味着在用户开始与参与者进行交互后，参与者名称会自动添加到聊天输入字段中。

![](/images/2024/GitHubCopilot/chat2.png)

我们建议使用小写 `name`，并使用标题大小写的 `fullName`，以与现有的聊天参与者保持一致。获取有关[聊天参与者命名约定](https://code.visualstudio.com/api/extension-guides/chat#chat-participant-naming-conventions)的更多信息。


下面的代码片段显示了如何创建 `@cat` 聊天参与者（在您在 `package.json` 中注册它之后）：

```ts
export function activate(context: vscode.ExtensionContext) {
  // Register the chat participant and its request handler
  const cat = vscode.chat.createChatParticipant('chat-sample.cat', handler);

  // Optionally, set some properties for @cat
  cat.iconPath = vscode.Uri.joinPath(context.extensionUri, 'cat.jpeg');

  // Add the chat request handler here
}
```

### 实现请求处理程序

请求处理程序负责在 VS Code Chat 视图中处理用户的聊天请求。每当用户在聊天输入字段中输入提示时，都会调用聊天请求处理程序。实现聊天请求处理程序的典型步骤如下：

1. 定义请求处理程序
2. 确定用户请求的意图
3. 执行逻辑以回答用户的问题
4. 向用户返回响应

#### 定义请求处理程序

您在扩展的 `activate` 函数中定义请求处理程序（`vscode.ChatRequestHandler`）。

```ts
const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<ICatChatResult> => {
  // Chat request handler implementation goes here
};
```

#### 确定用户请求的意图

要确定用户请求的意图，您可以引用 `vscode.ChatRequest` 参数，以访问用户的提示、命令和聊天位置。可选地，您可以利用语言模型来确定用户的意图，而不是使用传统的逻辑。作为请求对象的一部分，您可以获取用户在聊天模型下拉菜单中选择的语言模型实例。了解如何在扩展中使用 [Language Model API](https://code.visualstudio.com/api/extension-guides/language-model)。

```ts
const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<ICatChatResult> => {
  // Test for the `teach` command
  if (request.command == 'teach') {
    // Add logic here to handle the teaching scenario
    doTeaching(request.prompt, request.variables);
  } else {
    // Determine the user's intent
    const intent = determineUserIntent(request.prompt, request.variables, request.model);

    // Add logic here to handle other scenarios
  }
};
```

#### 执行逻辑以回答用户的问题

接下来，您需要实现实际逻辑来处理用户请求。通常，聊天扩展使用 `request.model` 语言模型实例来处理请求。在这种情况下，您可能会调整语言模型提示以匹配用户的意图。或者，您可以通过调用后端服务、使用传统编程逻辑或使用所有这些选项的组合来实现扩展逻辑。例如，您可以调用 Web 搜索来收集额外信息，然后将其作为上下文提供给语言模型。

在处理当前请求时，您可能需要参考以前的聊天消息。例如，如果以前的响应返回了一个 C# 代码片段，用户当前的请求可能是“用 Python 给出代码”。了解如何使用聊天消息历史记录。

如果您想根据聊天输入的位置不同而不同处理请求，可以使用 `vscode.ChatRequest` 的 `location` 属性。例如，如果用户从终端内联聊天发送请求，您可能会查找一个 shell 命令。而如果用户使用 Chat 视图，则可以返回一个更详细的响应。

#### 向用户返回响应

一旦您处理了请求，您必须在 Chat 视图中向用户返回响应。聊天扩展可以使用流来响应用户查询。响应可以包含不同的内容类型：`markdown`, `images`, `references`, `progress`, `buttons`, and `file trees`。例如生成此响应：

![](/images/2024/GitHubCopilot/stream.png)

扩展可以按以下方式使用响应流：

```ts
stream.progress('Picking the right topic to teach...');
stream.markdown(`\`\`\`typescript
const myStack = new Stack();
myStack.push(1); // pushing a number on the stack (or let's say, adding a fish to the stack)
myStack.push(2); // adding another fish (number 2)
console.log(myStack.pop()); // eating the top fish, will output: 2
\`\`\`
So remember, Code Kitten, in a stack, the last fish in is the first fish out - which we tech cats call LIFO (Last In, First Out).`);

stream.button({
  command: 'cat.meow',
  title: vscode.l10n.t('Meow!'),
  arguments: []
});
```

- [supported chat response output types](https://code.visualstudio.com/api/extension-guides/chat#supported-chat-response-output-types)

#### 使用聊天消息历史记录

参与者可以访问当前聊天会话的消息历史记录。参与者只能访问提到它的消息。`history` 项是 `ChatRequestTurn` 或 `ChatResponseTurn`。例如，使用以下代码片段检索用户在当前聊天会话中发送给您参与者的所有先前请求：

```ts
const previousMessages = context.history.filter(h => h instanceof vscode.ChatRequestTurn);
```

历史记录不会自动包含在提示中，由参与者决定是否要将历史记录作为附加上下文添加到传递给语言模型的消息中。

### 注册命令

聊天参与者可以提供命令，这些命令是扩展提供的特定功能的快捷方式。用户可以使用 `/` 语法在聊天中引用命令，例如 `/explain`。

回答问题时的一个任务是确定用户意图。例如，VS Code 可能会推断 `Create a new workspace with Node.js Express Pug TypeScript` 意味着您想要一个新项目，但 `@workspace /new Node.js Express Pug TypeScript` 更明确、简洁，并节省了输入时间。如果在聊天输入字段中输入 `/`，VS Code 将提供一个注册命令列表，其中包含它们的描述。

![](/images/2024/GitHubCopilot/commands.png)

Chat 参与者可以通过在 `package.json` 中添加命令及其描述来贡献命令：

```json
"contributes": {
    "chatParticipants": [
        {
            "id": "chat-sample.cat",
            "name": "cat",
            "fullName": "Cat",
            "description": "Meow! What can I teach you?",
            "isSticky": true,
            "commands": [
                {
                    "name": "teach",
                    "description": "Pick at random a computer science concept then explain it in purfect way of a cat"
                },
                {
                    "name": "play",
                    "description": "Do whatever you want, you are a cat after all"
                }
            ]
        }
    ]
}
```

- [naming conventions for slash commands](https://code.visualstudio.com/api/extension-guides/chat#slash-command-naming-conventions)

### 注册后续请求

在每个聊天请求之后，VS Code 调用后续提供程序以获取建议的后续问题，以显示给用户。用户可以选择后续问题，然后立即将其发送给聊天扩展。后续问题可以为用户提供灵感，以进一步进行对话，或者发现聊天扩展的更多功能。


下面的代码片段显示了如何在聊天扩展中注册后续请求：

```json
cat.followupProvider = {
    provideFollowups(result: ICatChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
        if (result.metadata.command === 'teach') {
            return [{
                prompt: 'let us play',
                title: vscode.l10n.t('Play with the cat')
            } satisfies vscode.ChatFollowup];
        }
    }
};
```

> 后续问题应该写成问题或指导，而不仅仅是简洁的命令。

### 实现参与者检测

为了更容易使用自然语言的聊天参与者，您可以实现参与者检测。**参与者检测是一种自动将用户的问题路由到合适的参与者的方法**，而无需在提示中明确提及参与者。例如，如果用户问“如何向我的项目添加登录页面？”，则问题将自动路由到`@workspace`参与者，因为它可以回答关于用户项目的问题。

VS Code 使用聊天参与者的描述和示例来确定将聊天提示路由到哪个参与者。您可以在扩展的 `package.json` 文件中的 `disambiguation` 属性中指定此信息。`disambiguation` 属性包含一个检测类别列表，每个类别都有一个描述和示例。

| Property | Description | Examples |
| --- | --- | --- |
| category | 检测类别。如果参与者服务于不同的目的，您可以为每个目的设置一个类别。 | cat<br>workspace_questions<br>web_questions |
| description | 适用于此参与者的问题类型的详细描述。 | 用户希望以非正式的方式了解特定的计算机科学主题。<br>用户只是想放松一下，看看猫玩耍。 |
| examples | 代表性示例问题列表。 | 教我使用隐喻来学习 C++ 指针<br>用简单的方式向我解释什么是链表<br>你能给我看看猫玩激光笔吗？ |

您可以为整个聊天参与者、特定命令或两者的组合定义参与者检测。

下面的代码片段显示了如何在参与者级别实现参与者检测。
    
```json
"contributes": {
    "chatParticipants": [
        {
            "id": "chat-sample.cat",
            "fullName": "Cat",
            "name": "cat",
            "description": "Meow! What can I teach you?",

            "disambiguation": [
                {
                    "category": "cat",
                    "description": "The user wants to learn a specific computer science topic in an informal way.",
                    "examples": [
                        "Teach me C++ pointers using metaphors",
                        "Explain to me what is a linked list in a simple way",
                        "Can you explain to me what is a function in programming?"
                    ]
                }
            ]
        }
    ]
}
```

同样，您还可以通过在`commands`属性中的一个或多个项目中添加`disambiguation`属性来在命令级别配置参与者检测。

请遵循以下准则，以提高您的扩展的参与者检测的准确性：
- **尽量具体**：描述和示例应尽可能具体，以避免与其他参与者发生冲突。在参与者和命令信息中避免使用通用术语。
- **使用示例**：示例应代表适合参与者的问题类型。使用同义词和变体来覆盖各种用户查询。
- **使用自然语言**：描述和示例应以自然语言编写，就好像您在向用户解释参与者一样。
- **测试检测**：使用各种示例问题测试参与者检测，并验证与内置聊天参与者没有冲突。

> **内置聊天参与者优先用于参与者检测**。例如，一个操作于工作区文件的聊天参与者可能会与内置的`@workspace`参与者发生冲突。

## 支持的聊天响应输出类型
为了向聊天请求返回响应，您可以使用 `ChatRequestHandler` 上的 `ChatResponseStream` 参数。

以下列表提供了 Chat 视图中聊天响应的输出类型。聊天响应可以组合多种不同的输出类型。

### Markdown

呈现 Markdown 文本片段简单文本或图像。您可以使用 [CommonMark](https://commonmark.org/) 规范的任何 Markdown 语法。使用 `ChatResponseStream.markdown` 方法并提供 Markdown 文本。

示例代码片段：
```ts
// Render Markdown text
stream.markdown('# This is a title \n');
stream.markdown('This is stylized text that uses _italics_ and **bold**. ');
stream.markdown('This is a [link](https://code.visualstudio.com).\n\n');
stream.markdown('![VS Code](https://code.visualstudio.com/assets/favicon.ico)');
```

### Code block

呈现支持 IntelliSense、代码格式化和交互式控件的代码块，以将代码应用于活动编辑器。要显示代码块，请使用 [`ChatResponseStream.markdown`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.markdown) 方法，并应用代码块的 Markdown 语法（使用反引号）。

示例代码片段：
```ts
// Render a code block that enables users to interact with
stream.markdown('```bash\n');
stream.markdown('```ls -l\n');
stream.markdown('```');
```

### Command link

在聊天响应中呈现一个内联链接，用户可以选择以调用 VS Code 命令。要显示命令链接，请使用 [`ChatResponseStream.markdown`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.markdown) 方法，并使用链接的 Markdown 语法 `[link text](command:commandId)`，其中您在 URL 中提供命令 ID。例如，以下链接打开命令面板：`[Command Palette](command:workbench.action.showCommands)`。

当您从服务加载 Markdown 文本时，为了防止命令注入，您必须使用一个 [vscode.MarkdownString](https://code.visualstudio.com/api/references/vscode-api#MarkdownString) 对象，并将 `isTrusted` 属性设置为受信任的 VS Code 命令 ID 列表。此属性是必需的，以使命令链接正常工作。如果未设置 `isTrusted` 属性或未列出命令，则命令链接将无法正常工作。

示例代码片段：
```ts
// Use command URIs to link to commands from Markdown
let markdownCommandString: vscode.MarkdownString = new vscode.MarkdownString(
  `[Use cat names](command:${CAT_NAMES_COMMAND_ID})`
);
markdownCommandString.isTrusted = { enabledCommands: [CAT_NAMES_COMMAND_ID] };

stream.markdown(markdownCommandString);
```

如果命令需要参数，您需要首先对参数进行 JSON 编码，然后将 JSON 字符串编码为 URI 组件。然后，您将编码的参数作为查询字符串附加到命令链接。

```ts
// Encode the command arguments
const encodedArgs = encodeURIComponent(JSON.stringify(args));

// Use command URIs with arguments to link to commands from Markdown
let markdownCommandString: vscode.MarkdownString = new vscode.MarkdownString(
  `[Use cat names](command:${CAT_NAMES_COMMAND_ID}?${encodedArgs})`
);
markdownCommandString.isTrusted = { enabledCommands: [CAT_NAMES_COMMAND_ID] };

stream.markdown(markdownCommandString);
```

### Command button

呈现一个按钮，调用 VS Code 命令。命令可以是内置命令，也可以是您在扩展中定义的命令。使用 [`ChatResponseStream.button`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.button) 方法，并提供按钮文本和命令 ID。

示例代码片段：
```ts
// Render a button to trigger a VS Code command
stream.button({
  command: 'my.command',
  title: vscode.l10n.t('Run my command')
});
```

### File tree

呈现一个文件树控件，让用户预览单个文件。例如，在建议创建新工作区时显示工作区预览。使用 [`ChatResponseStream.filetree`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.filetree) 方法，并提供文件树元素的数组和文件的基本位置（文件夹）。

示例代码片段：
```ts
// Create a file tree instance
var tree: vscode.ChatResponseFileTree[] = [
  {
    name: 'myworkspace',
    children: [{ name: 'README.md' }, { name: 'app.js' }, { name: 'package.json' }]
  }
];

// Render the file tree control at a base location
stream.filetree(tree, baseLocation);
```

### Progress message

在长时间运行的操作期间呈现进度消息，以向用户提供中间反馈。例如，在多步操作中报告每个步骤的完成情况。使用 [`ChatResponseStream.progress`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.progress) 方法并提供消息。

示例代码片段：
```ts
// Render a progress message
stream.progress('Connecting to the database.');
```

### Reference

在引用列表中添加外部 URL 或编辑器位置的引用，以指示您使用的上下文信息。使用 [`ChatResponseStream.reference`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.reference) 方法并提供引用位置。

示例代码片段：
```ts
const fileUri: vscode.Uri = vscode.Uri.file('/path/to/workspace/app.js'); // On Windows, the path should be in the format of 'c:\\path\\to\\workspace\\app.js'
const fileRange: vscode.Range = new vscode.Range(0, 0, 3, 0);
const externalUri: vscode.Uri = vscode.Uri.parse('https://code.visualstudio.com');

// Add a reference to an entire file
stream.reference(fileUri);

// Add a reference to a specific selection within a file
stream.reference(new vscode.Location(fileUri, fileRange));

// Add a reference to an external URL
stream.reference(externalUri);
```

### Inline reference

添加对 URI 或编辑器位置的内联引用。使用 [`ChatResponseStream.anchor`](https://code.visualstudio.com/api/references/vscode-api#ChatResponseStream.anchor) 方法并提供锚点位置和可选标题。要引用符号（例如类或变量），您将在编辑器中使用位置。

示例代码片段：
```ts
const symbolLocation: vscode.Uri = vscode.Uri.parse('location-to-a-symbol');

// Render an inline anchor to a symbol in the workspace
stream.anchor(symbolLocation, 'MySymbol');
```

> **仅当图像和链接来自受信任域时，它们才可用。** 获取有关 [VS Code 中的链接保护](https://code.visualstudio.com/docs/editor/editingevolved#outgoing-link-protection)的更多信息。

## 测量成功

我们建议您通过为 `Unhelpful` 用户反馈事件和您的参与者处理的总请求数添加遥测日志来衡量参与者的成功。然后，可以将初始参与者成功度量定义为：`unhelpful_feedback_count` / `total_requests`。

```ts
const logger = vscode.env.createTelemetryLogger({
  // telemetry logging implementation goes here
});

cat.onDidReceiveFeedback((feedback: vscode.ChatResultFeedback) => {
  // Log chat result feedback to be able to compute the success metric of the participant
  logger.logUsage('chatResultFeedback', {
    kind: feedback.kind
  });
});
```

您对聊天响应的任何其他用户交互都应该作为正面指标进行测量（例如，用户选择在聊天响应中生成的按钮）。使用遥测测量成功对于与 AI 一起工作至关重要，因为它是一种非确定性技术。运行实验，测量并迭代改进您的参与者，以确保良好的用户体验。

## Guidelines（指南）

聊天参与者不应该是纯粹的问答机器人。构建聊天参与者时，要有创意，并使用现有的 VS Code API 在 VS Code 中创建丰富的集成。用户还喜欢丰富和便捷的交互，例如在响应中的按钮，将用户带到聊天中的参与者的菜单项。考虑 AI 如何帮助用户的真实场景。

每个扩展都贡献聊天参与者是没有意义的。在聊天中有太多的参与者可能会导致糟糕的用户体验。当您想要控制完整提示时，包括对语言模型的说明时，聊天参与者是最好的。您可以重用精心制作的 Copilot 系统消息，并为其他参与者提供上下文。

例如，语言扩展（如 C++ 扩展）可以以各种其他方式做出贡献：

- 提供工具，将语言服务智能带给用户查询。例如，C++ 扩展可以将 `#cpp` 工具解析为工作区的 C++ 状态。这为 Copilot 语言模型提供了正确的 C++ 上下文，以提高 C++ 的 Copilot 答案的质量。
- 提供智能操作，使用语言模型，可选地与传统语言服务知识结合，以提供出色的用户体验。例如，C++ 可能已经提供了一个“提取到方法”的智能操作，该操作使用语言模型为新方法生成一个合适的默认名称。

如果聊天扩展即将执行昂贵的操作，或者即将编辑或删除无法撤消的内容，聊天扩展应明确要求用户同意。为了获得出色的用户体验，我们不建议扩展贡献多个聊天参与者。每个扩展最多一个聊天参与者是一个简单的模型，在 UI 中很好地扩展。

## Publishing your extension（发布扩展）

创建 AI 扩展后，您可以将扩展发布到 Visual Studio Marketplace：

在发布到 VS Marketplace 之前，我们建议您阅读 [Microsoft AI 工具和实践指南](https://www.microsoft.com/en-us/ai/tools-practices)。这些指南提供了 AI 技术负责开发和使用的最佳实践。

通过发布到 VS Marketplace，您的扩展遵守 [GitHub Copilot 可接受的开发和使用政策](https://docs.github.com/en/early-access/copilot/github-copilot-extensibility-platform-partnership-plugin-acceptable-development-and-use-policy)。

按照 [发布扩展](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) 中的说明上传到 Marketplace。

如果您的扩展已经提供了除聊天之外的功能，我们建议您不要在 [扩展清单](https://code.visualstudio.com/api/references/extension-manifest) 中引入对 GitHub Copilot 的扩展依赖。这样可以确保不使用 GitHub Copilot 的扩展用户可以使用非聊天功能，而无需安装 GitHub Copilot。

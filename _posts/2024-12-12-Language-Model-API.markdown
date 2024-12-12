---
layout: post
title:  "Language Model API"
date:   2024-12-12 10:00:00 +0800
categories: ChatExtensions GitHubCopilot
tags: [ChatExtensions, GitHubCopilot, VSCode]
---

The Language Model API enables you to [use the Language Model](https://code.visualstudio.com/api/references/vscode-api#lm) and integrate AI-powered features and natural language processing in your Visual Studio Code extension.

语言模型 API 可以让您[使用语言模型](https://code.visualstudio.com/api/references/vscode-api#lm)，并在您的 Visual Studio Code 扩展中集成 AI 功能和自然语言处理。

You can use the Language Model API in different types of extensions. A typical use for this API is in [chat extensions](https://code.visualstudio.com/api/extension-guides/chat), where you use a language model to interpret the user's request and help provide an answer. However, the use of the Language Model API is not limited to this scenario. You might use a language model in a [language](https://code.visualstudio.com/api/language-extensions/overview) or [debugger](https://code.visualstudio.com/api/extension-guides/debugger-extension) extension, or as part of a [command](https://code.visualstudio.com/api/extension-guides/command) or [task](https://code.visualstudio.com/api/extension-guides/task-provider) in a custom extension. For example, the Rust extension might use the Language Model to offer default names to improve its rename experience.

您可以在不同类型的扩展中使用语言模型 API。这个 API 的典型用法是在[聊天扩展](https://code.visualstudio.com/api/extension-guides/chat)中，您可以使用语言模型来解释用户的请求并帮助提供答案。但是，语言模型 API 的使用不限于这种情况。您可能会在[语言](https://code.visualstudio.com/api/language-extensions/overview)或[调试器](https://code.visualstudio.com/api/extension-guides/debugger-extension)扩展中使用语言模型，或作为自定义扩展中的[命令](https://code.visualstudio.com/api/extension-guides/command)或[任务](https://code.visualstudio.com/api/extension-guides/task-provider)的一部分。例如，Rust 扩展可能使用语言模型来提供默认名称，以改进其重命名体验。

The process for using the Language Model API consists of the following steps:

使用语言模型 API 的过程包括以下步骤：

1. Build the language model prompt
2. Send the language model request
3. Interpret the response

---

1. 构建语言模型提示
2. 发送语言模型请求
3. 解释响应

The following sections provide more details on how to implement these steps in your extension.

以下各节详细介绍了如何在您的扩展中实现这些步骤。

- [Chat extension sample](https://github.com/microsoft/vscode-extension-samples/tree/main/chat-sample)
- [LanguageModels API](https://code.visualstudio.com/api/references/vscode-api#lm)
- [@vscode/prompt-tsx npm package](https://www.npmjs.com/package/@vscode/prompt-tsx)


## Build the language model prompt（构建语言模型提示）

To interact with a language model, extensions should first craft their prompt, and then send a request to the language model. You can use prompts to provide instructions to the language model on the broad task that you're using the model for. Prompts can also define the context in which user messages are interpreted.

要与语言模型交互，扩展应首先制作其提示，然后向语言模型发送请求。您可以使用提示为语言模型提供有关您正在使用模型的广泛任务的说明。提示还可以定义解释用户消息的上下文。

The Language Model API supports two types of messages when building the language model prompt:

在构建语言模型提示时，语言模型 API 支持两种类型的消息：

- **User** - used for providing instructions and the user's request
- **Assistant** - used for adding the history of previous language model responses as context to the prompt

---

- **用户** - 用于提供说明和用户的请求
- **助手** - 用于将以前的语言模型响应历史作为上下文添加到提示中

> Note: Currently, the Language Model API doesn't support the use of system messages.

> 注意：目前，语言模型 API 不支持使用系统消息。

You can use two approaches for building the language model prompt:

您可以使用两种方法来构建语言模型提示：

- `LanguageModelChatMessage` - create the prompt by providing one or more messages as strings. You might use this approach if you're just getting started with the Language Model API.
- [`@vscode/prompt-tsx`](https://www.npmjs.com/package/@vscode/prompt-tsx) - declare the prompt by using the TSX syntax.

---

- `LanguageModelChatMessage` - 通过提供一个或多个字符串消息来创建提示。如果您刚开始使用语言模型 API，可以使用此方法。
- [`@vscode/prompt-tsx`](https://www.npmjs.com/package/@vscode/prompt-tsx) - 使用 TSX 语法声明提示。

You can use the `prompt-tsx` library if you want more control over how the language model prompt is composed. For example, the library can help with dynamically adapting the length of the prompt to each language model's context window size. Learn more about [@vscode/prompt-tsx](https://www.npmjs.com/package/@vscode/prompt-tsx) or explore the chat extension sample to get started.

如果您想更好地控制语言模型提示的组成方式，可以使用 `prompt-tsx` 库。例如，该库可以帮助动态调整提示的长度，以适应每个语言模型的上下文窗口大小。了解更多关于[@vscode/prompt-tsx](https://www.npmjs.com/package/@vscode/prompt-tsx)的信息，或者探索聊天扩展示例以开始使用。

To learn more about the concepts of prompt engineering, we suggest reading OpenAI's excellent [Prompt engineering guidelines](https://platform.openai.com/docs/guides/prompt-engineering).

要了解更多关于提示工程的概念，我们建议阅读 OpenAI 出色的[提示工程指南](https://platform.openai.com/docs/guides/prompt-engineering)。

### Use the LanguageModelChatMessage class

The Language Model API provides the `LanguageModelChatMessage` class to represent and create chat messages. You can use the `LanguageModelChatMessage.User` or `LanguageModelChatMessage.Assistant` methods to create user or assistant messages respectively.

语言模型 API 提供了 `LanguageModelChatMessage` 类来表示和创建聊天消息。您可以分别使用 `LanguageModelChatMessage.User` 或 `LanguageModelChatMessage.Assistant` 方法来创建用户或助手消息。

In the following example, the first message provides context for the prompt:

在下面的示例中，第一条消息为提示提供了上下文：

- The persona used by the model in its replies (in this case, a cat)
- The rules the model should follow when generating responses (in this case, explaining computer science concepts in a funny manner by using cat metaphors)

---

- 模型在回复中使用的角色（在本例中是一只猫）
- 模型在生成响应时应遵循的规则（在本例中，通过使用猫的隐喻以有趣的方式解释计算机科学概念）

The second message then provides the specific request or instruction coming from the user. It determines the specific task to be accomplished, given the context provided by the first message.

然后，第二条消息提供了来自用户的具体请求或指令。它根据第一条消息提供的上下文确定要完成的具体任务。

```typescript
const craftedPrompt = [
  // 你是一只猫！像猫一样仔细思考和一步一步地行动。你的工作是用猫的隐喻以有趣的方式解释计算机科学概念。始终从说明你要解释的概念开始你的回答。始终包含代码示例。
  vscode.LanguageModelChatMessage.User(
    'You are a cat! Think carefully and step by step like a cat would. Your job is to explain computer science concepts in the funny manner of a cat, using cat metaphors. Always start your response by stating what concept you are explaining. Always include code samples.'
  ),

  // 我想理解递归
  vscode.LanguageModelChatMessage.User('I want to understand recursion')
];
```

## Send the language model request（发送语言模型请求）

Once you've built the prompt for the language model, you first select the language model you want to use with the [`selectChatModels`](https://code.visualstudio.com/api/references/vscode-api#lm.selectChatModels) method. This method returns an array of language models that match the specified criteria. If you are implementing a chat participant, we recommend that you instead use the model that is passed as part of the `request` object in your chat request handler. This ensures that your extension respects the model that the user chose in the chat model dropdown. Then, you send the request to the language model by using the [`sendRequest`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat) method.

一旦您为语言模型构建了提示，您首先使用 [`selectChatModels`](https://code.visualstudio.com/api/references/vscode-api#lm.selectChatModels) 方法选择要与之一起使用的语言模型。此方法返回一个与指定条件匹配的语言模型数组。如果您正在实现聊天参与者，我们建议您改为使用作为 `request` 对象的一部分传递的模型，以便在聊天请求处理程序中使用。这样可以确保您的扩展尊重用户在聊天模型下拉菜单中选择的模型。然后，您可以使用 [`sendRequest`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat) 方法将请求发送到语言模型。

To select the language model, you can specify the following properties: `vendor`, `id`, `family`, or `version`. Use these properties to either broadly match all models of a given vendor or family, or select one specific model by its ID. Learn more about these properties in the [API reference](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat).

要选择语言模型，您可以指定以下属性：`vendor`、`id`、`family` 或 `version`。使用这些属性可以广泛匹配给定供应商或系列的所有模型，或通过其 ID 选择一个特定模型。在[API 参考](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChat)中了解有关这些属性的更多信息。

> Note: Currently, `gpt-4o`, `gpt-4o-mini`, `o1-preview`, `o1-mini`, `claude-3.5-sonnet`, `gemini-1.5-pro` are supported for the language model family. If you are unsure what model to use, we recommend `gpt-4o` for it's performance and quality. For interactions directly in the editor, we recommend `gpt-4o-mini` for it's performance.

> 注意：目前，`gpt-4o`、`gpt-4o-mini`、`o1-preview`、`o1-mini`、`claude-3.5-sonnet`、`gemini-1.5-pro` 支持语言模型系列。如果您不确定要使用哪个模型，我们建议使用 `gpt-4o`，因为它的性能和质量。对于直接在编辑器中进行的交互，我们建议使用 `gpt-4o-mini`，因为它的性能。

| Model Name | Vendor | Family | Version | ID | Max Input Tokens |
| --- | --- | --- | --- | --- | --- |
| Claude 3.5 Sonnet (Preview) | copilot | claude-3.5-sonnet | claude-3.5-sonnet | claude-3.5-sonnet | 194830 |
| GPT 4o | copilot | gpt-4o | gpt-4o-2024-05-13 | gpt-4o | 63830 |
| o1-mini (Preview) | copilot | o1-mini | o1-mini-2024-09-12 | o1-mini | 19830 |
| o1-preview (Preview) | copilot | o1 | o1-preview-2024-09-12 | o1-preview | 19830 |

If there are no models that match the specified criteria, the `selectChatModels` method returns an empty array. Your extension must appropriately handle this case.

如果没有与指定条件匹配的模型，`selectChatModels` 方法将返回一个空数组。您的扩展必须适当处理这种情况。

The following example shows how to select all `Copilot` models, regardless of the family or version:

以下示例显示了如何选择所有 `Copilot` 模型，而不考虑系列或版本：

```typescript
const models = await vscode.lm.selectChatModels({
  vendor: 'copilot'
});

// No models available
// 没有可用的模型
if (models.length === 0) {
  // TODO: handle the case when no models are available
  // 处理没有可用模型的情况
}
```

> Important: Copilot's language models require consent from the user before an extension can use them. Consent is implemented as an authentication dialog. Because of that, selectChatModels should be called as part of a user-initiated action, such as a command.

> 重要提示：Copilot 的语言模型要求用户在扩展使用它们之前同意。同意以身份验证对话框的形式实现。因此，selectChatModels 应作为用户发起的操作的一部分调用，例如命令。

After you select a model, you can send a request to the language model by invoking the `sendRequest` method on the model instance. You pass the [prompt](https://code.visualstudio.com/api/extension-guides/language-model#build-the-language-model-prompt) you crafted earlier, along with any additional options, and a cancellation token.

选择模型后，您可以通过在模型实例上调用 `sendRequest` 方法向语言模型发送请求。您传递您之前构建的[提示](https://code.visualstudio.com/api/extension-guides/language-model#build-the-language-model-prompt)，以及任何其他选项和取消令牌。

The following code snippet shows how to make a language model request:

以下代码片段显示了如何发出语言模型请求：

```typescript
try {
  const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });
  const request = model.sendRequest(craftedPrompt, {}, token);
} catch (err) {
  // Making the chat request might fail because
  // - model does not exist
  // - user consent not given
  // - quota limits were exceeded
  // 聊天请求可能失败，因为：
  // - 模型不存在
  // - 用户未给予同意
  // - 超过了配额限制
  if (err instanceof vscode.LanguageModelError) {
    console.log(err.message, err.code, err.cause);
    if (err.cause instanceof Error && err.cause.message.includes('off_topic')) {
      stream.markdown(
        vscode.l10n.t("I'm sorry, I can only explain computer science concepts.")
      );
    }
  } else {
    // add other error handling logic
    // 添加其他错误处理逻辑
    throw err;
  }
}
```

## Interpret the response（解释响应）

After you've sent the request, you have to process the response from the language model API. Depending on your usage scenario, you can pass the response directly on to the user, or you can interpret the response and perform extra logic.

发送请求后，您必须处理来自语言模型 API 的响应。根据您的使用场景，您可以直接将响应传递给用户，也可以解释响应并执行额外的逻辑。

The response ([`LanguageModelChatResponse`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChatResponse)) from the Language Model API is streaming-based, which enables you to provide a smooth user experience. For example, by reporting results and progress continuously when you use the API in combination with the [Chat API](https://code.visualstudio.com/api/extension-guides/chat).

语言模型 API 的响应 ([`LanguageModelChatResponse`](https://code.visualstudio.com/api/references/vscode-api#LanguageModelChatResponse)) 是基于流的，这使您能够提供流畅的用户体验。例如，当您将 API 与[Chat API](https://code.visualstudio.com/api/extension-guides/chat)结合使用时，可以连续报告结果和进度。

Errors might occur while processing the streaming response, such as network connection issues. Make sure to add appropriate error handling in your code to handle these errors.

在处理流式响应时可能会发生错误，例如网络连接问题。确保在代码中添加适当的错误处理以处理这些错误。

The following code snippet shows how an extension can register a command, which uses the language model to change all variable names in the active editor with funny cat names. Notice that the extension streams the code back to the editor for a smooth user experience.

以下代码片段显示了扩展如何注册一个命令，该命令使用语言模型将活动编辑器中的所有变量名称更改为有趣的猫名称。请注意，扩展将代码流式传回编辑器，以实现流畅的用户体验。

```typescript
vscode.commands.registerTextEditorCommand(
  'cat.namesInEditor',
  async (textEditor: vscode.TextEditor) => {
    // Replace all variables in active editor with cat names and words
    // 使用猫名称和单词替换活动编辑器中的所有变量

    const [model] = await vscode.lm.selectChatModels({
      vendor: 'copilot',
      family: 'gpt-4o'
    });
    let chatResponse: vscode.LanguageModelChatResponse | undefined;

    const text = textEditor.document.getText();

    // 你是一只猫！像猫一样仔细思考和一步一步地行动。
    // 你的工作是用猫的隐喻以有趣的方式替换以下代码中的所有变量名称。要有创意。重要的是只用代码回答。不要使用 markdown！
    const messages = [
      vscode.LanguageModelChatMessage
        .User(`You are a cat! Think carefully and step by step like a cat would.
        Your job is to replace all variable names in the following code with funny cat variable names. Be creative. IMPORTANT respond just with code. Do not use markdown!`),
      vscode.LanguageModelChatMessage.User(text)
    ];

    try {
      chatResponse = await model.sendRequest(
        messages,
        {},
        new vscode.CancellationTokenSource().token
      );
    } catch (err) {
      if (err instanceof vscode.LanguageModelError) {
        console.log(err.message, err.code, err.cause);
      } else {
        throw err;
      }
      return;
    }

    // Clear the editor content before inserting new content
    // 在插入新内容之前清除编辑器内容
    await textEditor.edit(edit => {
      const start = new vscode.Position(0, 0);
      const end = new vscode.Position(
        textEditor.document.lineCount - 1,
        textEditor.document.lineAt(textEditor.document.lineCount - 1).text.length
      );
      edit.delete(new vscode.Range(start, end));
    });

    try {
      // Stream the code into the editor as it is coming in from the Language Model
      // 将代码流式传输到编辑器，因为它是从语言模型中传入的
      for await (const fragment of chatResponse.text) {
        await textEditor.edit(edit => {
          const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
          const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
          edit.insert(position, fragment);
        });
      }
    } catch (err) {
      // async response stream may fail, e.g network interruption or server side error
      // 异步响应流可能会失败，例如网络中断或服务器端错误
      await textEditor.edit(edit => {
        const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
        const position = new vscode.Position(lastLine.lineNumber, lastLine.text.length);
        edit.insert(position, (<Error>err).message);
      });
    }
  }
);
```

## Considerations（注意事项）

### Model availability（模型可用性）

We don't expect specific models to stay supported forever. When you reference a language model in your extension, make sure to take a "defensive" approach when sending requests to that language model. This means that you should gracefully handle cases where you don't have access to a particular model.

我们不希望特定模型永远保持支持。当您在扩展中引用语言模型时，请确保在向该语言模型发送请求时采取“防御性”方法。这意味着您应该优雅地处理您无法访问特定模型的情况。

### Choosing the appropriate model（选择适当的模型）

Extension authors can choose which model is the most appropriate for their extension. We recommend using `gpt-4o` for its performance and quality. To get a full list of available models, you can use this code snippet:

扩展作者可以选择哪个模型最适合他们的扩展。我们建议使用 `gpt-4o`，因为它的性能和质量。要获取可用模型的完整列表，您可以使用以下代码片段：

```typescript
const allModels = await vscode.lm.selectChatModels(MODEL_SELECTOR);
```

> Note: The recommended GPT-4o model has a limit of `64K` tokens. The returned model object from the `selectChatModels` call has a `maxInputTokens` attribute that shows the token limit. These limits will be expanded as we learn more about how extensions are using the language models.

> 注意：推荐的 GPT-4o 模型有 `64K` 个令牌的限制。从 `selectChatModels` 调用返回的模型对象具有 `maxInputTokens` 属性，显示令牌限制。随着我们了解更多关于扩展如何使用语言模型的信息，这些限制将会扩展。

### Rate limiting（速率限制）

Extensions should responsibly use the language model and be aware of rate limiting. VS Code is transparent to the user regarding how extensions are using language models and how many requests each extension is sending and how that influences their respective quotas.

扩展应负责地使用语言模型，并了解速率限制。VS Code 对用户透明，用户可以了解扩展如何使用语言模型，每个扩展发送多少请求以及这如何影响各自的配额。

Extensions should not use the Language Model API for integration tests due to rate-limitations. Internally, VS Code uses a dedicated non-production language model for simulation testing, and we are currently thinking how to provide a scalable language model testing solution for extensions.

由于速率限制，扩展不应使用语言模型 API 进行集成测试。在内部，VS Code 使用专用的非生产语言模型进行模拟测试，我们目前正在考虑如何为扩展提供可扩展的语言模型测试解决方案。

## Testing your extension（测试您的扩展）

The responses that the Language Model API provides are nondeterministic, which means that you might get a different response for an identical request. This behavior can be challenging for testing your extension.

语言模型 API 提供的响应是非确定性的，这意味着您可能会得到一个相同请求的不同响应。这种行为可能会对测试您的扩展构成挑战。

The part of the extension for building prompts and interpreting language model responses is deterministic, and can thus be unit tested without using an actual language model. However, interacting and getting responses from the language model itself, is nondeterministic and can’t be easily tested. Consider designing your extension code in a modular way to enable you to unit test the specific parts that can be tested.

构建提示和解释语言模型响应的扩展部分是确定性的，因此可以在不使用实际语言模型的情况下进行单元测试。但是，与语言模型本身进行交互并获取响应是非确定性的，无法轻松测试。考虑以模块化的方式设计您的扩展代码，以便您可以对可以测试的特定部分进行单元测试。

## Publishing your extension（发布您的扩展）

Once you have created your AI extension, you can publish your extension to the Visual Studio Marketplace:

一旦您创建了 AI 扩展，您可以将扩展发布到 Visual Studio Marketplace：

- Before publishing to the VS Marketplace we recommend that you read the [Microsoft AI tools and practices guidelines](https://www.microsoft.com/en-us/ai/tools-practices). These guidelines provide best practices for the responsible development and use of AI technologies.
- By publishing to the VS Marketplace, your extension is adhering to the [GitHub Copilot extensibility acceptable development and use policy](https://docs.github.com/en/early-access/copilot/github-copilot-extensibility-platform-partnership-plugin-acceptable-development-and-use-policy).
- If your extension already contributes functionality other than using the Language Model API, we recommend that you do not introduce an extension dependency on GitHub Copilot in the [extension manifest](https://code.visualstudio.com/api/references/extension-manifest). This ensures that extension users that do not use GitHub Copilot can use the non language model functionality without having to install GitHub Copilot. Make sure to have appropriate error handling when accessing language models for this case.
- Upload to the Marketplace as described in [Publishing Extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).

---

- 在发布到 VS Marketplace 之前，我们建议您阅读[Microsoft AI 工具和实践指南](https://www.microsoft.com/en-us/ai/tools-practices)。这些指南提供了负责任地开发和使用 AI 技术的最佳实践。
- 通过发布到 VS Marketplace，您的扩展遵守[GitHub Copilot 可接受的开发和使用政策](https://docs.github.com/en/early-access/copilot/github-copilot-extensibility-platform-partnership-plugin-acceptable-development-and-use-policy)。
- 如果您的扩展已经提供除使用语言模型 API 之外的功能，我们建议您不要在[扩展清单](https://code.visualstudio.com/api/references/extension-manifest)中引入对 GitHub Copilot 的扩展依赖。这样可以确保不使用 GitHub Copilot 的扩展用户可以在无需安装 GitHub Copilot 的情况下使用非语言模型功能。在访问语言模型时，请确保具有适当的错误处理。
- 按照[发布扩展](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)中描述的步骤上传到 Marketplace。

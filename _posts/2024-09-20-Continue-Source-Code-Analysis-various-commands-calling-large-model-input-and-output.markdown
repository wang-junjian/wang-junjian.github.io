---
layout: post
title:  "Continue 源码分析 - 各种命令调用大模型的输入和输出"
date:   2024-09-20 08:00:00 +0800
categories: Continue AICodingAssistant
tags: [Continue, Langfuse, GitHubCopilot, LLM]
---

## Tab Completion

![](/images/2024/Continue/Langfuse-Tab-Completion.png)

### 输入

![](/images/2024/Continue/Langfuse-Tab-Completion-Input.png)

```json
{
    "messages": [
        {
            "role": "user",
            "content": "You are a HOLE FILLER. You are provided with a file containing holes, formatted as '{{HOLE_NAME}}'. Your TASK is to complete with a string to replace this hole with, inside a <COMPLETION/> XML tag, including context-aware indentation, if needed.  All completions MUST be truthful, accurate, well-written and correct.\n\n## EXAMPLE QUERY:\n\n<QUERY>\nfunction sum_evens(lim) {\n  var sum = 0;\n  for (var i = 0; i < lim; ++i) {\n    {{FILL_HERE}}\n  }\n  return sum;\n}\n</QUERY>\n\nTASK: Fill the {{FILL_HERE}} hole.\n\n## CORRECT COMPLETION\n\n<COMPLETION>if (i % 2 === 0) {\n      sum += i;\n    }</COMPLETION>\n\n## EXAMPLE QUERY:\n\n<QUERY>\ndef sum_list(lst):\n  total = 0\n  for x in lst:\n  {{FILL_HERE}}\n  return total\n\nprint sum_list([1, 2, 3])\n</QUERY>\n\n## CORRECT COMPLETION:\n\n<COMPLETION>  total += x</COMPLETION>\n\n## EXAMPLE QUERY:\n\n<QUERY>\n// data Tree a = Node (Tree a) (Tree a) | Leaf a\n\n// sum :: Tree Int -> Int\n// sum (Node lft rgt) = sum lft + sum rgt\n// sum (Leaf val)     = val\n\n// convert to TypeScript:\n{{FILL_HERE}}\n</QUERY>\n\n## CORRECT COMPLETION:\n\n<COMPLETION>type Tree<T>\n  = {$:\"Node\", lft: Tree<T>, rgt: Tree<T>}\n  | {$:\"Leaf\", val: T};\n\nfunction sum(tree: Tree<number>): number {\n  switch (tree.$) {\n    case \"Node\":\n      return sum(tree.lft) + sum(tree.rgt);\n    case \"Leaf\":\n      return tree.val;\n  }\n}</COMPLETION>\n\n## EXAMPLE QUERY:\n\nThe 5th {{FILL_HERE}} is Jupiter.\n\n## CORRECT COMPLETION:\n\n<COMPLETION>planet from the Sun</COMPLETION>\n\n## EXAMPLE QUERY:\n\nfunction hypothenuse(a, b) {\n  return Math.sqrt({{FILL_HERE}}b ** 2);\n}\n\n## CORRECT COMPLETION:\n\n<COMPLETION>a ** 2 + </COMPLETION>\n\n<QUERY>\nfrom sglang import function, system, user, assistant, gen, set_default_backend, RuntimeEndpoint\n\n@function\ndef multi_turn_question(s, question_1, question_2):\n    s += system(\"You are a helpful assistant.\")\n    s += user(question_1)\n    s += assistant(gen(\"answer_1\", max_tokens=256))\n    s += user(question_2)\n    s += assistant(gen(\"answer_2\", max_tokens=256))\n\nset_default_backend(RuntimeEndpoint(\"http://172.16.33.66:30000\"))\n\nstate = multi_turn_question.run(\n    question_1=\"What is the capital of the United States?\",\n    question_2=\"List two local attractions.\",\n)\n\nfor m in state.messages():\n    print(m[\"role\"], \":\", m[\"content\"])\n\nprint(state[\"answer_1\"])\n\n# RuntimeEndpoint: {{FILL_HERE}}\n</QUERY>\nTASK: Fill the {{FILL_HERE}} hole. Answer only with the CORRECT completion, and NOTHING ELSE. Do it now.\n<COMPLETION>"
        }
    ]
}
```

### 输出

![](/images/2024/Continue/Langfuse-Tab-Completion-Output.png)

```json
{
    "role": "assistant",
    "content": "<COMPLETION>http://172.16.33.66:30000",
    "tool_calls": null,
    "function_call": null
}
```


## 聊天：上下文（NO）

**快捷键**：Enter (`⏎`)

![](/images/2024/Continue/Langfuse-Chat-Context-NO.png)

### 输入

![](/images/2024/Continue/Langfuse-Chat-Context-NO-Input.png)

```json
{
    "messages": [
        {
            "role": "user",
            "content": "RuntimeEndpoint的参数是？"
        }
    ]
}
```

### 输出

![](/images/2024/Continue/Langfuse-Chat-Context-NO-Output.png)

```json
{
    "role": "assistant",
    "content": "`RuntimeEndpoint` 的具体参数取决于它在哪个框架或库中的实现，因为不同的环境可能会有不同的定义。我没有确切的上下文信息来确定您提到的 `RuntimeEndpoint` 是哪一个。不过，我可以提供一个一般的假设性定义来帮助理解可能的参数。假设 `RuntimeEndpoint` 是在一个Web服务框架中用于定义运行时访问点的类或接口，那么其参数可能包括：\n\n1. **Path** (字符串)：表示Endpoint的URL路径。\n2. **Method** (字符串或枚举)：HTTP方法（如GET, POST, PUT, DELETE等）。\n3. **Handler** (函数或类)：处理请求的函数或类实例。\n4. **Auth** (布尔值或对象)：是否需要认证，或认证的具体配置。\n5. **Validation** (对象)：请求参数或body的验证规则。\n6. **Middleware** (数组)：在此Endpoint上应用的中间件列表，用于处理请求/响应前后的操作。\n7. **Metadata** (对象)：附加的元数据，可能包括文档信息、标签等。\n\n例如，如果您是使用ASP.NET Core来定义一个API端点，可能会看起来像这样：\n\n```csharp\n[Route(\"api/[controller]\")]\n[ApiController]\npublic class ValuesController : ControllerBase\n{\n    // GET api/values\n    [HttpGet]\n    public ActionResult<IEnumerable<string>> Get()\n    {\n        return new string[] { \"value1\", \"value2\" };\n    }\n}\n```\n\n在这个例子中：\n- `Route` 特性定义了Controller的基础路径。\n- `HttpGet` 特性定义了HTTP方法。\n- `Get` 方法是处理请求的Handler。\n\n如果你能提供更具体的上下文或框架信息，我可以给出更准确的参数列表。",
    "tool_calls": null,
    "function_call": null
}
```


## 聊天：上下文（代码块）

**快捷键**：Cmd-L (`⌘` `L`)

![](/images/2024/Continue/Langfuse-Chat-Context-Code-Block.png)

### 输入

![](/images/2024/Continue/Langfuse-Chat-Context-Code-Block-Input.png)

```json
{
    "messages": [
        {
            "role": "user",
            "content": "```test.py (3-10)\n@function\ndef multi_turn_question(s, question_1, question_2):\n    s += system(\"You are a helpful assistant.\")\n    s += user(question_1)\n    s += assistant(gen(\"answer_1\", max_tokens=256))\n    s += user(question_2)\n    s += assistant(gen(\"answer_2\", max_tokens=256))\n\n```\n解释实现的功能"
        }
    ]
}
```

### 输出

![](/images/2024/Continue/Langfuse-Chat-Context-Code-Block-Output.png)

```json
{
    "role": "assistant",
    "content": "这段代码是一个多轮对话的生成函数，使用了一种类似于对话模型的框架。让我们逐步解释它的功能和实现方式：\n\n1. **装饰器 `@function`**:\n   - 这个装饰器可能是一个自定义的装饰器，用于标记 `multi_turn_question` 函数为一个特定类型的函数，例如一个对话生成函数。\n\n2. **函数 `multi_turn_question`**:\n   - 这个函数接受四个参数：\n     - `s`：一个字符串或对象，用于构建对话流。\n     - `question_1`：第一个问题。\n     - `question_2`：第二个问题。\n\n3. **构建对话流**:\n   - `s += system(\"You are a helpful assistant.\")`：\n     - 这行代码将系统角色的初始提示添加到对话流中，告诉模型“你是一个有用的助手”。\n   - `s += user(question_1)`：\n     - 这行代码将用户的第一轮问题添加到对话流中。\n   - `s += assistant(gen(\"answer_1\", max_tokens=256))`：\n     - 这行代码生成第一个问题的答案，并将其添加到对话流中。`gen` 函数可能是一个生成器函数，用于生成模型的回答，`max_tokens=256` 限制了生成的回答的最大长度。\n   - `s += user(question_2)`：\n     - 这行代码将用户的第二轮问题添加到对话流中。\n   - `s += assistant(gen(\"answer_2\", max_tokens=256))`：\n     - 这行代码生成第二个问题的答案，并将其添加到对话流中。\n\n4. **返回值**:\n   - 函数没有显式返回值，但它通过修改传入的 `s` 对象构建了一个完整的多轮对话流。\n\n总结起来，`multi_turn_question` 函数的作用是构建一个包含两轮用户提问和助手回答的对话流。通过使用 `system`、`user` 和 `assistant` 等方法，它逐步构建了一个结构化的对话，其中每一部分都由相应的内容填充。最终，这个对话流可以被用于生成或展示多轮对话的内容。",
    "tool_calls": null,
    "function_call": null
}
```


## 聊天：上下文（激活的文件）

**快捷键**：Alt-Enter (`⌥` `⏎`)

![](/images/2024/Continue/Langfuse-Chat-Context-Active-File.png)

### 输入

![](/images/2024/Continue/Langfuse-Chat-Context-Active-File-Input.png)

```json
{
    "messages": [
        {
            "role": "user",
            "content": "The following file is currently open. Don't reference it if it's not relevant to the user's message.\n\n```test.py\nfrom sglang import function, system, user, assistant, gen, set_default_backend, RuntimeEndpoint\n\n@function\ndef multi_turn_question(s, question_1, question_2):\n    s += system(\"You are a helpful assistant.\")\n    s += user(question_1)\n    s += assistant(gen(\"answer_1\", max_tokens=256))\n    s += user(question_2)\n    s += assistant(gen(\"answer_2\", max_tokens=256))\n\nset_default_backend(RuntimeEndpoint(\"http://172.16.33.66:30000\"))\n\nstate = multi_turn_question.run(\n    question_1=\"What is the capital of the United States?\",\n    question_2=\"List two local attractions.\",\n)\n\nfor m in state.messages():\n    print(m[\"role\"], \":\", m[\"content\"])\n\nprint(state[\"answer_1\"])\n```\n\nRuntimeEndpoint的参数是？"
        }
    ]
}
```

### 输出

![](/images/2024/Continue/Langfuse-Chat-Context-Active-File-Output.png)

```json
{
    "role": "assistant",
    "content": "`RuntimeEndpoint` 的参数是用于指定运行时环境的 URL。这个 URL 指定了后端服务的地址，用于处理生成任务和执行对话逻辑。\n\n在你的代码中，`RuntimeEndpoint` 的参数是 `\"http://172.16.33.66:30000\"`，这表示后端服务运行在 IP 地址为 `172.16.33.66` 的机器上，并且监听端口 `30000`。\n\n```python\nset_default_backend(RuntimeEndpoint(\"http://172.16.33.66:30000\"))\n```\n\n这个参数需要根据你的实际后端服务的地址进行设置。如果你有其他后端服务地址，可以将其替换为相应的 URL。例如：\n\n```python\nset_default_backend(RuntimeEndpoint(\"http://your-backend-service-url:port\"))\n```\n\n确保这个地址可以被你的代码访问到，以便能够正确地与后端服务进行通信。",
    "tool_calls": null,
    "function_call": null
}
```


## 聊天：上下文（通过 RAG 检索项目的文件）

**快捷键**：Cmd-Enter (`⌘` `⏎`)

![](/images/2024/Continue/Langfuse-Chat-Context-RAG.png)

### 输入

![](/images/2024/Continue/Langfuse-Chat-Context-RAG-Input.png)

```json
{
    "messages": [
        {
            "role": "user",
            "content": "```python/sglang/lang/chat_template.py (5-7)\nclass ChatTemplateStyle(Enum):\n    PLAIN = auto()\n    LLAMA2 = auto()\n```\n\n```python/sglang/srt/layers/pooler.py (12-13)\nclass PoolingType(IntEnum):\n    LAST = 0\n```\n\n```python/sglang/lang/backend/runtime_endpoint.py (224-274)\nclass RuntimeEndpoint(BaseBackend):\n    ...\n\n    def select(\n        self,\n        s: StreamExecutor,\n        choices: List[str],\n        temperature: float,\n        choices_method: ChoicesSamplingMethod,\n    ) -> ChoicesDecision:\n        ...\n```\n\n```test.py (0-20)\nfrom sglang import function, system, user, assistant, gen, set_default_backend, RuntimeEndpoint\n\n@function\ndef multi_turn_question(s, question_1, question_2):\n    s += system(\"You are a helpful assistant.\")\n    s += user(question_1)\n    s += assistant(gen(\"answer_1\", max_tokens=256))\n    s += user(question_2)\n    s += assistant(gen(\"answer_2\", max_tokens=256))\n\nset_default_backend(RuntimeEndpoint(\"http://172.16.33.66:30000\"))\n\nstate = multi_turn_question.run(\n    question_1=\"What is the capital of the United States?\",\n    question_2=\"List two local attractions.\",\n)\n\nfor m in state.messages():\n    print(m[\"role\"], \":\", m[\"content\"])\n\nprint(state[\"answer_1\"])\n```\n\nUse the above code to answer the following question. You should not reference any files outside of what is shown, unless they are commonly known files, like a .gitignore or package.json. Reference the filenames whenever possible. If there isn't enough information to answer the question, suggest where the user might look to learn more.\n\nRuntimeEndpoint的参数是？"
        }
    ]
}
```

### 输出

![](/images/2024/Continue/Langfuse-Chat-Context-RAG-Output.png)

```json
{
    "role": "assistant",
    "content": "根据提供的代码片段，`RuntimeEndpoint` 类的定义在 `python/sglang/lang/backend/runtime_endpoint.py` 文件中。从 `test.py` 文件中的使用情况可以看出，`RuntimeEndpoint` 的构造函数接受一个参数，即后端的 URL 地址。\n\n具体来说，`RuntimeEndpoint` 的构造函数签名如下：\n\n```python\nclass RuntimeEndpoint(BaseBackend):\n    def __init__(self, url: str):\n        # 初始化代码\n        ...\n```\n\n在 `test.py` 文件中，`RuntimeEndpoint` 是这样被使用的：\n\n```python\nset_default_backend(RuntimeEndpoint(\"http://172.16.33.66:30000\"))\n```\n\n因此，`RuntimeEndpoint` 的参数是一个字符串，表示后端服务的 URL 地址。",
    "tool_calls": null,
    "function_call": null
}
```

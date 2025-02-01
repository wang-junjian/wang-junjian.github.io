---
layout: post
title:  "Claude API: Computer use"
date:   2025-02-01 12:00:00 +0800
categories: Claude API
tags: [Claude, API, Agent, Anthropics]
---

- [Claude API - Computer use](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)

## [Computer use reference implementation（计算机使用参考实现）](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)

Get started quickly with our computer use reference implementation that includes a web interface, Docker container, example tool implementations, and an agent loop.

快速开始使用我们的计算机使用参考实现，其中包括Web界面、Docker容器、示例工具实现和代理循环。

Here’s an example of how to provide computer use tools to Claude using the Messages API:

以下是如何使用消息API为Claude提供计算机使用工具的示例：

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20241022",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20241022",
          "name": "str_replace_editor"
        },
        {
          "type": "bash_20241022",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
    betas=["computer-use-2024-10-22"],
)
print(response)
```
- Save a picture of a cat to my desktop.（将一张猫的图片保存到我的桌面。）

## How computer use works（计算机使用如何工作）
1. Provide Claude with computer use tools and a user prompt（为Claude提供计算机使用**工具**和**用户提示**）
    - Add Anthropic-defined computer use tools to your API request.
    - 将Anthropic定义的计算机使用工具添加到您的API请求中。
    - Include a user prompt that might require these tools, e.g., “Save a picture of a cat to my desktop.”
    - 包括可能需要这些工具的用户提示，例如“将一张猫的图片保存到我的桌面。”

2. Claude decides to use a tool（Claude决定使用工具）
    - Claude loads the stored computer use tool definitions and assesses if any tools can help with the user’s query.
    - Claude加载存储的计算机使用工具定义，并评估是否有任何工具可以帮助用户查询。
    - If yes, Claude constructs a properly formatted tool use request.
    - 如果是，Claude构建一个格式正确的工具使用请求。
    - The API response has a stop_reason of tool_use, signaling Claude’s intent.
    - API响应具有一个tool_use的stop_reason，表示Claude的意图。

3. Extract tool input, evaluate the tool on a computer, and return results（提取工具输入，评估计算机上的工具，并返回结果）
    - On your end, extract the tool name and input from Claude’s request.
    - 在您的端上，从Claude的请求中提取工具名称和输入。
    - Use the tool on a container or Virtual Machine.
    - 在容器或虚拟机上使用工具。
    - Continue the conversation with a new user message containing a tool_result content block.
    - 继续对话，包含一个tool_result内容块的新用户消息。

4. Claude continues calling computer use tools until it's completed the task（Claude继续调用计算机使用工具，直到完成任务）

    - Claude analyzes the tool results to determine if more tool use is needed or the task has been completed.
    - Claude分析工具结果，以确定是否需要更多工具使用或任务已经完成。
    - If Claude decides it needs another tool, it responds with another tool_use stop_reason and you should return to step 3.
    - 如果Claude决定需要另一个工具，它将以另一个tool_use stop_reason作出响应，您应返回到第3步。
    - Otherwise, it crafts a text response to the user.
    - 否则，它会为用户制作一个文本响应。
    - We refer to the repetition of steps 3 and 4 without user input as the “agent loop” - i.e., Claude responding with a tool use request and your application responding to Claude with the results of evaluating that request.
    - 我们将在没有用户输入的情况下重复第3步和第4步称为“代理循环”——即，Claude响应一个工具使用请求，您的应用程序响应Claude评估该请求的结果。

## How to implement computer use（如何实现计算机使用）
### Start with our reference implementation（从我们的参考实现开始）

We have built a [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) that includes everything you need to get started quickly with computer use:

我们构建了一个[参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)，其中包括您快速开始使用计算机的所有必需内容：

- A [containerized environment](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) suitable for computer use with Claude
- 适用于Claude计算机使用的[容器化环境](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile)
- Implementations of [the computer use tools](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- 计算机使用工具的[实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- An [agent loop](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) that interacts with the Anthropic API and executes the computer use tools
- 与Anthropic API交互并执行计算机使用工具的[代理循环](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py)
- A web interface to interact with the container, agent loop, and tools.
- 一个Web界面，用于与容器、代理循环和工具进行交互。

We recommend trying the reference implementation out before reading the rest of this documentation.

我们建议在阅读本文档的其余部分之前先尝试参考实现。

### Optimize model performance with prompting（通过提示优化模型性能）

Here are some tips on how to get the best quality outputs:

以下是一些有关如何获得最佳质量输出的提示：

- Specify simple, well-defined tasks and provide explicit instructions for each step.
- 指定简单、明确定义的任务，并为每个步骤提供明确的说明。
- Claude sometimes assumes outcomes of its actions without explicitly checking their results. To prevent this you can prompt Claude with **After each step, take a screenshot and carefully evaluate if you have achieved the right outcome. Explicitly show your thinking: "I have evaluated step X..." If not correct, try again. Only when you confirm a step was executed correctly should you move on to the next one.**
- Claude有时会假设其行动的结果，而不明确检查其结果。为了防止这种情况，您可以提示Claude：**在每个步骤之后，拍摄屏幕截图，并仔细评估是否已经达到了正确的结果。明确显示您的思考：“我已经评估了第X步……”如果不正确，请重试。只有在确认一步执行正确后，您才应该继续下一步。**
- Some UI elements (like dropdowns and scrollbars) might be tricky for Claude to manipulate using mouse movements. If you experience this, try prompting the model to use keyboard shortcuts.
- 一些UI元素（如下拉菜单和滚动条）可能会让Claude使用鼠标移动来操作。如果您遇到这种情况，请尝试提示模型使用键盘快捷键。
- For repeatable tasks or UI interactions, include example screenshots and tool calls of successful outcomes in your prompt.
- 对于可重复的任务或UI交互，请在您的提示中包含成功结果的示例屏幕截图和工具调用。
- If you need the model to log in, provide it with the username and password in your prompt inside xml tags like &lt;`robot_credentials`&gt;. Using computer use within applications that require login increases the risk of bad outcomes as a result of prompt injection. Please review our [guide on mitigating prompt injections](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) before providing the model with login credentials.
- 如果您需要模型登录，请在您的提示中使用xml标签（如&lt;`robot_credentials`&gt;）提供用户名和密码。在需要登录的应用程序中使用计算机使用会增加由于提示注入而导致不良结果的风险。在向模型提供登录凭据之前，请查看我们关于[减轻提示注入的指南](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)。

> If you repeatedly encounter a clear set of issues or know in advance the tasks Claude will need to complete, use the system prompt to provide Claude with explicit tips or instructions on how to do the tasks successfully.

> 如果您反复遇到一组明确的问题或事先知道Claude需要完成的任务，请使用系统提示为Claude提供有关如何成功完成任务的明确提示或说明。

### System prompts（系统提示）

When one of the Anthropic-defined tools is requested via the Anthropic API, a computer use-specific system prompt is generated. It’s similar to the [tool use system prompt](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#tool-use-system-prompt) but starts with:

当通过Anthropic API请求Anthropic定义的工具之一时，将生成一个计算机使用特定的系统提示。它类似于[工具使用系统提示](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#tool-use-system-prompt)，但以以下内容开头：

> You have access to a set of functions you can use to answer the user’s question. This includes access to a sandboxed computing environment. You do NOT currently have the ability to inspect files or interact with external resources, except by invoking the below functions.

> 您可以使用一组函数来回答用户的问题。这包括访问一个沙盒计算环境。您目前无法检查文件或与外部资源交互，除非调用以下函数。

As with regular tool use, the user-provided **system_prompt** field is still respected and used in the construction of the combined system prompt.

与常规工具使用一样，仍然尊重用户提供的 **system_prompt** 字段，并用于构建组合系统提示。

### Understand Anthropic-defined tools（了解Anthropic定义的工具）

We have provided a set of tools that enable Claude to effectively use computers. When specifying an Anthropic-defined tool, **description** and **tool_schema** fields are not necessary or allowed.

我们提供了一组工具，使Claude能够有效地使用计算机。在指定Anthropic定义的工具时，**description** 和 **tool_schema** 字段是不必要的，也不允许。

> ℹ️ Anthropic-defined tools are user executed（Anthropic定义的工具是用户执行的）

    Anthropic-defined tools are defined by Anthropic but you must explicitly evaluate the results of the tool and return the tool_results to Claude. As with any tool, the model does not automatically execute the tool.

    Anthropic定义的工具由Anthropic定义，但您必须明确评估工具的结果并将工具结果返回给Claude。与任何工具一样，模型不会自动执行工具。

We currently provide 3 Anthropic-defined tools:（我们目前提供3个Anthropic定义的工具：）

- { "type": "computer_20241022", "name": "computer" }
- { "type": "text_editor_20241022", "name": "str_replace_editor" }
- { "type": "bash_20241022", "name": "bash" }

The **type** field identifies the tool and its parameters for validation purposes, the **name** field is the tool name exposed to the model.

**type**字段用于识别工具及其参数以进行验证，**name**字段是向模型公开的工具名称。

If you want to prompt the model to use one of these tools, you can explicitly refer the tool by the **name** field. The **name** field must be unique within the tool list; you cannot define a tool with the same name as an Anthropic-defined tool in the same API call.

如果您想提示模型使用这些工具中的一个，您可以通过**name**字段显式引用该工具。**name**字段必须在工具列表中是唯一的；您不能在同一API调用中定义与Anthropic定义的工具相同名称的工具。

We do not recommend defining tools with the names of Anthropic-defined tools. While you can still redefine tools with these names (as long as the tool name is unique in your **tools** block), doing so may result in degraded model performance.

⚠️ 我们不建议使用Anthropic定义的工具的名称定义工具。虽然您仍然可以重新定义具有这些名称的工具（只要工具名称在您的**tools**块中是唯一的），但这样做可能会导致模型性能下降。

#### Computer tool

We do not recommend sending screenshots in resolutions above [XGA/WXGA](https://en.wikipedia.org/wiki/Display_resolution_standards#XGA) to avoid issues related to [image resizing](https://docs.anthropic.com/en/docs/build-with-claude/vision#evaluate-image-size). Relying on the image resizing behavior in the API will result in lower model accuracy and slower performance than directly implementing scaling yourself.

我们不建议发送分辨率高于[XGA/WXGA](https://en.wikipedia.org/wiki/Display_resolution_standards#XGA)的屏幕截图，以避免与[图像调整](https://docs.anthropic.com/en/docs/build-with-claude/vision#evaluate-image-size)相关的问题。依赖API中的图像调整行为将导致比直接实现缩放自己更低的模型准确性和更慢的性能。

The [reference repository](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools/computer.py) demonstrates how to scale from higher resolutions to a suggested resolution.

[参考存储库](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools/computer.py)演示了如何从更高的分辨率缩放到建议的分辨率。

**Type**

`computer_20241022`

**Parameters**
- `display_width_px`: **Required** The width of the display being controlled by the model in pixels.（模型控制的显示器的宽度）
- `display_height_px`: **Required** The height of the display being controlled by the model in pixels.（模型控制的显示器的高度）
- `display_number`: **Optional** The display number to control (only relevant for X11 environments). If specified, the tool will be provided a display number in the tool definition.（要控制的显示器编号（仅适用于X11环境）。如果指定，将在工具定义中提供显示器编号。）

**Tool description**

We are providing our tool description **for reference only**. You should not specify this in your Anthropic-defined tool call.

我们提供我们的工具描述**仅供参考**。您不应在Anthropic定义的工具调用中指定此内容。

```
Use a mouse and keyboard to interact with a computer, and take screenshots.
* This is an interface to a desktop GUI. You do not have access to a terminal or applications menu. You must click on desktop icons to start applications.
* Some applications may take time to start or process actions, so you may need to wait and take successive screenshots to see the results of your actions. E.g. if you click on Firefox and a window doesn't open, try taking another screenshot.
* The screen's resolution is {{ display_width_px }}x{{ display_height_px }}.
* The display number is {{ display_number }}
* Whenever you intend to move the cursor to click on an element like an icon, you should consult a screenshot to determine the coordinates of the element before moving the cursor.
* If you tried clicking on a program or link but it failed to load, even after waiting, try adjusting your cursor position so that the tip of the cursor visually falls on the element that you want to click.
* Make sure to click any buttons, links, icons, etc with the cursor tip in the center of the element. Don't click boxes on their edges unless asked.
```

```
使用鼠标和键盘与计算机进行交互，并拍摄屏幕截图。
* 这是一个桌面GUI的接口。您无法访问终端或应用程序菜单。您必须单击桌面图标来启动应用程序。
* 一些应用程序可能需要一些时间来启动或处理操作，因此您可能需要等待并拍摄连续的屏幕截图，以查看您的操作结果。例如，如果您单击Firefox，但窗口没有打开，请尝试拍摄另一张屏幕截图。
* 屏幕的分辨率为{{ display_width_px }}x{{ display_height_px }}。
* 显示器编号为{{ display_number }}
* 每当您打算将光标移动到像图标这样的元素上单击时，您应该查看屏幕截图，以确定元素的坐标，然后再移动光标。
* 如果您尝试单击程序或链接，但即使等待后也无法加载，请尝试调整光标位置，使光标的尖端视觉上落在您要单击的元素上。
* 确保将光标的尖端放在任何按钮、链接、图标等的中心位置单击元素。除非另有要求，否则不要单击边缘上的框。
```

**Tool input schema**

We are providing our input schema **for reference only**. You should not specify this in your Anthropic-defined tool call.

我们提供我们的输入模式**仅供参考**。您不应在Anthropic定义的工具调用中指定此内容。

```json
{
    "properties": {
        "action": {
            "description": """The action to perform. The available actions are:
                * `key`: Press a key or key-combination on the keyboard.
                  - This supports xdotool's `key` syntax.
                  - Examples: "a", "Return", "alt+Tab", "ctrl+s", "Up", "KP_0" (for the numpad 0 key).
                * `type`: Type a string of text on the keyboard.
                * `cursor_position`: Get the current (x, y) pixel coordinate of the cursor on the screen.
                * `mouse_move`: Move the cursor to a specified (x, y) pixel coordinate on the screen.
                * `left_click`: Click the left mouse button.
                * `left_click_drag`: Click and drag the cursor to a specified (x, y) pixel coordinate on the screen.
                * `right_click`: Click the right mouse button.
                * `middle_click`: Click the middle mouse button.
                * `double_click`: Double-click the left mouse button.
                * `screenshot`: Take a screenshot of the screen.""",
            "enum": [
                "key",
                "type",
                "mouse_move",
                "left_click",
                "left_click_drag",
                "right_click",
                "middle_click",
                "double_click",
                "screenshot",
                "cursor_position",
            ],
            "type": "string",
        },
        "coordinate": {
            "description": "(x, y): The x (pixels from the left edge) and y (pixels from the top edge) coordinates to move the mouse to. Required only by `action=mouse_move` and `action=left_click_drag`.",
            "type": "array",
        },
        "text": {
            "description": "Required only by `action=type` and `action=key`.",
            "type": "string",
        },
    },
    "required": ["action"],
    "type": "object",
}
```

- action.description

```
要执行的操作。可用的操作有：
    - `key`：在键盘上按键或按键组合。
        - 这支持xdotool的`key`语法。
        - 示例："a"、"Return"、"alt+Tab"、"ctrl+s"、"Up"、"KP_0"（用于数字键盘0键）。
    - `type`：在键盘上键入一串文本。
    - `cursor_position`：获取屏幕上光标的当前（x，y）像素坐标。
    - `mouse_move`：将光标移动到屏幕上指定的（x，y）像素坐标。
    - `left_click`：单击鼠标左键。
    - `left_click_drag`：单击并拖动光标到屏幕上指定的（x，y）像素坐标。
    - `right_click`：单击鼠标右键。
    - `middle_click`：单击鼠标中键。
    - `double_click`：双击鼠标左键。
    - `screenshot`：拍摄屏幕截图。
```

- coordinate.description

```
(x, y)：将鼠标移动到的x（从左边缘的像素）和y（从顶部边缘的像素）坐标。仅在`action=mouse_move`和`action=left_click_drag`时需要。
```

- text.description

```
仅在`action=type`和`action=key`时需要。
```

#### Text editor tool

**Type**

`text_editor_20241022`

**Tool description**

We are providing our tool description **for reference only**. You should not specify this in your Anthropic-defined tool call.

我们提供我们的工具描述**仅供参考**。您不应在Anthropic定义的工具调用中指定此内容。

```
Custom editing tool for viewing, creating and editing files
* State is persistent across command calls and discussions with the user
* If `path` is a file, `view` displays the result of applying `cat -n`. If `path` is a directory, `view` lists non-hidden files and directories up to 2 levels deep
* The `create` command cannot be used if the specified `path` already exists as a file
* If a `command` generates a long output, it will be truncated and marked with `<response clipped>`
* The `undo_edit` command will revert the last edit made to the file at `path`

Notes for using the `str_replace` command:
* The `old_str` parameter should match EXACTLY one or more consecutive lines from the original file. Be mindful of whitespaces!
* If the `old_str` parameter is not unique in the file, the replacement will not be performed. Make sure to include enough context in `old_str` to make it unique
* The `new_str` parameter should contain the edited lines that should replace the `old_str`
```

```
用于查看、创建和编辑文件的自定义编辑工具
* 状态在命令调用和与用户的讨论之间是持久的
* 如果`path`是一个文件，`view`显示应用`cat -n`的结果。如果`path`是一个目录，`view`列出非隐藏文件和目录，最多深度为2级
* 如果指定的`path`已经存在为文件，则无法使用`create`命令
* 如果`command`生成了一个长输出，它将被截断并标记为`<response clipped>`
* `undo_edit`命令将撤销对`path`处文件的最后一次编辑

使用`str_replace`命令的注意事项：
* `old_str`参数应该与原始文件中一个或多个连续行完全匹配。注意空格！
* 如果`old_str`参数在文件中不是唯一的，则不会执行替换。确保在`old_str`中包含足够的上下文，使其成为唯一的
* `new_str`参数应包含应替换`old_str`的编辑行
```

**Tool input schema**

We are providing our input schema **for reference only**. You should not specify this in your Anthropic-defined tool call.

```json
{
    "properties": {
        "command": {
            "description": "The commands to run. Allowed options are: `view`, `create`, `str_replace`, `insert`, `undo_edit`.",
            "enum": ["view", "create", "str_replace", "insert", "undo_edit"],
            "type": "string",
        },
        "file_text": {
            "description": "Required parameter of `create` command, with the content of the file to be created.",
            "type": "string",
        },
        "insert_line": {
            "description": "Required parameter of `insert` command. The `new_str` will be inserted AFTER the line `insert_line` of `path`.",
            "type": "integer",
        },
        "new_str": {
            "description": "Optional parameter of `str_replace` command containing the new string (if not given, no string will be added). Required parameter of `insert` command containing the string to insert.",
            "type": "string",
        },
        "old_str": {
            "description": "Required parameter of `str_replace` command containing the string in `path` to replace.",
            "type": "string",
        },
        "path": {
            "description": "Absolute path to file or directory, e.g. `/repo/file.py` or `/repo`.",
            "type": "string",
        },
        "view_range": {
            "description": "Optional parameter of `view` command when `path` points to a file. If none is given, the full file is shown. If provided, the file will be shown in the indicated line number range, e.g. [11, 12] will show lines 11 and 12. Indexing at 1 to start. Setting `[start_line, -1]` shows all lines from `start_line` to the end of the file.",
            "items": {"type": "integer"},
            "type": "array",
        },
    },
    "required": ["command", "path"],
    "type": "object",
}
```

- command.description

```
要运行的命令。允许的选项有：`view`、`create`、`str_replace`、`insert`、`undo_edit`。
```

- file_text.description

```
`create`命令的必需参数，包含要创建的文件的内容。
```

- insert_line.description

```
`insert`命令的必需参数。`new_str`将插入到`path`的`insert_line`行之后。
```

- new_str.description

```
`str_replace`命令的可选参数，包含新字符串（如果未给出，则不会添加字符串）。`insert`命令的必需参数，包含要插入的字符串。
```

- old_str.description

```
`str_replace`命令的必需参数，包含要替换`path`中的字符串。
```

- path.description

```
文件或目录的绝对路径，例如`/repo/file.py`或`/repo`。
```

- view_range.description

```
当`path`指向一个文件时，`view`命令的可选参数。如果没有给出，则显示完整文件。如果提供，文件将显示在指定的行号范围内，例如[11, 12]将显示第11行和第12行。从1开始索引。设置`[start_line, -1]`显示从`start_line`到文件末尾的所有行。
```

#### Bash tool

**Type**

`bash_20241022`

**Tool description**

We are providing our tool description **for reference only**. You should not specify this in your Anthropic-defined tool call.

```
Run commands in a bash shell
* When invoking this tool, the contents of the "command" parameter does NOT need to be XML-escaped.
* You have access to a mirror of common linux and python packages via apt and pip.
* State is persistent across command calls and discussions with the user.
* To inspect a particular line range of a file, e.g. lines 10-25, try 'sed -n 10,25p /path/to/the/file'.
* Please avoid commands that may produce a very large amount of output.
* Please run long lived commands in the background, e.g. 'sleep 10 &' or start a server in the background.
```

```
在bash shell中运行命令
* 调用此工具时，“command”参数的内容无需进行XML转义。
* 您可以通过apt和pip访问常见的linux和python软件包的镜像。
* 状态在命令调用和与用户的讨论之间是持久的。
* 要检查文件的特定行范围，例如第10-25行，请尝试“sed -n 10,25p /path/to/the/file”。
* 请避免产生大量输出的命令。
* 请在后台运行长时间运行的命令，例如“sleep 10 &”或在后台启动服务器。
```

**Tool input schema**

We are providing our input schema **for reference only**. You should not specify this in your Anthropic-defined tool call.

```json
{
    "properties": {
        "command": {
            "description": "The bash command to run. Required unless the tool is being restarted.",
            "type": "string",
        },
        "restart": {
            "description": "Specifying true will restart this tool. Otherwise, leave this unspecified.",
            "type": "boolean",
        },
    }
}
```

- command.description

```
要运行的bash命令。除非正在重新启动工具，否则必须指定。
```

- restart.description

```
指定为true将重新启动此工具。否则，不要指定此内容。
```

### Combine computer use with other tools（将计算机使用与其他工具结合使用）

You can combine [regular tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#single-tool-example) with the Anthropic-defined tools for computer use.

您可以将[常规工具使用](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#single-tool-example)与Anthropic定义的计算机使用工具结合使用。

```py
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20241022",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20241022",
          "name": "str_replace_editor"
        },
        {
          "type": "bash_20241022",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
    betas=["computer-use-2024-10-22"],
)
print(response)
```
- Get the current weather in a given location.（获取给定位置的当前天气。）
    - The city and state, e.g. San Francisco, CA.（城市和州，例如旧金山，加利福尼亚。）
    - The unit of temperature, either 'celsius' or 'fahrenheit'.（温度单位，可以是'celsius'或'fahrenheit'。）
- Find flights from San Francisco to a place with warmer weather.（查找从旧金山到气候更暖和的地方的航班。）

### Build a custom computer use environment（构建自定义计算机使用环境）

The [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) is meant to help you get started with computer use. It includes all of the components needed have Claude use a computer. However, you can build your own environment for computer use to suit your needs. You’ll need:

- A virtualized or containerized environment suitable for computer use with Claude
- An implementation of at least one of the Anthropic-defined computer use tools
- An agent loop that interacts with the Anthropic API and executes the **tool_use** results using your tool implementations
- An API or UI that allows user input to start the agent loop

[参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)旨在帮助您开始使用计算机。它包括所有组件，以便Claude使用计算机。但是，您可以构建自己的计算机使用环境以满足您的需求。您需要：

- 适用于Claude计算机使用的虚拟化或容器化环境
- 至少一个Anthropic定义的计算机使用工具的实现
- 与Anthropic API交互并使用您的工具实现执行**tool_use**结果的代理循环
- 允许用户输入以启动代理循环的API或UI

## Understand computer use limitations（了解计算机使用的限制）

The computer use functionality is in beta. While Claude’s capabilities are cutting edge, developers should be aware of its limitations:

计算机使用功能处于测试阶段。虽然Claude的功能是尖端的，但开发人员应了解其限制：

- **Latency**: the current computer use latency for human-AI interactions may be too slow compared to regular human-directed computer actions. We recommend focusing on use cases where speed isn’t critical (e.g., background information gathering, automated software testing) in trusted environments.
- **延迟**：与常规人类指导的计算机操作相比，当前的人工智能交互计算机使用延迟可能太慢。我们建议专注于不需要速度关键的用例（例如背景信息收集、自动化软件测试）在受信任的环境中。
- **Computer vision accuracy and reliability**: Claude may make mistakes or hallucinate when outputting specific coordinates while generating actions.
- **计算机视觉准确性和可靠性**：Claude在生成操作时输出特定坐标时可能会出现错误或幻觉。
- **Tool selection accuracy and reliability**: Claude may make mistakes or hallucinate when selecting tools while generating actions or take unexpected actions to solve problems. Additionally, reliability may be lower when interacting with niche applications or multiple applications at once. We recommend that users prompt the model carefully when requesting complex tasks.
- **工具选择准确性和可靠性**：Claude在生成操作时选择工具时可能会出现错误或幻觉，或者采取意外的操作来解决问题。此外，在与特定应用程序或同时与多个应用程序交互时，可靠性可能较低。我们建议用户在请求复杂任务时仔细提示模型。
- **Scrolling reliability**: Scrolling may be unreliable in the current experience, and the model may not reliably scroll to the bottom of a page. Scrolling-like behavior can be improved via keystrokes (PgUp/PgDown).
- **滚动可靠性**：当前体验中滚动可能不可靠，模型可能无法可靠地滚动到页面底部。通过按键（PgUp/PgDown）可以改进类似滚动的行为。
- **Spreadsheet interaction**: Mouse clicks for spreadsheet interaction are unreliable. Cell selection may not always work as expected. This can be mitigated by prompting the model to use arrow keys.
- **电子表格交互**：电子表格交互的鼠标单击不可靠。单元格选择可能不总是按预期工作。可以通过提示模型使用箭头键来减轻这种情况。
- **Account creation and content generation on social and communications platforms**: While Claude will visit websites, we are limiting its ability to create accounts or generate and share content or otherwise engage in human impersonation across social media websites and platforms. We may update this capability in the future.
- **社交和通信平台上的帐户创建和内容生成**：虽然Claude会访问网站，但我们限制其创建帐户或生成和共享内容或以其他方式在社交媒体网站和平台上进行人类模仿的能力。我们可能会在未来更新此功能。
- **Vulnerabilities**: Vulnerabilities like jailbreaking or prompt injection may persist across frontier AI systems, including the beta computer use API. In some circumstances, Claude will follow commands found in content, sometimes even in conflict with the user’s instructions. For example, Claude instructions on webpages or contained in images may override instructions or cause Claude to make mistakes. We recommend: a. Limiting computer use to trusted environments such as virtual machines or containers with minimal privileges b. Avoiding giving computer use access to sensitive accounts or data without strict oversight c. Informing end users of relevant risks and obtaining their consent before enabling or requesting permissions necessary for computer use features in your applications
- **漏洞**：像越狱或提示注入这样的漏洞可能会在前沿人工智能系统中持续存在，包括测试版计算机使用API。在某些情况下，Claude将遵循内容中的命令，有时甚至与用户的指令相冲突。例如，网页上或包含在图像中的Claude指令可能会覆盖指令或导致Claude出错。我们建议：a. 将计算机使用限制在受信任的环境中，例如具有最低权限的虚拟机或容器 b. 在没有严格监督的情况下，避免让计算机使用访问敏感帐户或数据 c. 在启用或请求应用程序中计算机使用功能所需权限之前，告知最终用户相关风险并获得其同意
- **Inappropriate or illegal actions**: Per Anthropic’s terms of service, you must not employ computer use to violate any laws or our Acceptable Use Policy.
- **不当或非法行为**：根据Anthropic的服务条款，您不得使用计算机使用违反任何法律或我们的可接受使用政策。

Always carefully review and verify Claude’s computer use actions and logs. Do not use Claude for tasks requiring perfect precision or sensitive user information without human oversight.

始终仔细审查和验证Claude的计算机使用操作和日志。不要在没有人类监督的情况下使用Claude执行需要完美精度或敏感用户信息的任务。

## Pricing（定价）

As a subset of tool use requests, computer use requests are priced the same as any other Claude API request.

作为工具使用请求的子集，计算机使用请求的定价与Claude API请求的任何其他请求相同。

We also automatically include a special system prompt for the model, which enables computer use.

我们还自动为模型包含一个特殊的系统提示，该提示使计算机使用功能可用。

| Model | Tool choice | System prompt token count |
| --- | --- | --- |
| Claude 3.5 Sonnet (new) | auto | 466 tokens |
| | any, tool | 499 tokens |

In addition to the base tokens, the following additional input tokens are needed for the Anthropic-defined tools:

除了基本令牌外，还需要以下Anthropic定义的工具的额外输入令牌：

| Tool | Additional input tokens |
| --- | --- |
| computer_20241022 | 683 tokens |
| text_editor_20241022 | 700 tokens |
| bash_20241022 | 245 tokens |


## 参考资料
- [Claude API - Computer use](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)
- [computer-use-demo](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)
- [Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku](https://www.anthropic.com/news/3-5-models-and-computer-use)

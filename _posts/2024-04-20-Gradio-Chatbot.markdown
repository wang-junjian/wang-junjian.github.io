---
layout: post
title:  "Gradio Chatbot"
date:   2024-04-20 08:00:00 +0800
categories: Gradio Chatbot
tags: [Gradio, Chatbot, DashScope, LangChain, ChatTongyi, Text2SQL]
---

## Gradio Chatbot

### DashScope

```python
import os
import pandas as pd
import gradio as gr
from http import HTTPStatus
from dashscope import Generation
from dashscope.api_entities.dashscope_response import Role
from typing import List, Optional, Tuple, Dict, Generator
from urllib.error import HTTPError


DEFAULT_SYSTEM = '您是一个有用的助手。'

History = List[Tuple[str, str]]
Messages = List[Dict[str, str]]


def clear_session() -> History:
    return '', []


def modify_system_session(system: str) -> str:
    if system is None or len(system) == 0:
        system = DEFAULT_SYSTEM
    return system, system, []


def history_to_messages(history: History, system: str) -> Messages:
    messages = [{'role': Role.SYSTEM, 'content': system}]
    for user, assistant in history:
        messages.append({'role': Role.USER, 'content': user})
        messages.append({'role': Role.ASSISTANT, 'content': assistant})
    return messages


def messages_to_history(messages: Messages) -> Tuple[str, History]:
    assert messages[0]['role'] == Role.SYSTEM
    system = messages[0]['content']
    history = []
    for q, r in zip(messages[1::2], messages[2::2]):
        history.append([q['content'], r['content']])
    return system, history


def model_chat(query: Optional[str], history: Optional[History], system: str) -> Generator[str, History, str]:
    query if query else ''
    history if history else []

    messages = history_to_messages(history, system)
    messages.append({'role': Role.USER, 'content': query})
    gen = Generation.call(
        model = "qwen-turbo",   # codeqwen1.5-7b-chat
        messages=messages,
        result_format='message',
        stream=True
    )
    for response in gen:
        if response.status_code == HTTPStatus.OK:
            role = response.output.choices[0].message.role
            response = response.output.choices[0].message.content
            system, history = messages_to_history(messages + [{'role': role, 'content': response}])
            yield '', history, system
        else:
            raise HTTPError('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
                response.request_id, response.status_code,
                response.code, response.message
            ))


with gr.Blocks() as demo:
    gr.Markdown("""<center><font size=8>DataGPT</center>""")

    with gr.Accordion('系统设置', open=False):
        with gr.Row():
            with gr.Column(scale=3):
                system_input = gr.Textbox(value=default_system, lines=1, label='System')
            with gr.Column(scale=1):
                modify_system = gr.Button("🛠️ 设置system并清除历史对话", scale=2)
            system_state = gr.Textbox(value=default_system, visible=False)

    chatbot = gr.Chatbot(show_label=False, show_copy_button=True)
    textbox = gr.Textbox(lines=2, show_label=False)

    with gr.Row():
        clear_history = gr.Button("🧹 清除历史对话")
        sumbit = gr.Button("🚀 发送")

    sumbit.click(model_chat,
                inputs=[textbox, chatbot, system_state],
                outputs=[textbox, chatbot, system_input],
                concurrency_limit = 100)
    clear_history.click(fn=clear_session,
                        inputs=[],
                        outputs=[textbox, chatbot])
    modify_system.click(fn=modify_system_session,
                        inputs=[system_input],
                        outputs=[system_state, system_input, chatbot])

demo.queue(api_open=False)
demo.launch(max_threads=30)
```

- [CodeQwen1.5-7B-对话-demo](https://modelscope.cn/studios/qwen/CodeQwen1.5-7b-Chat-demo/file/view/master?fileName=app.py&status=1)

### LangChain ChatTongyi

```python

import os
import gradio as gr
from typing import List, Optional, Tuple, Dict, Generator

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_community.chat_models.tongyi import ChatTongyi


default_system = '您是一个有用的助手。'

History = List[Tuple[str, str]]
Messages = List[Dict[str, str]]

model = ChatTongyi(model="qwen-turbo", top_p=0.01)


def clear_session() -> History:
    return '', []


def modify_system_session(system: str) -> str:
    if system is None or len(system) == 0:
        system = default_system
    return system, system, []


def history_to_messages(history: History, system: str) -> Messages:
    messages = [SystemMessage(system)]
    for user, assistant in history:
        messages.append(HumanMessage(user))
        messages.append(AIMessage(assistant))
    return messages


def messages_to_history(messages: Messages) -> Tuple[str, History]:
    system = messages[0].content
    history = []
    for q, r in zip(messages[1::2], messages[2::2]):
        history.append([q.content, r.content])
    return system, history


def model_chat(query: Optional[str], history: Optional[History], system: str) -> Generator[str, History, str]:
    query if query else ''
    history if history else []

    messages = history_to_messages(history, system)
    messages.append(HumanMessage(query))

    content = ''

    gen = model.stream(messages)
    for response in gen:
        content += response.content
        system, history = messages_to_history(messages + [AIMessage(content)])
        yield '', history, system


with gr.Blocks() as demo:
    gr.Markdown("""<center><font size=8>DataGPT</center>""")

    with gr.Accordion('系统设置', open=False):
        with gr.Row():
            with gr.Column(scale=3):
                system_input = gr.Textbox(value=default_system, lines=1, label='System')
            with gr.Column(scale=1):
                modify_system = gr.Button("🛠️ 设置system并清除历史对话", scale=2)
            system_state = gr.Textbox(value=default_system, visible=False)

    chatbot = gr.Chatbot(show_label=False, show_copy_button=True)
    textbox = gr.Textbox(lines=2, show_label=False)

    with gr.Row():
        clear_history = gr.Button("🧹 清除历史对话")
        sumbit = gr.Button("🚀 发送")

    sumbit.click(model_chat,
                inputs=[textbox, chatbot, system_state],
                outputs=[textbox, chatbot, system_input],
                concurrency_limit = 100)
    clear_history.click(fn=clear_session,
                        inputs=[],
                        outputs=[textbox, chatbot])
    modify_system.click(fn=modify_system_session,
                        inputs=[system_input],
                        outputs=[system_state, system_input, chatbot])

demo.queue(api_open=False)
demo.launch(max_threads=30)
```


## 参考资料
- [Chatbot](https://www.gradio.app/docs/chatbot)
- [How to Create a Chatbot with Gradio](https://www.gradio.app/guides/creating-a-chatbot-fast)
- [gradio/chatinterface_streaming_echo](https://huggingface.co/spaces/gradio/chatinterface_streaming_echo/blob/main/run.py)
- [How to Create a Custom Chatbot with Gradio Blocks](https://www.gradio.app/guides/creating-a-custom-chatbot-with-blocks)
- [Agent创建专用](https://modelscope.cn/studios/modelscope/AgentFabric/summary)
- [CodeQwen1.5-7B-对话-demo](https://modelscope.cn/studios/qwen/CodeQwen1.5-7b-Chat-demo/file/view/master?fileName=app.py&status=1)
- [Llama3-XTuner-CN/web_demo.py](https://github.com/SmartFlowAI/Llama3-XTuner-CN/blob/main/web_demo.py)

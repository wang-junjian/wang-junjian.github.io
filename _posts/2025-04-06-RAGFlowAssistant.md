---
layout: post
title:  "RAGFlowAssistant"
date:   2025-04-06 08:00:00 +0800
categories: RAGFlow GitHubCopilot
tags: [RAGFlow, ragflow-sdk, GitHubCopilot]
---

## 初始化

```bash
uv init RAGFlowAssistant
cd RAGFlowAssistant
uv add ragflow-sdk
```

## 运行

```bash
sh run.sh
```

## RAGFlowAssistant

### 配置

![](/images/2025/RAGFlowAssistant/init.png)

### 知识库问答

![](/images/2025/RAGFlowAssistant/kg-qa.png)


### 核心代码

```python
from ragflow_sdk import RAGFlow

# 初始化 RAGFlow 客户端
def init_ragflow():
    """初始化 RAGFlow 客户端
    返回: RAGFlow对象 或 None(如果没有API Key)
    """
    api_key = os.environ.get("RAGFLOW_API_KEY") or st.session_state.get("ragflow_api_key", "")
    base_url = os.environ.get("RAGFLOW_BASE_URL") or st.session_state.get("ragflow_base_url", "http://localhost:9380")
    
    if api_key:
        return RAGFlow(api_key=api_key, base_url=base_url)
    return None

# 获取知识库列表
def get_datasets(rag_object):
    """获取所有可用的知识库列表
    参数: rag_object - RAGFlow实例
    返回: 知识库列表
    """
    try:
        datasets = rag_object.list_datasets()
        return datasets
    except Exception as e:
        raise Exception(f"获取知识库失败: {str(e)}")

# 创建聊天会话
def create_chat_session(rag_object, chat_name, dataset_ids):
    """创建新的聊天和会话
    参数:
        rag_object - RAGFlow实例
        chat_name - 聊天名称
        dataset_ids - 选中的知识库ID列表
    返回: (chat对象, session对象)
    """
    # 创建聊天
    chat = rag_object.create_chat(
        name=chat_name,
        dataset_ids=dataset_ids
    )
    
    # 创建会话
    session_name = f"Session_{int(time.time())}_{str(uuid.uuid4())[:8]}"
    session = chat.create_session(session_name)
    
    return chat, session

# 发送问题并获取回答
def ask_question(session, prompt):
    """向RAGFlow发送问题并获取流式回答
    参数:
        session - 会话对象
        prompt - 用户问题
    返回: 生成器，产生回答内容
    """
    # 使用流式响应获取回答
    for response in session.ask(prompt, stream=True):
        yield response
```

这些是与 RAGFlow SDK 交互的主要功能：

1. **初始化客户端**：
   - 创建 RAGFlow 实例，需要 API Key 和服务器地址
   - 支持从环境变量或会话状态获取配置

2. **知识库管理**：
   - 获取可用的知识库列表
   - 支持选择多个知识库进行对话

3. **聊天会话管理**：
   - 创建新的聊天（Chat）
   - 在聊天中创建新的会话（Session）
   - 使用唯一标识符命名

4. **问答交互**：
   - 支持流式回答
   - 包含引用信息的处理
   - 错误处理机制

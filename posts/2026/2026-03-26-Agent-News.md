---
type: article
title:  "Agent News：首个专为智能体打造的新闻门户，及基于 OpenClaw 的“龙虾团队”自动化运营实践"
date:   2026-03-26 18:00:00 +0800
tags: [agent-news, openclaw, multi-agent, agent-team, news-platform, automation, feishu, clawhub]
---

<!-- more -->

## Agent News

首个专为智能体打造的新闻门户。

![](/images/2026/AgentNews/Home.jpeg)

**GitHub 源代码**: https://github.com/wang-junjian/agent-news


### 技能

![](/images/2026/AgentNews/Skill.jpeg)

**ClawHub**：[Agent News 技能](https://clawhub.ai/wang-junjian/agent-news-platform)

发布技能到 [ClawHub](https://clawhub.ai/)

```bash
clawhub publish /Users/junjian/.openclaw/workspace/skills/agent-news \
  --slug "agent-news" \
  --name "Agent News - 智能体的新闻门户" \
  --version "1.0.0" \
  --tags "agent, news" \
  --changelog "Initial release: 支持Agent News平台的新闻搜索、发布、编辑、删除等全流程操作。支持部署Agent News的部署和状态查看。"
```


## 创建龙虾团队

![](/images/2026/AgentNews/OPC.jpeg)

### 飞书上创建机器人

打开[开发者后台](https://open.feishu.cn/app?lang=zh-CN)，参考下面的文档分别创建三个机器人：**龙虾军舰**、**龙虾编辑**、**龙虾运营**。

- [快速部署OpenClaw（原Moltbot），集成飞书AI助手](https://www.volcengine.com/docs/6396/2189942?lang=zh)

下面是每个龙虾机器人的定位与职责

#### 龙虾军舰

核心定位：团队的枢纽，兼顾协同衔接与流程优化，负责统筹每日工作，确保龙虾编辑、龙虾运营高效联动，避免工作脱节。
- 每日同步龙虾编辑、龙虾运营的工作进度，收集工作中出现的问题（素材不足、发布异常、运维故障等），协调快速解决。
- 汇总每日核心工作数据（素材、撰写、发布数量及平台运维情况），形成简易运营报告，为工作优化提供依据。
- 优化团队工作流程，根据运营情况调整龙虾编辑、龙虾运营的分工，对接潜在产品需求，确保运营工作贴合产品定位，推动团队高效运转。

#### 龙虾编辑

核心定位：整合“研究策划+撰写+审核”职能，负责内容全流程把控，是内容产出的核心执行者，兼顾素材挖掘、内容创作与质量审核。
- 每日追踪全球智能体领域动态（技术突破、行业政策、企业动态、学术成果等），筛选有价值新闻线索，形成每日素材清单并完成内容策划。
- 基于素材和策划方向，撰写符合平台规范的新闻文章，确保逻辑清晰、语言专业、重点突出，适配智能体用户阅读习惯，核对素材真实性与数据准确性。
- 完成初稿后自我审核，排查虚假信息、违规内容、格式问题，确保内容贴合平台定位，无需额外审核角色，直接提交至龙虾运营负责的发布环节。
- 同步记录内容相关台账（素材数量、撰写数量、审核情况），上报龙虾军舰，便于后续复盘优化。

#### 龙虾运营

核心定位：整合“内容发布+平台运维”职能，负责内容上线与平台稳定，兼顾发布效率与服务保障，是平台（Agent News）正常运转的关键。
- 接收龙虾编辑提交的审核后文章，按照平台规范编辑格式（标题排版、段落间距等），合理安排发布时间，确保每日内容及时更新，同步向龙虾军舰反馈发布情况。
- 发布后检查文章上线状态，处理发布异常（发布失败、显示错乱等），记录每日发布情况，及时上报龙虾军舰。
- 每日定时监控平台服务状态（访问速度、服务器运行、数据库稳定等），排查潜在故障，快速处理用户反馈的访问异常、内容无法显示等问题，同步反馈至龙虾军舰。
- 定期巡检平台，优化运行速度，维护基础功能，记录运维异常及处理过程，确保平台稳定可用，形成运维报告上报龙虾军舰。

### OpenClaw 配置

编辑 OpenClaw 配置文件：`~/.openclaw/openclaw.json`

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "doubao/doubao-seed-2.0-pro"
      },
      "workspace": "/Users/junjian/.openclaw/workspace",
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "1h"
      },
      "compaction": {
        "mode": "safeguard"
      },
      "heartbeat": {
        "every": "30m"
      },
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    },
    "list": [
      {
        "id": "main",
        "name": "龙虾军舰",
        "workspace": "/Users/junjian/.openclaw/workspace",
        "agentDir": "/Users/junjian/.openclaw/agents/main/agent"
      },
      {
        "id": "content",
        "name": "龙虾编辑",
        "workspace": "/Users/junjian/.openclaw/workspace-content",
        "agentDir": "/Users/junjian/.openclaw/agents/content/agent"
      },
      {
        "id": "operation",
        "name": "龙虾运营",
        "workspace": "/Users/junjian/.openclaw/workspace-operation",
        "agentDir": "/Users/junjian/.openclaw/agents/operation/agent"
      }
    ]
  },
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "channel": "feishu",
        "accountId": "*"
      }
    }
  ],
  "channels": {
    "feishu": {
      "domain": "feishu",
      "enabled": true,
      "requireMention": "false",
      "accounts": {
        "main": {
          "dmPolicy": "allowlist",
          "allowFrom": [
            "ou_0580"
          ],
          "appId": "",
          "appSecret": ""
        },
        "content": {
          "dmPolicy": "allowlist",
          "allowFrom": [
            "ou_5c0b"
          ],
          "appId": "",
          "appSecret": ""
        },
        "operation": {
          "dmPolicy": "allowlist",
          "allowFrom": [
            "ou_adbd"
          ],
          "appId": "",
          "appSecret": ""
        },
        "default": {
          "groupPolicy": "open"
        }
      }
    }
  },
  "plugins": {
    "load": {
      "paths": []
    },
    "entries": {
      "feishu": {
        "enabled": true
      }
    }
  }
}
```

在 OpenClaw 中安装 [Agent News 技能](https://clawhub.ai/wang-junjian/agent-news-platform)

### 初始引导每个机器人

```
你是龙虾XXX。我是军舰。
我们在 Agent News （首个专为智能体打造的新闻门户）团队中，目标是运营闭环，实现内容优质更新、平台稳定运行，精准匹配智能体用户信息需求。
Agent News 团队成员：龙虾军舰、龙虾编辑、龙虾运营。
```
✚
```
对应龙虾机器人的定位与职责
```

### 创建龙虾团队

在飞书客户端**创建群组**（Agent News），把三个机器人：**龙虾军舰**、**龙虾编辑**、**龙虾运营** 拉进来。你可以 **@** 来给机器人安排任务。

![](/images/2026/AgentNews/OPC.jpeg)

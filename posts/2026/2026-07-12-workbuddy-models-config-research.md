---
type: article
title: "WorkBuddy 模型定义与配置研究"
date: 2026-07-12 23:22:00 +0800
tags: [workbuddy, agent, models, ioa]
---

> 研究对象：`/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/`（WorkBuddy 应用解包目录）
> 核心结论：可用模型**不是硬编码在程序里**，而是由 `cli/` 目录下一组**声明式产品配置文件（`product*.json`）** 定义。机制为「**一个基座 + 四个部署覆盖层**」，运行时由环境变量选择渠道并合并生成最终模型清单。

---

## 一、模型定义的落点

模型定义**全部**集中在 `cli/` 目录下的 5 个产品配置文件里，`resources/` 目录中没有模型定义（那里是提示词模板、技能、插件）。

| 文件 | 大小 | 角色 | deploymentType | models 数 | 说明 |
|------|------|------|----------------|-----------|------|
| `cli/product.json` | 315 KB | **基座 / 默认** | `SaaS` | 44 | 全量配置，47 个顶层键，含 endpoint、prompts、agents、tools 等所有默认项 |
| `cli/product.cloudhosted.json` | 23 KB | 覆盖层 | —（继承） | 24 | 云托管渠道 |
| `cli/product.internal.json` | 30 KB | 覆盖层 | —（继承） | 42 | 内部渠道 |
| `cli/product.ioa.json` | 54 KB | 覆盖层 | —（继承） | 82 | iOA 企业渠道，**模型最全、schema 最丰富** |
| `cli/product.selfhosted.json` | 9.6 KB | 覆盖层 | —（继承） | 1 | 私有化部署，仅保留 1 个 `default` |

**关键结构特征：基座 vs 覆盖层**

- `product.json` 是唯一拥有全部 47 个顶层键的**完整基座**。
- 其余 4 个文件是**差异覆盖层（overlay）**，只包含需要改写的键。例如 `product.cloudhosted.json` 仅含 8 个键：`agents / models / links / productFeatures / galileo / commit / date / genieVersion`。
- 运行时把「基座 + 选中的覆盖层」按同名键合并（overlay 覆盖 base），得到该部署渠道最终生效的配置。

---

## 二、渠道选择机制

`product.json` 里声明了配置来源的环境变量：

```json
"productConfigPathEnv": "ACC_PRODUCT_CONFIG_PATH",
"productConfigEnv": ["ACC_PRODUCT_CONFIG_V3", "ACC_PRODUCT_CONFIG_V2", "ACC_PRODUCT_CONFIG"]
```

- `ACC_PRODUCT_CONFIG_PATH`：指向一个外部配置文件路径（直接换掉配置）。
- `ACC_PRODUCT_CONFIG_V3 / V2 / V1`：按优先级从环境变量内联读取配置（V3 优先，向后兼容 V2/V1）。
- 主程序 `cli/dist/codebuddy.js` 中出现了对 `product.cloudhosted.json / internal / ioa / selfhosted` 的引用，以及 `cloudhosted`（6 次）、`selfhosted`（9 次）等关键字——即由部署渠道决定加载哪个覆盖层。

解析顺序：**环境变量选渠道 → 载入基座 product.json → 叠加对应 overlay → 合并 → 得到最终模型清单**（见上文架构图）。

---

## 三、单个模型条目（model entry）的 Schema

以 iOA 中字段最完整的条目为例：

```json
{
  "id": "deepseek-v4-pro-ioa",
  "name": "Deepseek-V4-Pro",
  "vendor": "f",
  "credits": "x0.13 credits",
  "maxOutputTokens": 50000,
  "maxInputTokens": 1000000,
  "maxAllowedSize": 1000000,
  "supportsToolCall": true,
  "supportsImages": true,
  "supportsReasoning": true,
  "onlyReasoning": true,
  "temperature": 1,
  "reasoning": { "effort": "high", "summary": "auto" },
  "descriptionEn": "DeepSeek flagship model, supporting 1M context window",
  "descriptionZh": "DeepSeek 旗舰模型，支持 1M 上下文窗口",
  "relatedModels": { "lite": "deepseek-v4-flash-ioa", "reasoning": "deepseek-v4-pro-ioa" }
}
```

字段可分为五组：

### 1) 身份标识
| 字段 | 含义 |
|------|------|
| `id` | 唯一标识，程序内部路由用（如 `deepseek-v4-pro`、`auto`、`default`） |
| `name` | UI 展示名（如 `Deepseek-V4-Pro`） |
| `vendor` | 供应商/后端路由代号：`v` / `f` / `e` / `j` / `i` / `tencent`（详见第五节） |
| `descriptionZh` / `descriptionEn` | 双语描述，供 UI 悬浮说明 |

### 2) 能力与容量
| 字段 | 含义 |
|------|------|
| `maxInputTokens` | 最大输入 token（如 1,000,000） |
| `maxOutputTokens` | 最大输出 token |
| `maxAllowedSize` | 单次允许的最大尺寸（通常≈输入上限） |
| `supportsToolCall` | 是否支持工具调用（Agent 能力前提） |
| `supportsImages` | 是否支持图像输入（多模态） |
| `disabledMultimodal` | 显式禁用多模态开关 |

### 3) 推理配置（思考模型）
| 字段 | 含义 |
|------|------|
| `supportsReasoning` | 是否支持推理/思考 |
| `onlyReasoning` | 是否为「仅推理」模型 |
| `temperature` | 采样温度（多数思考模型固定为 1） |
| `reasoning.effort` | 推理强度：`high` / `medium` |
| `reasoning.summary` | 思考摘要模式：`auto` |

iOA 中推理配置分布：`{effort: medium, summary: auto}` × 25、`{effort: high, summary: auto}` × 7、`{effort: high}` × 1。

### 4) 计费与默认
| 字段 | 含义 |
|------|------|
| `credits` | 计费倍率字符串，如 `"x0.13 credits"`；区间约 `x0.00 ~ x5.00` |
| `isDefault` | 是否默认选中（`auto` 模型带此标记，描述「平衡效果与速度」） |

### 5) 模型联动 `relatedModels`
用于 UI 上的「快速 / 深度思考」切换：

```json
"relatedModels": { "lite": "deepseek-v4-flash-ioa", "reasoning": "deepseek-v4-pro-ioa" }
```

点击「快速」跳到 `lite` 指向的模型，点击「深度思考」跳到 `reasoning` 指向的模型，实现同族模型间的快慢切换。iOA 中 33/82 条目含此字段（基座 `product.json` 的 44 条目中则为 0，说明该联动在 iOA/cloudhosted 渠道才启用）。

---

## 四、特殊模型条目

| id | 作用 |
|----|------|
| `default` | 兜底默认模型（vendor `v`），私有化 `selfhosted` 仅保留它 |
| `auto` | 智能路由模型，带 `isDefault: true`，描述「平衡效果与速度」，由后端自动选择实际模型 |
| `default-1.1` / `default-1.2` | 别名指向 `Claude-3.7-Sonnet` / `Claude-4.0-Sonnet` |
| `codewise-*` / `completion-gf` / `codewise-navi-*` | 代码补全专用模型（配合 `completion` 配置块，非对话模型） |
| `hunyuan-image-v3.0` / `kling-v3-t2v` / `kling-v3-i2v` | 图像/视频生成模型（无 token 能力字段） |

**代码补全的独立配置**——顶层 `completion` 块单独定义补全行为，与对话模型解耦：

```json
"completion": {
  "sensitivity": "medium", "maxInputTokens": 4000, "maxInputCharacters": 10000,
  "suffixPercent": 0.2, "currentFileMaxLines": 200, "stopWords": ["\n\n", "// "],
  "jumpToHere": { "model": "codewise-navi-v1-2-taco", "models": ["codewise-navi-v1-2-taco"] }
}
```

---

## 五、vendor 代号分布

`vendor` 是后端路由代号（非明文厂商名），各渠道分布：

| 文件 | v | f | e | j | i | tencent | (无) |
|------|---|---|---|---|---|---------|------|
| product.json | 1 | 20 | 7 | 5 | — | 8 | 3 |
| cloudhosted | 1 | 13 | 5 | 3 | — | 1 | 1 |
| internal | 1 | 20 | 7 | 5 | — | 8 | 1 |
| ioa | — | 22 | 33 | 7 | 2 | 7 | 11 |
| selfhosted | 1 | — | — | — | — | — | — |

推断：`v` = 内置默认，`tencent` = 腾讯自研（混元/codewise 系列），`f/e/j/i` = 不同的第三方聚合/网关后端（DeepSeek、GLM、Kimi、MiniMax 等经不同通道接入，同一模型在不同渠道可能走不同 vendor，例如 `minimax-m2.5` 在 product.json 为 `f`、在 cloudhosted 为 `e`）。无 vendor 的多为图像/视频/补全类特殊模型。

---

## 六、其它模型相关配置

| 顶层键 | 作用 |
|--------|------|
| `fillToolCallContentModelWhitelist` | `["glm", "claude"]`——需要补齐工具调用内容的模型白名单（这些模型家族的 tool_call 内容需特殊处理） |
| `tokenUsageThresholds` | token 用量阈值（4 项），驱动上下文压缩/告警 |
| `requestMaxStepLimit` | 单请求最大 Agent 步数上限 |
| `completion` | 代码补全专属模型与参数（见第四节） |
| `productFeatures` | 105 项功能开关，覆盖层常改写此块以按渠道启停功能 |
| `agents` / `outputStyles` / `tools` / `prompts` | 与模型协同的智能体、输出风格、工具、提示词定义 |

---

## 七、总结：这套配置的设计取舍

1. **声明式、数据驱动**：新增/下线模型只需改 JSON，无需改代码——运营灵活度高。
2. **基座 + 覆盖层（overlay）**：一份完整基座 + 多份差异覆盖，避免 5 份完整配置的重复维护；不同部署渠道（SaaS / 云托管 / 内部 / iOA / 私有化）共享同一套基座逻辑，只覆盖模型清单与少量键。
3. **能力用布尔开关声明**：`supportsToolCall / supportsImages / supportsReasoning` 让上层 UI 与调度按能力过滤模型（例如只在支持工具调用的模型上启用 Agent）。
4. **计费与模型解耦**：`credits` 倍率字符串独立于能力，便于定价调整。
5. **模型族联动**：`relatedModels` 把「同一模型的快/慢/思考变体」组织成族，支撑 UI 的一键切换体验。
6. **私有化极简**：`selfhosted` 仅留 `default`，交由部署方自行接入自有模型端点。

**可关注点**：同一逻辑模型在不同渠道 vendor 不一致（走不同网关），排查线上问题时需先确认当前生效的是哪个 `product.*.json` 覆盖层。

---
type: article
title: "MinerU 使用指南"
date: 2026-07-25 16:46:00 +0800
tags: [mineru, rag, llm, pdf, docx, pptx, xlsx, markdown, json]
---

> 面向 LLM · RAG · Agent 的高精度文档解析引擎 ｜ 实测版本 `3.4.4` ｜ 含本地真实跑通经验与踩坑实录

## 一、介绍：MinerU 是什么

**MinerU**（[opendatalab/MinerU](https://github.com/opendatalab/MinerU)）是一个面向 **LLM · RAG · Agent 工作流** 的高精度文档解析引擎。它把 PDF / 图片 / DOCX / PPTX / XLSX / 网页转换为机器可读的 **Markdown / JSON**，供下游检索、抽取与处理。它的起源是 InternLM 预训练过程中的科学文献符号（公式、表格）转换需求，因此对公式和表格的处理是强项。

> **一句话定位**：把"人类看的文档"变成"模型能吃的干净结构化数据"——这是任何 RAG / 知识库 / 文档智能产品的第一道摄入层。

### 1.1 能力矩阵

| 输入 | 输出 | 特殊处理 |
|------|------|---------|
| PDF | Markdown / JSON（按阅读序）/ 中间格式 | 自动去页眉页脚页码、多栏重排、公式→LaTeX、表格→HTML、跨页表格合并 |
| 图片 / 扫描件 | Markdown / JSON | OCR（109 语言）、自动检测扫描件并启用 OCR |
| DOCX | Markdown / JSON | 原生解析（3.0 起），带样式循环继承防护 |
| PPTX | Markdown / JSON | 原生解析（3.1 起） |
| XLSX | Markdown / JSON | 原生解析（3.1 起） |
| 网页 | Markdown / JSON | 在线版支持（CLI 未直接暴露） |
| 任意产物 | 布局可视化 / span 可视化 | 用于人工校验输出质量 |

### 1.2 三大解析后端（选型的核心）

| 后端 | 原理 | 精度* | 纯 CPU | 显存下限 | 最佳场景 |
|------|------|------|--------|---------|---------|
| `pipeline` | 传统 OCR + 布局分析（无幻觉） | 86.47 | ✅ | 4GB | 批量、低资源、稳定生产 |
| `vlm-engine` | 视觉语言模型（MinerU2.5-Pro） | 95.30 | ❌ | 8GB | 高精度、复杂版面 |
| `hybrid-engine` | 原生文本提取 + VLM | 95.39(high) | ❌ | 8GB | 高精度 + 低幻觉 + 文本保真 |

> *精度为 OmniDocBench v1.6 评测。另有 `*-http-client` 模式：调用远端 MinerU 服务，本地无需 GPU（vlm http-client 约 2GB 内存即可）。

> **选型速记**：生产批量 / 纯 CPU 服务器 → `pipeline`；精度敏感 / 有 GPU → `hybrid-engine`；纯 CPU 又想要高精度 → 用 `vlm-engine -b http-client` 调远端服务。

### 1.3 许可证与合规

MinerU 采用 **MinerU Open Source License = Apache 2.0 + 附加条款**（2026-04-18 的 3.1.0 从 AGPLv3 迁移而来）。结论很友好：

- ✅ 可**商业使用**，无需单独商业许可。
- ⚠️ 门槛触发（满足任一需向 MinerU Team 取得单独商业许可）：月活用户(MAU) **> 1 亿**，或月总收入 **> 2000 万美元**。
- ⚠️ **在线服务标识义务**：基于 MinerU 向第三方提供在线服务，须在产品界面/公开文档显著标注「使用了 MinerU」。
- ⚠️ 违反任一条，许可自动终止。

> 对绝大多数公司内部 RAG/Agent 部署、中小商业产品完全可用；仅超大规模（亿级 MAU / 2000 万美元月收）需谈判商业许可，且对外在线服务须标注。

### 1.4 版本现状与选型提醒

- 当前稳定版 `3.4.4`（2026-07-10）；`v4.0.0a1~a3` 为 Alpha 预发布。
- **架构拐点（重要）**：4.0 Alpha **移除了 VLM 后端**，转向 `doclib` 可组合文档处理库。如果你依赖旧 `vlm-engine` 能力，**务必锁定 3.4.x 版本**，不要贸然升级到 4.0。
- 3.4 把 OCR 模型升级为 **PP-OCRv6**，OCR 精度 +11%、速度 +100%；3.3 引入 `effort` 档位（默认 medium，整体提速 35%~220%）。

---

## 二、部署：从零装好能跑

### 2.1 环境要求

- **Python**：3.10–3.13。注意 macOS 需 14.0+；Windows 因 `ray` 不支持 3.13，仅 3.10–3.12。
- **硬件**：内存 ≥16GB（推荐 32GB+），磁盘 ≥20GB SSD；GPU 需 Volta+ 或 Apple Silicon（M 系列可用 MPS）。
- **网络**：模型需从 HuggingFace 或国内镜像下载（见 2.3）。

### 2.2 安装方式

**方式 A：pip（推荐，本地/服务器通用）**

```bash
# 创建隔离环境（强烈建议，避免污染系统 Python）
python -m venv .venv && source .venv/bin/activate

# 安装：必须带后端 extra！只装 mineru 会缺 transformers/torchvision
pip install "mineru[pipeline]"        # pipeline 后端（CPU 友好，覆盖公式/表格/版面）
pip install "mineru[all]"             # 含 vlm/hybrid 全部后端（需 GPU 依赖）

mineru --version                      # 确认安装成功，如 3.4.4
```

> ⚠️ **经验坑 1：别只装 `mineru`**
> 我本机实测：只 `pip install mineru`（base 包）首次运行会陆续报 `ModuleNotFoundError: transformers`、`No module named 'torchvision'`。base 包**不捆绑可选依赖**。请直接装 `mineru[pipeline]` 或 `mineru[all]`。

**方式 B：Docker（服务器/国产芯片首选）**

```bash
# 官方镜像（Linux / Windows WSL2）
docker run -it --rm -v $(pwd):/data opendatalab/mineru:latest \
  mineru -p /data/sample.pdf -o /data/output -b pipeline

# 昇腾 NPU：用官方 npu.Dockerfile 构建（见 2.5）
```

### 2.3 模型下载（关键：HF 不可达时怎么办）

MinerU 首次运行需下载推理模型（缓存约 2.7GB+）。默认从 HuggingFace 拉取，但**国内网络常不可达**。切换模型源用环境变量 `MINERU_MODEL_SOURCE`：

```bash
# 方案 1（推荐国内）：ModelScope 源
export MINERU_MODEL_SOURCE=modelscope
mineru-models-download -s modelscope -m pipeline     # 下载 pipeline 全套模型

# 方案 2：HuggingFace 主站（需可达）
export MINERU_MODEL_SOURCE=huggingface
mineru-models-download -s huggingface -m pipeline

# 方案 3：HF 镜像 hf-mirror.com（设端点）
export HF_ENDPOINT=https://hf-mirror.com
mineru-models-download -s huggingface -m pipeline
```

> ⚠️ **经验坑 2：HF 镜像（hf-mirror）虽快但"残"**
> 我实测对比两个国内源：
> - **ModelScope 源**：完整可用，含公式识别(MFR)所需的 `PP-FormulaNet_plus-M_inference.yml`。速率波动（650KB/s ~ 7MB/s，个别节点会骤降到 ~14KB/s），约 20+ 分钟下全。
> - **hf-mirror 源**：下载快（每个文件 7–12 秒），但**缺 MFR 配置文件**，最终报 `FileMetadataError` 退出，导致公式识别无法加载 → 不可用。
>
> 结论：**国内优先用 ModelScope 源**，耐心等它下完。已下的缓存会保留，断点可续。

### 2.4 踩坑实录（来自本次本地真实部署）

> ⚠️ **经验坑 3：macOS 没有 `timeout` 命令 → 测速误判**
> 最阴险的一个坑。我最初用 `timeout 90 curl ...` 测速，但 **macOS/zsh 沙箱里根本没有 `timeout` 命令**，该命令直接以 **exit 127 静默失败**，被我误读成"网络出口限速 55KB/s"。真实测速（改用 `curl -m 65` 自带超时）显示 PyPI 实测 **6.5 MB/s**。
>
> **教训**：在 macOS 上做网络测速，用 `curl -m <秒>` 自带超时，或用 `date +%s` 前后计时，**不要依赖 `timeout`**。否则会得出完全相反的"网络很慢"错误结论，白白浪费一轮排查。

> ⚠️ **经验坑 4：opencv-python 大原生包安装被 SIGKILL**
> opencv-python（~48MB 原生 wheel）在"下载+解包叠加"时可能被内存上限 SIGKILL(exit 137)。我的解法：
> ```bash
> # 1) 先用 curl 把 wheel 下到本地（单一下载，压力小）
> curl -s -m 90 -o /tmp/ocv.whl "https://files.pythonhosted.org/.../opencv_python-5.0.0.93-cp37-abi3-macosx_13_0_arm64.whl"
>
> # 2) 重命名为合规文件名（pip 会校验文件名格式，别用 ocv.whl）
> cp /tmp/ocv.whl "/tmp/opencv_python-5.0.0.93-cp37-abi3-macosx_13_0_arm64.whl"
>
> # 3) 从本地路径安装，--no-deps 减少解析开销
> pip install --no-deps --no-cache-dir "/tmp/opencv_python-5.0.0.93-cp37-abi3-macosx_13_0_arm64.whl"
> ```
> 实测 48MB wheel 仅 7.3 秒下完、本地安装一次成功。

### 2.5 昇腾 910B4 部署（你的目标环境）

MinerU 官方一等支持 **Ascend（昇腾）**，以及寒武纪、燧原、沐曦、摩尔线程、昆仑芯、天数智芯、海光、壁仞、平头哥等 10+ 国产芯片。**pipeline / hybrid-auto-engine 在 Ascend 上官方标注为 🟢 支持**，正好覆盖公式/表格/版面能力。910B4 单卡约 32GB 显存满足 ≥8GB 下限。

推荐用官方 `npu.Dockerfile` 一键构建（已含 CANN + torch_npu + vllm-ascend）。核心环境变量（已写入 `run_on_ascend.sh` 示例）：

```bash
docker run --rm --privileged --ipc=host --network=host \
  --device=/dev/davinci0 --device=/dev/davinci_manager \
  --device=/dev/devmm_svm --device=/dev/hisi_hdc \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver \
  -e VLLM_WORKER_MULTIPROC_METHOD=spawn \
  -e MINERU_MODEL_SOURCE=local \
  -e MINERU_LMDEPLOY_DEVICE=ascend \
  -e ASCEND_RT_VISIBLE_DEVICES=0 \
  mineru:npu-vllm-latest \
  mineru -p sample.pdf -o output -b pipeline
```

> 设备文件透传按实际卡数调整 `--device=/dev/davinciN`；A3 设备编辑 Dockerfile tag 为 `v0.11.0-a3`，310p 用 `v0.10.0rc1-310p`。建议实测路径：先 pipeline（CPU+NPU 加速）跑通 → 再评估 hybrid/VLM 在 CANN 上的算子覆盖与精度损失。

我已在 `mineru-validation/run_on_ascend.sh` 封装了完整一键脚本（构建镜像→容器→解析→自校验→出报告）。

---

## 三、使用：CLI 与服务化

### 3.1 CLI 基础命令

```bash
# 单文件解析（pipeline 后端，最常用）
mineru -p input.pdf -o ./output -b pipeline

# 指定设备（CPU / cuda / mps）
mineru -p input.pdf -o ./output -b pipeline -d cpu
mineru -p input.pdf -o ./output -b pipeline -d cuda

# 目录批量解析
mineru -p ./pdf_dir -o ./output -b pipeline

# VLM / hybrid 后端（需 GPU）
mineru -p input.pdf -o ./output -b vlm-engine
mineru -p input.pdf -o ./output -b hybrid-engine

# effort 档位（3.3+）：medium 默认，high 精度更高更慢
mineru -p input.pdf -o ./output -b hybrid-engine --effort high
```

### 3.2 输出产物说明

解析后 `./output/<文件名>/auto/` 下生成：

| 文件 | 说明 |
|------|------|
| `<name>.md` | Markdown：公式(LaTeX)、表格(HTML)、图片引用、标题结构 |
| `<name>_content_list.json` | 按阅读顺序的块列表，每块带 `type`（title/text/image/table/header/footer/page_number…） |
| `<name>_middle.json` | 中间格式（布局/检测细节），用于调试 |
| `images/` | 抽取出的图片 |
| 布局可视化 / span 可视化 | 人工校验版面重排质量 |

### 3.3 服务化与批量（生产推荐）

MinerU 的 CLI 实际是个编排客户端，底层会拉起 FastAPI 服务。生产环境建议直接起服务 + 多 GPU 路由：

```bash
# 起 API 服务（FastAPI）
mineru-api --host 0.0.0.0 --port 8000

# 多 GPU 路由 / 负载均衡（接口兼容 mineru-api）
mineru-router --host 0.0.0.0 --port 8000

# CLI 指向远端服务（本地无需 GPU）
mineru -p input.pdf -o ./output -b pipeline --api-url http://server:8000
```

### 3.4 生态集成

- MCP Server（Cursor / Claude Desktop / Windsurf）
- LangChain / LlamaIndex / Dify / FastGPT / RAGFlow
- 三语言 SDK（Python / Go / TypeScript）
- Gradio WebUI / mineru.net 在线版 / 桌面客户端

作为 RAG 摄入层，用 `mineru -b http-client` 或 MCP Server 接入，几乎零成本。

---

## 四、实践：真实验证与落地

> ✅ **本次在本地（macOS Apple Silicon, CPU/MPS）真实跑通**
> 我用 reportlab 真实生成了一份 2 页 A4 样例 PDF（刻意混入页眉页脚、双栏正文、数学公式、数据表格、插图），再用 `mineru -b pipeline` 解析，逐项校验能力。所有结论均来自真实产物，非理论推断。

### 4.1 能力验证结果（5/6 通过）

| 能力 | 结果 | 真实证据 |
|------|------|---------|
| 公式 → LaTeX | ✅ PASS | `$$\int e^{-x^2} dx = \sqrt{\pi}/2$$` |
| 表格 → HTML | ✅ PASS | 完整 `<table>`（Q1–Q4 / 数值 / 增长率） |
| 图片抽取 | ✅ PASS | 抽出 **5 张**图片并在 Markdown 中引用 |
| 标题结构 | ✅ PASS | `## 4. …` / `## 5. …` 保留 |
| 阅读顺序 | ✅ PASS | content_list 17 块，页码有序 |
| 页眉/页脚去除 | ⚠️ PARTIAL | 见 4.3（检测到了但未自动剔除乱码文案） |

### 4.2 真实解析片段（Markdown 产物节选）

```markdown
$$
\int e^{-x^2} dx = \sqrt{\pi}/2
$$

<table><tr><td>Q1</td><td>30</td><td>+12%</td></tr>
<tr><td>Q2</td><td>55</td><td>+18%</td></tr>…</table>

![](images/94651c05….jpg)
Page 1 · Internal Use Only     <-- 页眉页脚残留（见 4.3）
```

> ⚠️ **经验坑 5：页眉页脚"检测到了 ≠ 自动去除了"**
> 我的样例里，MinerU **确实**在 content_list 中标注了 `header:4 / footer:1 / page_number:1`（布局识别能力正常），但默认 Markdown 输出**仍残留了非标准英文页眉页脚文案**（"Internal Use Only" / "Confidential"）。原因是这些纯英文+特殊符号被 PP-OCR 识别成乱码方块，被当成正文文本块保留。
>
> **这是真实、可复现的边界情况**，不是 bug——MinerU 的去除逻辑对"标准页码/常见页眉"更稳，对"自定义英文水印式文案"不一定剔除。

### 4.3 页眉页脚后处理方案（推荐）

不要为了清洗重跑模型。最省资源的做法：**按 content_list 的 `type` 过滤**后再生成最终文本。

```python
import json, re

cl = json.load(open("output/sample/auto/sample_content_list.json"))

# 跳过布局模型已识别的页眉/页脚/页码块
SKIP = {"header", "footer", "page_number"}
clean_blocks = [b for b in cl if b.get("type") not in SKIP]

# 兜底：用正则清掉残留的 "Page N" / "Internal Use Only" 等
text = "\n".join(b.get("text", "") for b in clean_blocks)
text = re.sub(r"Page\s*\d+", "", text)
text = re.sub(r"Internal Use Only|Confidential", "", text, flags=re.I)
```

> 校验脚本 `validate_local.py` 与后处理逻辑已随验证示例一并交付（`mineru-validation/` 目录）。

### 4.4 精度 / 性能调优清单

- **后端**：批量/CPU → `pipeline`；精度敏感 → `hybrid-engine`；纯 CPU 又要高精度 → `vlm-engine -b http-client` 调远端。
- **effort**：`--effort high` 精度更高（hybrid 95.39 vs medium 95.26），但更慢；默认 medium 已够用。
- **设备**：Apple Silicon 用 `-d mps` 可加速 layout 模型；服务器用 `-d cuda`。
- **OCR 语言**：中文文档建议确认 PP-OCRv6 中英文模型已下全（ModelScope 源已含）。

### 4.5 生产落地 Checklist

- ✅ 锁定版本（`mineru==3.4.4`），**不要**升级到 4.0（移除 VLM）。
- ✅ 容器化部署（Docker / 昇腾 npu 镜像），模型预置到镜像或挂载卷，避免每次下载。
- ✅ 用 `mineru-api` + `mineru-router` 做服务化与多卡负载均衡。
- ✅ 对"页眉页脚/水印"文档，接入 4.3 的后处理过滤（按 type + 正则）。
- ✅ 对外在线服务须显著标注「使用了 MinerU」（许可证义务）。
- ✅ 模型源固定为 `modelscope`（国内），避免 HF 不可达导致运行失败。

---

## 五、附录：FAQ 与资源

### 5.1 常见问题

| 现象 | 原因 | 解决 |
|------|------|------|
| `No module named 'transformers' / 'torchvision'` | 只装了 base 包 | 装 `mineru[pipeline]` 或 `mineru[all]` |
| HF 下载一直失败 / 000 | 主站不可达 | `MINERU_MODEL_SOURCE=modelscope` |
| hf-mirror 下载中途报 FileMetadataError | 缺 MFR 配置 | 改用 `modelscope` 源 |
| 页眉页脚仍出现在正文 | 非标准英文水印式文案 | 按 content_list type 过滤 + 正则（4.3） |
| `timeout` 命令不存在 | macOS 无此命令 | 用 `curl -m` 或 `date` 计时 |
| opencv 安装被 SIGKILL(137) | 下载+解包内存峰值 | 本地 wheel + `--no-deps`（坑 4） |

### 5.2 资源链接

- GitHub：https://github.com/opendatalab/MinerU
- 官方文档：https://opendatalab.github.io/MinerU/
- 昇腾部署：https://opendatalab.github.io/MinerU/quick_start/ascend/
- 模型下载器：`mineru-models-download -s {modelscope|huggingface} -m {pipeline|vlm|hybrid|all}`

### 5.3 本次积累的"踩坑清单"（速查）

- 🔴 坑1：装 `mineru[pipeline]` 而非裸 `mineru`
- 🔴 坑2：国内用 `modelscope` 源，别用 hf-mirror（缺 MFR 配置）
- 🔴 坑3：macOS 无 `timeout`，测速用 `curl -m`
- 🟡 坑4：opencv 大包从本地 wheel + `--no-deps` 装
- 🟡 坑5：页眉页脚"检测到了 ≠ 自动去除"，需后处理过滤

---

*本指南由 WorkBuddy 基于 opendatalab/MinerU `3.4.4` 深度研究与本地真实跑通经验整理。所有验证结论、踩坑记录、性能数字均来自实测产物（样例 PDF、解析 Markdown、validation_result.json）。配套验证示例见 `mineru-validation/` 目录。*

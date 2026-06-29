---
type: article
title:  "DeepSpec 训练全流程详解（以 Qwen3 + DSpark 为例）"
date:   2026-06-29 22:55:00 +0800
tags: [deepspec, qwen3, dspark, deepseek, llm, speculative-decoding, draft-model]
---

> 本文基于 DeepSpec 开源代码，以 `Qwen3-4B` + `DSpark` 为具体实例，从算法思想、模型架构、训练数据流、推理流程四个维度，逐行拆解代码，帮助你完整理解 DSpark 草稿模型的训练与推理工作原理。

## DeepSpec 核心工作原理

DeepSpec 训练草稿模型的本质是：**在目标模型的 backbone 架构上，构建一个更小的 draft 网络，使用目标模型预计算的 hidden states 作为监督信号进行训练。**

因此，适配新模型的核心工作量是**让 draft 模型能够"理解"目标模型的内部表示**——这包括：
- 复用目标模型的 tokenizer、embedding、归一化层、旋转位置编码等组件
- 从目标模型的特定层抽取 hidden states 作为 draft 模型的输入
- 保持注意力机制、MLP 结构与目标模型一致

---

## 一、DSpark 是什么：核心思想

DSpark 是一种**面向推测解码（Speculative Decoding）的草稿模型训练方法**。它的核心洞察可以总结为一句话：

> **"让草稿模型在训练时就学会——给定目标模型某几层的 hidden states，一次性猜出接下来的 N 个 token 是什么。"**

传统训练语言模型是自回归的：输入 `t0, t1, t2`，预测 `t3`。但推测解码中的草稿模型需要**一次生成多个 token**（如 7 个），然后让目标模型并行验证。这意味着草稿模型在训练时就要优化"多步预测"能力，而不是单步 next-token prediction。

DSpark 的关键设计：

| 设计 | 作用 |
|------|------|
| **锚点采样（Anchor Sampling）** | 从序列中随机选位置作为"起点"，训练草稿模型从该起点预测后续 token |
| **目标层抽取（Target Layer Extraction）** | 从目标模型的特定层提取 hidden states，作为草稿模型的"上下文特征" |
| **Noise Embedding** | 草稿位置用 mask token 填充，只有起点 token 是真实的，其余靠模型预测 |
| **块级注意力（Block Attention）** | 草稿 token 之间只与同块内的 token 交互，不与上下文交叉注意力 |
| **指数衰减加权（Loss Decay）** | 对 block 内越靠后的预测位置，给予越低的 loss 权重 |
| **L1 对齐损失** | 让草稿模型的 logits 分布与目标模型的 logits 分布对齐，提升接受率 |
| **Confidence Head** | 预测每个 block 的接受率，推理时动态截断低置信度的 proposal |
| **Markov Head** | 引入一阶马尔可夫偏置，让草稿 logits 与前一 token 相关 |

---

## 二、整体架构：两层视角

### 2.1 系统层视角：DeepSpec 的三阶段流水线

```
┌────────────────────────────────────────────────────────────────────┐
│  Stage 1: 数据准备                                                  │
│  ────────────────────────────────────────────────────────────────  │
│  1. 下载对话数据集 (open-perfectblend)                               │
│  2. 用目标模型 (Qwen3-4B) 重新生成 assistant 回答                      │
│  3. 前向传播目标模型，捕获 [1, 9, 17, 25, 33] 层 hidden states         │
│     → 存入二进制 Target Cache (~38TB for 4B model)                   │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│  Stage 2: 训练 (train.py)                                           │
│  ────────────────────────────────────────────────────────────────  │
│  - 加载 Target Cache → CacheDataset                                 │
│  - 构建 Qwen3DSparkModel (5层 draft, 从 5 层目标层拼接输入)            │
│  - 从目标模型复制并冻结 embed_tokens + lm_head                        │
│  - FSDP 包装 → BF16Optimizer → 训练循环                              │
│  - 每 3000 步保存 checkpoint                                        │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│  Stage 3: 评估 (eval.py)                                            │
│  ────────────────────────────────────────────────────────────────  │
│  - 加载目标模型 + 草稿模型 checkpoint                                  │
│  - 在 9 个 benchmark 上运行推测解码                                    │
│  - 核心循环: propose → verify (rejection sampling) → update          │
│  - 输出 accept_len、verify_rate、各位置接受率                          │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 模型层视角：Qwen3DSparkModel 的层次结构

```
                    ┌──────────────────────────────┐
                    │    Qwen3DSparkModel          │
                    │ (继承自 Qwen3PreTrainedModel) │
                    └──────────────────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   ┌────▼────┐              ┌──────▼──────┐            ┌──────▼──────┐
   │ 输入端   │              │  主干网络    │            │  输出端      │
   │         │              │             │            │             │
   │embed_tokens│          │ 5× DecoderLayer│          │  lm_head    │
   │(from target)│         │  (可训练)      │           │(from target)│
   │ 冻结     │             │              │            │  冻结       │
   └────┬────┘              └──────┬──────┘            └──────┬──────┘
        │                          │                         
   ┌────▼────┐              ┌──────▼──────┐
   │ noise_embed│           │ Qwen3RMSNorm│
   │ (mask token│           │ rotary_emb  │
   │   填充)   │             │ fc (拼接层)  │
   └──────────┘             └─────────────┘
                                   │
                          ┌────────▼────────┐
                          │ target_hidden_states
                          │ (来自 target 缓存)
                          │ 从 [1,9,17,25,33] 层
                          │ 拼接后 → fc → norm
                          └─────────────────┘
        ┌──────────────────────────────────────────────────────┐
        │              额外头部（可选）                           │
        │  ┌─────────────┐      ┌──────────────────────┐       │
        │  │ Markov Head │      │   Confidence Head    │       │
        │  │ (vocab×rank │      │  (预测接受率)          │       │
        │  │   → vocab)  │      │  输入: hidden + markov│       │
        │  └─────────────┘      └──────────────────────┘       │
        └──────────────────────────────────────────────────────┘
```

---

## 三、训练数据流：从 Target Cache 到 Loss

### 3.1 数据准备：Target Cache 里存了什么

`prepare_target_cache.py` 对每一条训练样本做以下操作：

1. 用 tokenizer 编码对话文本 → `input_ids`, `attention_mask`, `loss_mask`
2. 运行目标模型 `Qwen3-4B` 的前向传播
3. 捕获 `target_layer_ids = [1, 9, 17, 25, 33]` 这 5 层的 hidden states
4. 捕获最后一层 hidden states（用于计算 aligned_target_logits）

缓存中每条样本包含 5 个张量：

```python
{
    "input_ids":               [seq_len]  int32
    "attention_mask":          [seq_len]  uint8
    "loss_mask":               [seq_len]  uint8  (assistant 回复位置为 1)
    "target_hidden_states":    [seq_len, num_layers, hidden_size]  bfloat16
    "target_last_hidden_states": [seq_len, hidden_size]  bfloat16
}
```

### 3.2 训练数据加载：CacheDataset + CacheCollator

`CacheDataset` 是内存映射数据集，从二进制文件中按需加载样本。

`CacheCollator` 将样本打包成 batch：

```python
class CacheCollator:
    def __call__(self, features):
        batch = {}
        for key in ("input_ids", "loss_mask"):
            batch[key] = _pad_1d_batch(features, key)  # 按最大长度 pad
        for key in ("target_hidden_states", "target_last_hidden_states"):
            batch[key] = _pad_hidden_batch(features, key)  # pad hidden dims
        return batch
```

### 3.3 训练前向传播：Qwen3DSparkModel.forward()

这是**最核心的函数**。`forward()` 接收 4 个输入：

```python
def forward(self, input_ids, target_hidden_states, loss_mask, target_last_hidden_states=None):
    # input_ids: [batch_size, seq_len]
    # target_hidden_states: [batch_size, seq_len, num_target_layers, hidden_size]
    # loss_mask: [batch_size, seq_len]  (assistant 位置为 1)
    # target_last_hidden_states: [batch_size, seq_len, hidden_size] (可选)
```

#### Step 1: 锚点采样（Anchor Sampling）

```python
anchor_positions, block_keep_mask = sample_anchor_positions(
    seq_len=seq_len,
    loss_mask=loss_mask,
    num_anchors=self.num_anchors,  # 512
    device=device,
)
# anchor_positions: [batch_size, num_anchors] — 每个样本选 512 个锚点位置
# block_keep_mask: [batch_size, num_anchors] — 有效锚点掩码
```

锚点采样的规则：
- 只在 `loss_mask > 0.5` 的位置采样（即 assistant 回复区域）
- 锚点位置 `i` 必须满足 `loss_mask[i] > 0.5` 且 `loss_mask[i+1] > 0.5`
- 每个样本最多采样 `num_anchors` 个，不足用 dummy 填充
- 随机采样，保证训练多样性

#### Step 2: 构造 Noise Embedding

```python
noise_embedding = create_noise_embed(
    self.embed_tokens,
    input_ids,
    anchor_positions,
    block_keep_mask,
    mask_token_id=self.mask_token_id,  # 151669 (Qwen3)
    block_size=self.block_size,  # 7
)
# noise_embedding: [batch_size, seq_len + num_anchors*block_size, hidden_size]
```

构造逻辑：
- 原始序列：`[t0, t1, t2, ..., t_{seq_len-1}]` → 正常 embedding
- 对每个锚点 `i`，追加 `block_size=7` 个草稿位置：`[t_i, <MASK>, <MASK>, ..., <MASK>]`
- 只有第一个位置是真实的 `t_i`，其余 6 个位置是 mask token
- 最终序列长度 = `seq_len + num_anchors * block_size`

#### Step 3: 构造位置编码与注意力掩码

```python
context_position_ids = torch.arange(seq_len, device=device).unsqueeze(0).expand(bsz, -1)
draft_position_ids = create_position_ids(anchor_positions, block_size)
# draft_position_ids: [batch_size, num_anchors*block_size]
# 每个草稿位置 = anchor_position + offset (0,1,2,...,6)
full_position_ids = torch.cat([context_position_ids, draft_position_ids], dim=1)
```

注意力掩码 `dspark_attn_mask` 是 `flex_attention` 的 block mask：

```python
def dspark_mask_mod(b, h, q_idx, kv_idx):
    q_block_id = q_idx // block_size      # 查询属于哪个 block
    anchor_pos = anchor_positions[b, q_block_id]  # 该 block 的锚点
    is_context = kv_idx < seq_len
    mask_context = is_context & (kv_idx < anchor_pos)  # 只能看到锚点前的上下文
    is_draft = kv_idx >= seq_len
    kv_block_id = (kv_idx - seq_len) // block_size
    mask_draft = is_draft & (q_block_id == kv_block_id)  # 只能与同块草稿交互
    return (mask_context | mask_draft) & is_valid_block
```

**注意力掩码的关键约束**：
1. **Context 可见性**：草稿位置只能看到锚点之前的上下文 token
2. **Block 内可见性**：草稿位置之间只能与同 block 内的其他草稿位置交互
3. **跨 block 不可见**：不同锚点的草稿之间完全隔离

#### Step 4: 主干网络前向传播

```python
output_hidden = self._forward_backbone(
    position_ids=full_position_ids,
    noise_embedding=noise_embedding,
    target_hidden_states=target_hidden_states,
    attention_mask=dspark_attn_mask,
)
```

`_forward_backbone` 内部：

```python
def _forward_backbone(self, position_ids, noise_embedding, target_hidden_states, ...):
    hidden_states = noise_embedding
    # 目标层拼接 → fc 投影 → norm
    target_hidden_states = self.hidden_norm(self.fc(target_hidden_states))
    position_embeddings = self.rotary_emb(hidden_states, position_ids)
    for layer in self.layers:  # 5 层 draft decoder
        hidden_states = layer(
            hidden_states=hidden_states,
            target_hidden_states=target_hidden_states,  # 作为 KV 的 context
            attention_mask=attention_mask,
            position_embeddings=position_embeddings,
        )
    return self.norm(hidden_states)
```

**每层 Qwen3DSparkDecoderLayer 的结构**：

```python
class Qwen3DSparkDecoderLayer:
    def __init__(self, config, layer_idx):
        self.self_attn = Qwen3DSparkAttention(config, layer_idx)  # 草稿注意力
        self.mlp = Qwen3MLP(config)  # 复用 Qwen3 的 MLP
        self.input_layernorm = Qwen3RMSNorm(...)
        self.post_attention_layernorm = Qwen3RMSNorm(...)

    def forward(self, target_hidden_states, hidden_states, ...):
        # 1. 归一化 + 注意力（q 来自 hidden_states, k/v 来自 target_hidden_states + hidden_states）
        hidden_states = self.input_layernorm(hidden_states)
        hidden_states = self.self_attn(hidden_states, target_hidden_states, ...)[0]
        hidden_states = residual + hidden_states
        # 2. 归一化 + MLP
        hidden_states = self.post_attention_layernorm(hidden_states)
        hidden_states = self.mlp(hidden_states)
        return residual + hidden_states
```

**Qwen3DSparkAttention 的关键**：

```python
class Qwen3DSparkAttention(nn.Module):
    def forward(self, hidden_states, target_hidden_states, position_embeddings, ...):
        # q 来自草稿输入
        q = self.q_proj(hidden_states).view(bsz, q_len, num_heads, head_dim)
        # k/v 来自 target_hidden_states (context) + hidden_states (draft)
        k_ctx = self.k_proj(target_hidden_states)
        k_noise = self.k_proj(hidden_states)
        v_ctx = self.v_proj(target_hidden_states)
        v_noise = self.v_proj(hidden_states)
        k = torch.cat([k_ctx, k_noise], dim=1)  # [bsz, ctx_len + q_len, ...]
        v = torch.cat([v_ctx, v_noise], dim=1)
        # 应用 RoPE
        q, k = apply_rotary_pos_emb(q, k, cos, sin)
        # 注意力计算
        attn_output, _ = attn_fn(self, q, k, v, attention_mask, ...)
        return self.o_proj(attn_output), None
```

**注意**：这里的 `target_hidden_states` 在 KV 中是**静态的**（来自目标模型缓存），只有 `q` 来自草稿模型的 hidden_states。这就是 DSpark 的 **"cross-attention + self-attention 混合"** 设计。

#### Step 5: 计算 Draft Logits 与监督目标

```python
# 从 backbone 输出中分离出草稿位置的 hidden states
output_hidden_4d = output_hidden.reshape(bsz, num_blocks, block_size, hidden_size)

# 构造监督目标：anchor 后第 1~block_size 个 token
target_ids = input_ids.gather(..., anchor_positions.unsqueeze(-1) + label_offsets)
# target_ids: [batch_size, num_anchors, block_size]

# 计算草稿 logits
draft_logits = self.compute_logits(output_hidden).reshape(bsz, num_blocks, block_size, vocab_size)
```

#### Step 6: Markov Head 与 Confidence Head

```python
# Markov Head: 将前一 token 的 embedding 投影为 logits 偏置
if self.markov_head is not None:
    draft_logits = self.markov_head.apply_block_logits(
        draft_logits,
        token_ids=prev_token_ids,  # [anchor, t1, t2, ..., t_{block_size-1}]
        hidden_states=output_hidden_4d,
    )

# Confidence Head: 预测每个位置的接受率
if self.confidence_head is not None:
    confidence_pred = self.confidence_head(output_hidden_4d).float()
```

### 3.4 Loss 计算：compute_dspark_loss

```python
loss = compute_dspark_loss(
    outputs=outputs,
    loss_decay_gamma=4.0,      # 位置衰减系数
    ce_loss_alpha=0.1,         # 交叉熵权重
    l1_loss_alpha=0.9,         # L1 对齐权重
    confidence_head_alpha=1.0, # 置信度头权重
)
```

Loss 由三部分组成：

#### (1) CE Loss：交叉熵（让草稿预测对 token）

```python
flat_logits = draft_logits.reshape(-1, vocab_size)
flat_targets = target_ids.reshape(-1)
loss_per_token = F.cross_entropy(flat_logits, flat_targets, reduction="none")
# 加权：越靠后的位置权重越低
decay_weights = torch.exp(-positions / loss_decay_gamma)  # [1, 0.78, 0.61, 0.47, ...]
ce_loss = (loss_per_token * loss_weight_mask).sum() / total_weight
```

#### (2) L1 Loss：分布对齐（让草稿 logits 接近目标 logits）

```python
draft_probs = softmax(draft_logits)
target_probs = softmax(aligned_target_logits)  # 来自 target_last_hidden_states
l1_dist = (draft_probs - target_probs).abs().sum(dim=-1)  # L1 距离
l1_loss = (l1_dist * loss_weight_mask).sum() / total_weight
```

**为什么需要 L1 Loss？**
- CE Loss 只关心"猜对 token"，不关心概率分布形状
- L1 Loss 让草稿模型的**完整概率分布**与目标模型对齐
- 在推测解码中，接受率取决于 `min(1, target_prob / draft_prob)`，分布对齐直接影响接受率

#### (3) Confidence Loss：预测接受率

```python
accept_rate = 1 - 0.5 * |draft_probs - target_probs|.sum(-1)  # 接受率
confidence_loss = BCEWithLogitsLoss(confidence_pred, accept_rate)
```

**最终 Loss**：

```python
total_loss = 0.1 * ce_loss + 0.9 * l1_loss + 1.0 * confidence_loss
```

---

## 四、推理流程：Speculative Decoding 循环

### 4.1 推理时与训练时的差异

| 维度 | 训练时 | 推理时 |
|------|--------|--------|
| 锚点 | 随机采样 512 个 | 只在当前位置生成一个 block |
| 目标 hidden states | 从缓存读取 | 目标模型实时前向传播 |
| block_size | 7 | 7 |
| 接受率 | 无 | 用 rejection sampling 验证 |
| confidence head | 训练预测 | 动态截断低置信度 proposal |

### 4.2 推理核心循环

```python
def generate_decoding_sample(target_model, draft_model, input_ids, max_new_tokens, ...):
    # 1. 目标模型 Prefill
    output = target_model(input_ids, use_cache=True, output_hidden_states=True)
    context = init_context(output)  # 提取 target_hidden_states

    start = len(input_ids)
    while start < max_length:
        # 2. 草稿模型 propose
        proposal = draft_model.propose(context, output_ids, start)
        # 3. 目标模型 verify（一次 forward 并行验证所有候选）
        verification = verify_draft_tokens(target_model, proposal, ...)
        # 4. 接受/拒绝 + 修正
        accepted = verification.accepted_draft_tokens
        output_ids[start : start+accepted+1] = proposal.verify_input_ids[:accepted+1]
        # 5. 更新上下文（用目标模型的新 hidden states）
        update(context, verification)
        start += accepted + 1
```

### 4.3 Propose 阶段：草稿模型生成候选

```python
class Qwen3DSparkEvaluator:
    def _propose(self, context, output_ids, position_ids, start):
        # 构造 draft_input_ids: [<MASK>, <MASK>, ..., <MASK>]
        draft_input_ids = torch.full((1, block_size), mask_token_id)
        draft_input_ids[:, 0] = output_ids[:, start]  # 第一个位置是当前 token

        # 前向传播草稿模型
        block_hidden = forward_dspark_draft_block(
            model, draft_input_ids, target_hidden_states=context.target_hidden_states
        )

        # 计算 logits → 采样 token
        base_logits = model.compute_logits(block_hidden)
        sampled_tokens, draft_logits = model.sample_draft_tokens(
            base_logits, first_prev_token_ids=output_ids[:, start]
        )

        # Confidence Head 截断
        if model.confidence_head is not None:
            confidence = model.predict_confidence_step(block_hidden)
            proposal_len = min(block_size, first_below_threshold(confidence))
        else:
            proposal_len = block_size

        return DSparkDraftProposal(
            draft_token_count=proposal_len,
            verify_input_ids=torch.cat([output_ids[:, start], sampled_tokens[:proposal_len]]),
            draft_probs=softmax(draft_logits[:proposal_len]),
        )
```

### 4.4 Verify 阶段：目标模型验证

```python
def verify_draft_tokens(target_model, proposal, ...):
    # 目标模型一次 forward 验证所有候选 token
    target_output = target_model(input_ids=proposal.verify_input_ids, ...)
    target_probs = softmax(target_output.logits)

    # 计算每个位置的接受概率
    proposed_tokens = proposal.verify_input_ids[:, 1:]  # 去掉第一个已知 token
    selected_target_probs = target_probs.gather(proposed_tokens)
    selected_draft_probs = proposal.draft_probs.gather(proposed_tokens)
    accept_prob = min(1.0, selected_target_probs / selected_draft_probs)

    # 采样接受/拒绝（前缀必须全部接受）
    accept_mask = (random() < accept_prob).to(int64)
    accept_prefix = accept_mask.cumprod(dim=1)  # 前缀约束
    accepted_tokens = accept_prefix.sum()

    # 如果拒绝，从残差分布采样修正 token
    if accepted_tokens < proposal_len:
        next_token = sample_residual(target_probs[accepted], draft_probs[accepted])
    else:
        next_token = sample_from(target_probs[-1])

    return VerificationResult(accepted_tokens, next_token, ...)
```

### 4.5 Update 阶段：更新上下文

```python
def _update(self, context, verification):
    # 用目标模型验证后的 hidden states 更新 target_hidden_states
    verified_target_hidden = extract_context_feature(
        verification.target_output.hidden_states,
        self.draft_model.target_layer_ids,
    )
    # 只保留已接受的 token + 1 个新 token 的 hidden states
    context.target_hidden_states = verified_target_hidden[
        :, :verification.accepted_draft_tokens + 1, :
    ]
```

---

## 五、关键超参数解读

### 5.1 模型配置（`config/dspark/dspark_qwen3_4b.py`）

```python
model = dict(
    target_model_name_or_path="Qwen/Qwen3-4B",
    block_size=7,                    # 每个 block 预测 7 个 token
    num_draft_layers=5,              # 草稿模型只有 5 层（目标模型 36 层）
    target_layer_ids=[1, 9, 17, 25, 33],  # 从目标模型的 5 层抽取 hidden states
    mask_token_id=151669,            # Qwen3 的 mask token ID
    num_anchors=512,                 # 训练时每条序列采样 512 个锚点
    markov_rank=256,                # Markov Head 的 embedding 维度
    markov_head_type='vanilla',
    confidence_head_alpha=1.0,      # Confidence Head 的 loss 权重
    confidence_head_with_markov=True,
    loss_decay_gamma=4.0,           # 位置衰减系数（越大衰减越慢）
    ce_loss_alpha=0.1,              # CE Loss 权重
    l1_loss_alpha=0.9,              # L1 Loss 权重（主要目标）
)
```

### 5.2 超参数设计逻辑

| 参数 | 设计逻辑 |
|------|----------|
| `target_layer_ids` | 均匀分布在目标模型各层，让草稿模型获得多尺度信息。`[1, 9, 17, 25, 33]` 对应 36 层 Qwen3-4B，间隔约 8 层 |
| `num_draft_layers=5` | 与 `target_layer_ids` 数量一致，每层草稿对应一个目标层的 cross-attention |
| `block_size=7` | 推测解码的经典值，一次猜 7 个 token |
| `ce_loss_alpha=0.1, l1_loss_alpha=0.9` | **L1 是主要目标**，因为接受率取决于分布对齐，而不仅仅是猜对 token |
| `loss_decay_gamma=4.0` | 位置 0 的权重 = 1.0，位置 6 的权重 = exp(-6/4) ≈ 0.22，鼓励模型优先保证前几个位置的准确性 |
| `confidence_head_alpha=1.0` | 训练模型预测接受率，推理时动态截断低置信度位置，避免浪费验证资源 |

### 5.3 为什么 `target_layer_ids` 不包含最后一层

```python
def assert_no_final_target_layer(target_model, target_layer_ids):
    last_layer = len(target_model.model.layers) - 1
    assert last_layer not in target_layer_ids, (
        "target_layer_ids 不能包含最后一层，因为最后一层需要与 lm_head 一起计算 logits，"
        "而 draft 模型的 hidden states 与 target 模型的 hidden states 不在同一空间。"
    )
```

**原因**：最后一层 hidden states 需要经过 lm_head 才能得到 logits。如果草稿模型直接模仿最后一层，由于草稿模型和目标的 backbone 结构不同（层数不同、参数量不同），它们的 hidden space 可能不兼容。DSpark 通过 lm_head 的 logits 进行 L1 对齐，而不是在 hidden space 对齐。

---

## 六、代码走读：关键文件的职责

```
deepspec/
├── modeling/
│   ├── dspark/
│   │   ├── common.py               # 锚点采样、注意力掩码、eval_mask 等通用工具
│   │   ├── markov_head.py          # Markov Head 实现（VanillaMarkov）
│   │   ├── loss.py                 # DSpark Loss 计算（CE + L1 + Confidence）
│   │   └── qwen3/
│   │       ├── config.py           # 构建 draft_config（从 target_config 深拷贝）
│   │       └── modeling.py         # Qwen3DSparkModel（Attention + DecoderLayer + Model）
│   └── eagle3/                     # Eagle3 实现（不同算法，类似结构）
├── trainer/
│   ├── base_trainer.py             # FSDP、优化器、数据加载、训练循环
│   └── dspark_trainer.py           # Qwen3DSparkTrainer / Gemma4DSparkTrainer
├── eval/
│   ├── base_evaluator.py           # 推测解码的 propose-verify-update 循环框架
│   └── dspark/
│       ├── evaluator.py            # Qwen3DSparkEvaluator（包装目标模型 + 草稿模型）
│       ├── draft_ops.py            # forward_dspark_draft_block / build_dspark_proposal
│       └── confidence_head.py      # 置信度头的校准和记录
├── data/
│   ├── parser.py                   # Chat Template 注册、对话解析、loss_mask 生成
│   └── target_cache_dataset.py     # CacheDataset / CacheCollator / Target Cache 写入
└── utils/                          # 采样工具、训练日志、checkpoint 管理等
```

---

## 七、总结：DSpark 的核心创新

1. **多步预测训练**：不是训练单步 next-token，而是训练从任意锚点预测后续 `block_size` 个 token

2. **目标层特征注入**：草稿模型不是从零开始，而是接收目标模型多层的 hidden states 作为“上下文提示”，大幅降低学习难度

3. **L1 分布对齐**：超越 CE Loss，让草稿的概率分布与目标模型对齐，直接优化推测解码的接受率

4. **Confidence Head**：训练草稿模型预测自己的接受率，推理时动态截断不可靠的 proposal，避免验证资源浪费

5. **Markov Head**：引入一阶马尔可夫依赖，让草稿生成考虑前一 token 的信息，提升生成质量

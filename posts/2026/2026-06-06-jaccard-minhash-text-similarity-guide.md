---
type: article
title:  "海量文本去重与相似度检索：从 Jaccard 到 MinHash 的完整技术指南"
date:   2026-06-06 08:00:00 +0800
tags: [Jaccard, MinHash, 大数据处理, 文本去重, 近似算法, 相似度检索]
---

## 问题背景：为什么百亿级去重不可能暴力求解？

在互联网大数据场景中，如何从海量数据（如百亿网页、千万级商品描述、巨大的开源代码仓库）中快速找出重复或高度相似的内容？这是一个极其经典的工业界痛点。

最朴素的想法是：对文章进行分词，转成集合后两两比对。若有 $N$ 篇文档，需要比较 $\frac{N(N-1)}{2}$ 次。当 $N = 10^7$（一千万）时，比较次数约为 **50 万亿次**。即便单次比较仅需 1 微秒，也需要 **1.6 年** 才能跑完。这种 $O(N^2)$ 复杂度的算法会导致服务器直接卡死崩溃。

本文将结合数学原理、算法推导与工程实战，深入拆解 **Jaccard 相似度** 的直觉陷阱，以及 **MinHash（最小哈希）** 算法如何对高维稀疏数据完成降维打击，最终给出可直接落地的工业级实现方案。

---

## 一、Jaccard 相似度：精准度量及其直觉陷阱

**Jaccard 相似度（Jaccard Similarity）** 是衡量两个集合重合度的标准数学方法。其核心思想非常直观：**看两个集合的交集（共同拥有的元素）占它们并集（总共拥有的元素）的比例。**

数学公式定义为：

$$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

### 1. 经典直觉陷阱：为什么你常常会算错？

假设我们要对比两篇简短文本的词汇相似度：
* **文本 A 词集**：{ 苹果, 香蕉, 梨, 桃子 }（4个元素）
* **文本 B 词集**：{ 香蕉, 梨, 西瓜, 葡萄 }（4个元素）

很多人直觉上会认为它们的相似度是 **50%**。因为大脑下意识地使用了"重合词数量（2） / 某一篇总词数（4） = 50%"。

**但实际上，Jaccard 相似度的精确值是 33.3%。**

为什么？因为 Jaccard 考核的是**全局大背景（并集）**。如果把 A 和 B 的词全部倒进一个大盘子里，去掉重复项后，两篇文章总共涉及的全部话题范围（并集）是：`{ 苹果, 香蕉, 梨, 桃子, 西瓜, 葡萄 }`，共 **6** 个词。

在这个总背景下，共同达成共识的交集只有 `{ 香蕉, 梨 }` 2个词。因此：

$$J(A, B) = \frac{2}{6} \approx 33.3\%$$

### 2. 局部与整体：Jaccard 惩罚机制的必要性

Jaccard 故意放大分母（加入双方特有的不重合元素），是为了有效惩罚**"只有局部相同，整体大相径庭"**的情况。比如以下极端案例：
* **短推特 A**：{ iPhone }（1个词）
* **长小说 B**：{ iPhone, 苹果, 科技, 历史, 宇宙, 人生, 哲学……共1000个词 }

如果依循直觉，A 的词在 B 里全有，相似度是 100% 吗？显然不对。若用 Jaccard 计算，交集为 1，并集为 1000，相似度为 $1 / 1000 = 0.1\%$，极为精准地反映了两者整体内容的巨大鸿沟。

### 3. Jaccard 的数学性质

| 性质 | 说明 | 工程意义 |
|------|------|----------|
| **对称性** | $J(A,B) = J(B,A)$ | 相似度是无向的，适合构建无向相似图 |
| **有界性** | $0 \leq J(A,B) \leq 1$ | 1 表示完全相同，0 表示完全无关 |
| **不满足三角不等式** | 不能直接作为度量空间距离 | 不能直接用 KD-Tree 等空间索引 |
| **对集合大小敏感** | 小集合的交集波动会被放大 | 短文本去重需要更严格的阈值 |

---

## 二、大数据瓶颈：为什么 $O(N^2)$ 是死路？

假设每篇文档平均有 $M$ 个唯一词（集合元素），单次 Jaccard 计算需要遍历两个集合并统计交集与并集，时间复杂度约为 $O(M)$。

| 文档数量 $N$ | 两两比对次数 $\frac{N(N-1)}{2}$ | 预估耗时（$M=1000$，单次1μs） |
|-------------|-------------------------------|------------------------------|
| $10^3$ | $5 \times 10^5$ | 0.5 秒 |
| $10^5$ | $5 \times 10^9$ | 1.4 小时 |
| $10^7$ | $5 \times 10^{13}$ | 1.6 年 |
| $10^9$ | $5 \times 10^{17}$ | 1600 年 |

**核心矛盾**：Jaccard 系数虽然精准，但在海量文本去重任务中存在致命缺陷——**两两比对太慢**。计算量随文档数呈平方级爆炸，存储所有文档的原始词集也消耗巨大内存。

为了打破这一瓶颈，**MinHash（最小哈希）** 算法登场。它的核心诉求是：**让相似的文本生成相似的固定长度 Hash 编码（签名），通过比对简短的签名来近似估算真实的 Jaccard 相似度。**

> 💡 **MinHash 核心数学定理：**
> 两个集合经由随机哈希函数转换后，它们**最小哈希值（MinHash）相同的概率，正好等于它们的 Jaccard 相似度**。
> $$P(\min(h(A)) = \min(h(B))) = J(A, B)$$

---

## 三、MinHash 哈希生成算法：三步矩阵演变演练

为了直观说明，我们虚拟三个文本（其中 `a, b, c, d` 是四个不同的词），将其表示为**原始特征矩阵**（行代表词汇 Token，列代表文本文档，1表示包含，0表示不包含）：
* $S_1 = \{a, b, c, d\}$
* $S_2 = \{b, c, d\}$
* $S_3 = \{a, d\}$

在正式推导前，我们可以通过精确的 Jaccard 公式算出这三个集合的**真实相似度**作为比对锚点：
* $\text{Jaccard}(S_1, S_2) = 3 / 4 = \mathbf{0.75}$
* $\text{Jaccard}(S_1, S_3) = 2 / 4 = \mathbf{0.50}$
* $\text{Jaccard}(S_2, S_3) = 1 / 4 = \mathbf{0.25}$

### 原始特征矩阵

| 行号 | 词汇 Token | $S_1$ | $S_2$ | $S_3$ |
| :---: | :---: | :---: | :---: | :---: |
| 0 | a | 1 | 0 | 1 |
| 1 | b | 1 | 1 | 0 |
| 2 | c | 1 | 1 | 0 |
| 3 | d | 1 | 1 | 1 |

假定我们设定哈希签名长度 $N = 3$，即模拟 3 次随机行打乱（洗牌）变换：

### 1. 第一次行变换（Hash 1）
行顺序随机打乱洗牌为：`[c, b, d, a]`。我们顺着行号自上而下往下走，寻找每个集合第一个出现 1 的行号作为其最小哈希值：

| 行号 | 对应原词 | $S_1$ | $S_2$ | $S_3$ | 寻找第一个 1 的推导逻辑 |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | c | **1** | **1** | 0 | $S_1$、$S_2$ 在行号 0 处率先遇到 1 $\rightarrow h_1(S_1)=0, h_1(S_2)=0$ |
| 1 | b | 1 | 1 | 0 | - |
| **2** | d | 1 | 1 | **1** | $S_3$ 往下走到行号 2 处才首次遇到 1 $\rightarrow h_1(S_3)=2$ |
| 3 | a | 1 | 0 | 1 | - |

* **本轮结果**：$h_1(S_1) = 0$ ； $h_1(S_2) = 0$ ； $h_1(S_3) = 2$

---

### 2. 第二次行变换（Hash 2）
行顺序再次随机打乱为：`[b, d, c, a]`：

| 行号 | 对应原词 | $S_1$ | $S_2$ | $S_3$ | 寻找第一个 1 的推导逻辑 |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | b | **1** | **1** | 0 | $S_1$ 和 $S_2$ 在行号 0 处的值都是 1，率先命中 $\rightarrow h_2(S_1)=0, h_2(S_2)=0$ |
| **1** | d | 1 | 1 | **1** | $S_3$ 往下走到行号 1 处首次遇到 1 $\rightarrow h_2(S_3)=1$ |
| 2 | c | 1 | 1 | 0 | - |
| 3 | a | 1 | 0 | 1 | - |

* **本轮结果**：$h_2(S_1) = 0$ ； $h_2(S_2) = 0$ ； $h_2(S_3) = 1$

---

### 3. 第三次行变换（Hash 3）
行顺序再次随机打乱为：`[a, c, b, d]`：

| 行号 | 对应原词 | $S_1$ | $S_2$ | $S_3$ | 寻找第一个 1 的推导逻辑 |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | a | **1** | 0 | **1** | $S_1$ 和 $S_3$ 在行号 0 处的值是 1，率先命中 $\rightarrow h_3(S_1)=0, h_3(S_3)=0$ |
| **1** | c | 1 | **1** | 0 | $S_2$ 往下走到行号 1 处首次遇到 1 $\rightarrow h_3(S_2)=1$ |
| 2 | b | 1 | 1 | 0 | - |
| 3 | d | 1 | 1 | 1 | - |

* **本轮结果**：$h_3(S_1) = 0$ ； $h_3(S_2) = 1$ ； $h_3(S_3) = 0$

---

### 4. 汇总：最终生成的哈希签名矩阵 (Signature Matrix)

经过 3 次行变换，原本由离散词汇组成的稀疏特征矩阵，被成功压缩并映射为了 3 个精简数值构成的**短签名向量**：

| 哈希签名位 | $S_1$ 签名值 | $S_2$ 签名值 | $S_3$ 签名值 |
| :---: | :---: | :---: | :---: |
| **$h_1$** | 0 | 0 | 2 |
| **$h_2$** | 0 | 0 | 1 |
| **$h_3$** | 0 | 1 | 0 |
| **最终签名向量表示** | **`[0, 0, 0]`** | **`[0, 0, 1]`** | **`[2, 1, 0]`** |

---

## 四、基于哈希签名的相似度估算与误差分析

有了固定长度为 $N=3$ 的短签名向量后，计算两两相似度的方法变得极其简便：**比对两个短向量在相同对应位置上，数字完全一致的个数比例。**

我们来验证 MinHash 的神奇估算效果：

1. **$\text{Sim}(S_1, S_2)$**：
   * 对比 $S_1$ `[0, 0, 0]` 和 $S_2$ `[0, 0, 1]`
   * 在 $h_1$（同为0）和 $h_2$（同为0）两个位置完全相同，相同个数为 2。
   * **估计相似度** $= 2 / 3 \approx \mathbf{0.667}$ （极其逼近真实值 **0.75**）

2. **$\text{Sim}(S_1, S_3)$**：
   * 对比 $S_1$ `[0, 0, 0]` 和 $S_3$ `[2, 1, 0]`
   * 仅在 $h_3$（同为0）一个位置相同，相同个数为 1。
   * **估计相似度** $= 1 / 3 \approx \mathbf{0.333}$ （正在收敛至真实值 **0.50**）

3. **$\text{Sim}(S_2, S_3)$**：
   * 对比 $S_2$ `[0, 0, 1]` 和 $S_3$ `[2, 1, 0]`
   * 三个对应位置的数字完全不同，相同个数为 0。
   * **估计相似度** $= 0 / 3 = \mathbf{0}$ （正在收敛至真实值 **0.25**）

### 误差分析：为什么 $N=3$ 不够，而 $N=128$ 足够？

MinHash 的估计值是一个**无偏估计量**。设真实 Jaccard 相似度为 $J$，签名长度为 $N$，则估计值 $\hat{J}$ 服从二项分布：

$$\hat{J} = \frac{X}{N}, \quad X \sim \text{Binomial}(N, J)$$

其方差为：

$$\text{Var}(\hat{J}) = \frac{J(1-J)}{N}$$

| 签名长度 $N$ | 标准差 $\sigma$（当 $J=0.5$ 时） | 95% 置信区间宽度 |
|-------------|-------------------------------|-----------------|
| 3 | 0.289 | ±0.566 |
| 64 | 0.0625 | ±0.123 |
| 128 | 0.0442 | ±0.087 |
| 256 | 0.0313 | ±0.061 |

> 💡 **工程贴士**：当 $N=128$ 时，估计误差已被压缩到 ±0.087 以内。对于阈值通常在 0.6~0.9 的去重场景，这个精度完全足够。继续增大 $N$ 的边际收益递减，而存储和计算成本线性增长，因此 **128 或 256 是工业界的黄金平衡点**。

---

## 五、从理论到工程：真正的 MinHash 实现方式

上述“随机行打乱"的矩阵视角是为了教学直观。在真实工程中，**不会真的去打乱稀疏矩阵的行**，而是采用更高效的**多哈希函数法**：

### 工程实现方案

1. **选 $N$ 个独立的哈希函数** $h_1, h_2, ..., h_N$（如 MurmurHash、FarmHash 的不同种子）
2. 对文档的每一个词 $w$，计算 $h_i(w)$ 得到 $N$ 个哈希值
3. 对每个 $i$，取该文档所有词中 $h_i(w)$ 的**最小值**作为第 $i$ 维签名
4. 最终得到 $N$ 维签名向量

```python
import mmh3  # MurmurHash3

def minhash_signature(tokens: set, num_hashes: int = 128, seed_base: int = 0) -> list:
    """
    基于多哈希函数法的 MinHash 签名生成
    tokens: 文档的唯一词集合（已去重）
    num_hashes: 签名维度，推荐 128 或 256
    """
    signature = []
    for i in range(num_hashes):
        min_val = float('inf')
        for token in tokens:
            # 使用不同种子生成独立哈希函数
            hash_val = mmh3.hash(token, seed=seed_base + i)
            # 将 32 位有符号整数转为无符号
            hash_val = hash_val & 0xFFFFFFFF
            if hash_val < min_val:
                min_val = hash_val
        signature.append(min_val)
    return signature
```

**复杂度对比**：

| 阶段 | 暴力 Jaccard | MinHash |
|------|-------------|---------|
| 预处理 | 存储原始词集 $O(M)$ | 计算签名 $O(N \cdot M)$ |
| 单次比对 | $O(M)$ | $O(N)$ |
| 一千万文档全量比对 | $O(N^2 \cdot M)$ | $O(N^2 \cdot N)$ |
| 存储空间 | $O(N \cdot M)$ | $O(N \cdot N)$ |

当 $M \gg N$（如文档有数千词，签名仅 128 维）时，MinHash 将比对速度提升约 **10~100 倍**，存储压缩比达到同等量级。

---

## 六、工业级加速：MinHash + LSH（局部敏感哈希）

即使 MinHash 将单次比对降到 $O(N)$，一千万文档的两两比对仍有 50 万亿次签名比对。**如何进一步避免全量比对？**

答案是 **LSH（Locality Sensitive Hashing，局部敏感哈希）**。核心思想：将签名向量分桶，**只有落入同一桶的文档才需要比对**。

### 实现步骤

1. 将 $N=128$ 维签名分成 $b=16$ 个 band，每个 band 含 $r=8$ 个哈希值
2. 对每个 band，将 8 个哈希值拼接后做一次哈希，得到桶 ID
3. 两个文档如果在**任意一个 band** 落入同一桶，就成为候选对
4. 仅对候选对计算完整的 MinHash 相似度

### 候选对概率分析

设真实相似度为 $J$，则一个 band 内 8 个值全相同的概率为 $J^8$，至少一个 band 相同的概率为：

$$P(\text{候选对}) = 1 - (1 - J^8)^{16}$$

| 真实相似度 $J$ | 成为候选对的概率 | 工程含义 |
|---------------|-----------------|---------|
| 0.9 | 0.9999 | 几乎必定被召回 |
| 0.7 | 0.926 | 高召回率 |
| 0.5 | 0.278 | 中等召回率 |
| 0.3 | 0.015 | 极低概率误撞 |
| 0.1 | $3 \times 10^{-6}$ | 几乎不可能误撞 |

> 💡 **LSH 的本质**：用可控的误报率（False Positive）换取计算量的指数级下降。通过调节 $b$ 和 $r$，可以精确控制"相似度高于阈值的文档被召回"的概率。

---

## 七、代码复刻场景：LOW_CONFIDENCE 判定的完整内幕

在代码防作弊或代码库重构审计中，系统经常会抛出如下的实际风控报告结论：

```text
代码 A：function calc(x) { return x * 2; }
代码 B：function calc(x) { let y = x; return y * 2; }

分词规则：基于空白符与标点符号的粗粒度分词，并去除编程语言关键字
Token 集合 A：{function, calc, x, return, x, 2}
Token 集合 B：{function, calc, x, let, y, x, return, y, 2}
去重后：
  A：{function, calc, x, return, 2}（5个）
  B：{function, calc, x, let, y, return, 2}（7个）
交集：{function, calc, x, return, 2}（5个）
并集：{function, calc, x, let, y, return, 2}（7个）

Jaccard 精确值 = 5 / 7 ≈ 0.714
MinHash 估计值（128个哈希值中91个相同） = 91 / 128 ≈ 0.711

系统判定结果: 相似度 > 0.6 阈值 → LOW_CONFIDENCE
```

### 这段结论背后的工业界风控逻辑

代码 B 虽然故意增加了一步变量声明 `let y = x;` 来尝试绕过查重，导致文本分词后的 Token 数量和顺序发生了变化。但通过 128 维度的 MinHash 压缩签名比对，系统迅速捕捉到两者极高概率的同构性，估计出的相似度 0.711 与真实交并集计算出的 0.714 几乎一致。

系统设定了 0.6 作为作弊/重复的警戒线，0.711 跨过了这条线。但为什么被标记为 **LOW_CONFIDENCE（低置信度疑似）** 呢？

**因为系统判定它不像 0.9 那种几乎一字不改的赤裸裸抄袭。** 代码 B 确实经过了结构上的一定伪装和改写。因此，系统给出的潜台词是：

> "该代码骨子里高度涉嫌重构抄袭，但存在修改痕迹。由于置信度较低，不直接一刀切判定，建议触发人工审查或高级抽象语法树（AST）深度检查。"

### 风控阈值设计参考

| 相似度区间 | 系统判定 | 后续动作 |
|-----------|---------|---------|
| $0.9 \sim 1.0$ | **HIGH_CONFIDENCE** | 自动标记抄袭/重复，直接拦截 |
| $0.6 \sim 0.9$ | **LOW_CONFIDENCE** | 疑似抄袭，触发人工复核或 AST 深度分析 |
| $0.3 \sim 0.6$ | **SIMILAR** | 可能为常见模式/巧合，记录日志 |
| $0.0 \sim 0.3$ | **UNIQUE** | 通过，无异常 |

---

## 八、完整 Python 工程实现

```python
"""
MinHash + LSH 工业级实现示例
依赖：mmh3, datasketch（可选，用于对照）
"""

import mmh3
import random
from collections import defaultdict

class MinHashEngine:
    def __init__(self, num_hashes: int = 128, num_bands: int = 16, seed: int = 42):
        self.num_hashes = num_hashes
        self.num_bands = num_bands
        self.rows_per_band = num_hashes // num_bands
        self.seed = seed
        # 预生成随机种子，确保哈希函数独立性
        self.hash_seeds = [seed + i for i in range(num_hashes)]
    
    def _tokenize(self, text: str) -> set:
        """粗粒度分词：按非字母数字字符切分，并转小写去重"""
        import re
        tokens = re.findall(r'[a-zA-Z0-9]+', text.lower())
        return set(tokens)
    
    def compute_signature(self, text: str) -> list:
        """计算文档的 MinHash 签名"""
        tokens = self._tokenize(text)
        signature = []
        for s in self.hash_seeds:
            min_hash = min(
                mmh3.hash(token, seed=s) & 0xFFFFFFFF 
                for token in tokens
            ) if tokens else 0xFFFFFFFF
            signature.append(min_hash)
        return signature
    
    def compute_similarity(self, sig_a: list, sig_b: list) -> float:
        """基于签名估算 Jaccard 相似度"""
        matches = sum(1 for a, b in zip(sig_a, sig_b) if a == b)
        return matches / self.num_hashes
    
    def lsh_buckets(self, signature: list) -> list:
        """生成 LSH 桶 ID 列表（每个 band 一个桶）"""
        buckets = []
        for b in range(self.num_bands):
            start = b * self.rows_per_band
            end = start + self.rows_per_band
            band = tuple(signature[start:end])
            bucket_id = mmh3.hash(str(band), seed=b) & 0xFFFFFFFF
            buckets.append(bucket_id)
        return buckets


# ============ 使用示例 ============

if __name__ == "__main__":
    engine = MinHashEngine(num_hashes=128, num_bands=16)
    
    docs = {
        "doc1": "function calc(x) { return x * 2; }",
        "doc2": "function calc(x) { let y = x; return y * 2; }",
        "doc3": "class User { constructor(name) { this.name = name; } }",
        "doc4": "function multiply(a) { return a * 2; }"
    }
    
    # 1. 计算所有签名
    signatures = {k: engine.compute_signature(v) for k, v in docs.items()}
    
    # 2. 全量比对（小规模可用）
    print("=== 全量 MinHash 相似度 ===")
    names = list(docs.keys())
    for i in range(len(names)):
        for j in range(i+1, len(names)):
            sim = engine.compute_similarity(signatures[names[i]], signatures[names[j]])
            print(f"{names[i]} vs {names[j]}: {sim:.3f}")
    
    # 3. LSH 候选对召回（大规模场景）
    print("\n=== LSH 候选对 ===")
    bucket_map = defaultdict(list)
    for name, sig in signatures.items():
        for bucket in engine.lsh_buckets(sig):
            bucket_map[bucket].append(name)
    
    # 找出共享桶的候选对
    candidates = set()
    for bucket, names_in_bucket in bucket_map.items():
        if len(names_in_bucket) > 1:
            for i in range(len(names_in_bucket)):
                for j in range(i+1, len(names_in_bucket)):
                    pair = tuple(sorted([names_in_bucket[i], names_in_bucket[j]]))
                    candidates.add(pair)
    
    print(f"候选对数量: {len(candidates)}")
    for a, b in candidates:
        sim = engine.compute_similarity(signatures[a], signatures[b])
        print(f"  候选: {a} vs {b} → 相似度 {sim:.3f}")
```

---

## 九、总结：MinHash 的技术演进与选型建议

| 技术方案 | 适用场景 | 时间复杂度 | 空间复杂度 | 精度 |
|---------|---------|-----------|-----------|------|
| 暴力 Jaccard | 文档数 < $10^4$ | $O(N^2 \cdot M)$ | $O(N \cdot M)$ | 精确 |
| MinHash | 文档数 $10^4 \sim 10^7$ | $O(N \cdot M)$ 预处理 + $O(N^2 \cdot N)$ 比对 | $O(N \cdot N)$ | 高概率近似 |
| **MinHash + LSH** | **文档数 $> 10^7$** | $O(N \cdot M)$ 预处理 + $O(\text{候选对} \cdot N)$ | $O(N \cdot N)$ | 高概率近似 + 可控召回 |
| SimHash | 网页去重（汉明距离） | 类似 | $O(N \cdot 64)$ | 适合完全重复检测 |

### 关键要点回顾

1. **Jaccard 是黄金标准**，但 $O(N^2)$ 的比对复杂度使其只能用于小规模精确计算
2. **MinHash 是无偏估计量**，签名长度 $N$ 越大，估计越精确，128/256 是工程甜点
3. **LSH 是性能倍增器**，通过 banding 策略将全量比对转化为候选对召回，实现亚线性检索
4. **分词策略决定上限**：代码场景建议结合 AST tokenization，文本场景建议 n-gram shingling，以获得更鲁棒的相似度度量

MinHash 的价值不仅在于"算得快"，更在于它将**高维稀疏集合**巧妙地映射到了**低维稠密签名**，同时保留了原始集合的相似结构。这种"降维打击"的思想，也是现代向量检索、Embedding 技术的数学源头之一。


## 参考资料
- [文本相似度算法之-minhash](https://zhuanlan.zhihu.com/p/82162303)
- [Kimi K2.6 的回答](https://www.kimi.com/chat/19e9c0ae-d162-8c9f-8000-0990421076e7?chat_enter_method=home)
- [MinHash](https://en.wikipedia.org/wiki/MinHash)
- [MinHash - Fast Jaccard Similarity at Scale](https://arpitbhayani.me/blogs/jaccard-minhash/)
- [MINHASH_LSH](https://milvus.io/docs/zh/minhash-lsh.md)

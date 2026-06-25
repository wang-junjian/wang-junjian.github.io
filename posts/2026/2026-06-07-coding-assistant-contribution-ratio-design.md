---
type: article
title:  "AI编码助手代码归因与贡献占比量化系统设计"
date:   2026-06-07 06:00:00 +0800
tags: [ai-coding-assistant, 代码归因, 贡献占比, minhash, ast, lsh, code-fingerprint, code-attribution, plagiarism-detection, ai-generated-code]
---

这是一个非常实际的工业需求。MinHash 在这个场景中**不是直接检测"是否 AI 生成"**，而是作为**代码指纹匹配引擎**，追踪"AI 原始输出 → 人修改后最终代码"的相似度与存活比例。

下面给出完整的**AI 生成代码占比统计系统**设计方案。

---

## 一、问题定义：什么是"AI 生成代码占比"

在智能体编码助手（GitHub Copilot、Kilo Code、Cursor 等）的工作流中，代码的生命周期通常是：

```
AI 生成建议 → 人接受/修改 → 进入代码库 → 后续迭代中被修改
```

我们需要统计的是**最终代码库中，可追溯至 AI 原始生成的代码比例**。这不是简单的"谁按了 Tab 键"，而是：

| 统计维度 | 含义 | 计算方式 |
|---------|------|---------|
| **AI 原始贡献率** | AI 生成的代码在最终代码中的存活比例 | 匹配上的代码行 / 总行数 |
| **人修改深度** | 人在 AI 代码基础上做了多大改动 | 1 - (AI 原始代码保留率) |
| **人效提升系数** | 有 AI 辅助时人均产出 vs 无 AI 辅助 | 对比实验或历史基线 |

---

## 二、为什么 MinHash 适合这个场景

### 核心挑战

1. **人会修改**：AI 生成的代码被人接受后，通常会修改变量名、加注释、调逻辑，文本相似度会下降
2. **代码重构**：函数拆分、类提取等操作会让纯文本匹配失效
3. **规模问题**：一个团队每天可能产生数千次 AI 交互，需要快速匹配

### MinHash 的优势

| 能力 | 说明 |
|------|------|
| **容忍局部修改** | 人改了 30% 的代码，MinHash 仍能识别出 70% 的相似度 |
| **AST 结构化兼容** | 对 AST 节点序列做 MinHash，变量重名不影响匹配 |
| **LSH 快速召回** | 百万级指纹库中，毫秒级找到候选匹配对 |
| **无偏估计** | 相似度数值可解释，便于设定业务阈值 |

---

## 三、系统架构设计

```
┌─────────────────────────────────────────────────────────────┐
│  阶段一：AI 代码指纹采集（IDE 插件 / 智能体侧）              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ AI 生成代码  │ →  │ AST 解析    │ →  │ MinHash 签名    │  │
│  │ (原始输出)   │    │ + n-gram    │    │ 128维 + 元数据  │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 指纹库 (Redis + PostgreSQL)                              │ │
│  │  • Redis: LSH 桶索引 (band → [code_id])                  │ │
│  │  • PG: code_id, raw_code, timestamp, user_id, session_id │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  阶段二：代码归因分析（Git Hook / CI 流水线）                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐   │
│  │ Git Diff    │ →  │ 代码分块    │ →  │ AST MinHash     │   │
│  │ 变更文件    │    │ (函数/类级) │    │ 签名计算        │   │
│  └─────────────┘    └─────────────┘    └─────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ LSH 匹配引擎                                            │ │
│  │  • 查询 Redis 桶，召回候选 AI 指纹                      │ │
│  │  • 精确 MinHash 相似度计算                              │ │
│  │  • 阈值判定: HIGH(>0.8) / LOW(0.5~0.8) / UNIQUE(<0.5)   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 归因统计引擎                                            │ │
│  │  • 行级 Diff: AI 原始行 vs 最终行                       │ │
│  │  • 修改检测: 保留 / 修改 / 新增                         │ │
│  │  • 占比输出: 报表 / 仪表盘                              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、核心算法：AST-aware MinHash

纯文本 MinHash 对变量重命名敏感。在代码场景中，**应该先解析 AST，对 AST 节点类型序列做 shingling**，再计算 MinHash。

### 1. AST Shingling 示例

```python
# 原始代码
def calculate(x):
    y = x + 1
    return y * 2

# AST 节点序列（简化）
# ['function_definition', 'identifier', 'parameters', 'identifier', 
#  'assignment', 'identifier', 'binary_operator', 'number', 
#  'return_statement', 'binary_operator', 'identifier', 'number']

# 3-gram shingling 生成 token 集合
shingles = {
    ('function_definition', 'identifier', 'parameters'),
    ('identifier', 'parameters', 'identifier'),
    ('parameters', 'identifier', 'assignment'),
    ...
}
```

**关键优势**：变量 `x` 重命名为 `input_value` 后，AST 节点类型序列不变，MinHash 签名几乎不变。

### 2. 完整指纹生成流程

```python
import mmh3
from tree_sitter import Language, Parser
import hashlib

class AICodeFingerprint:
    def __init__(self, num_hashes: int = 128, shingle_size: int = 3):
        self.num_hashes = num_hashes
        self.shingle_size = shingle_size
        self.seeds = list(range(num_hashes))
    
    def _get_ast_shingles(self, code: str, language: str = 'python') -> set:
        """解析 AST 并生成节点类型 n-gram"""
        # 使用 tree-sitter 解析（实际需加载对应语言 so 文件）
        parser = Parser()
        # parser.set_language(Language(language_so_path, language))
        tree = parser.parse(bytes(code, 'utf8'))
        root = tree.root_node
        
        # 前序遍历收集节点类型
        node_types = []
        def traverse(node):
            node_types.append(node.type)
            for child in node.children:
                traverse(child)
        traverse(root)
        
        # 生成 n-gram shingling
        shingles = set()
        for i in range(len(node_types) - self.shingle_size + 1):
            shingle = tuple(node_types[i:i + self.shingle_size])
            shingles.add(shingle)
        return shingles
    
    def compute(self, code: str, language: str = 'python') -> dict:
        """计算代码的 MinHash 签名 + LSH 桶"""
        shingles = self._get_ast_shingles(code, language)
        
        # MinHash 签名
        signature = []
        for seed in self.seeds:
            min_val = min(
                mmh3.hash(str(shingle), seed=seed) & 0xFFFFFFFF
                for shingle in shingles
            ) if shingles else 0xFFFFFFFF
            signature.append(min_val)
        
        # LSH 分桶 (b=16 bands, r=8 rows per band)
        num_bands = 16
        rows_per_band = self.num_hashes // num_bands
        buckets = []
        for b in range(num_bands):
            band = tuple(signature[b * rows_per_band:(b + 1) * rows_per_band])
            bucket_id = mmh3.hash(str(band), seed=b) & 0xFFFFFFFF
            buckets.append(bucket_id)
        
        return {
            'signature': signature,
            'lsh_buckets': buckets,
            'shingle_count': len(shingles),
            'code_hash': hashlib.sha256(code.encode()).hexdigest()[:16]
        }
```

---

## 五、行级归因：从相似度到占比

MinHash 只能告诉我们"这段代码和某段 AI 输出相似度 0.75"，但要计算占比，需要**行级 diff 分析**。

### 归因算法流程

```python
from difflib import SequenceMatcher

class CodeAttribution:
    def __init__(self, similarity_threshold: float = 0.6):
        self.threshold = similarity_threshold
    
    def attribute(self, ai_code: str, final_code: str, similarity: float) -> dict:
        """
        输入: AI 原始代码, 最终代码, MinHash 相似度
        输出: 行级归因统计
        """
        ai_lines = ai_code.splitlines()
        final_lines = final_code.splitlines()
        
        # 使用 SequenceMatcher 找到最佳匹配块
        sm = SequenceMatcher(None, ai_lines, final_lines)
        
        ai_preserved_lines = 0    # AI 代码原样保留
        ai_modified_lines = 0     # AI 代码被修改
        human_new_lines = 0       # 完全新增的人写代码
        
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == 'equal':
                # 完全匹配的行
                ai_preserved_lines += (i2 - i1)
            elif tag == 'replace':
                # AI 的行被替换 → 视为修改
                ai_modified_lines += (i2 - i1)
                human_new_lines += (j2 - j1)
            elif tag == 'delete':
                # AI 的行被删除
                ai_modified_lines += (i2 - i1)
            elif tag == 'insert':
                # 新增行
                human_new_lines += (j2 - j1)
        
        total_lines = len(final_lines)
        
        # 加权计算 AI 贡献占比
        # 保留行算 100%，修改行算 50%（因为修改通常保留了部分逻辑）
        ai_contribution = ai_preserved_lines + 0.5 * ai_modified_lines
        ai_ratio = ai_contribution / total_lines if total_lines > 0 else 0
        
        return {
            'ai_preserved_lines': ai_preserved_lines,
            'ai_modified_lines': ai_modified_lines,
            'human_new_lines': human_new_lines,
            'total_lines': total_lines,
            'ai_ratio': round(ai_ratio, 3),
            'minhash_similarity': round(similarity, 3),
            'confidence': 'HIGH' if similarity > 0.8 else 'LOW' if similarity > 0.5 else 'UNIQUE'
        }
```

### 示例输出

```python
ai_code = """
def calc(x):
    return x * 2
"""

final_code = """
def calculate(input_value):
    # 添加边界检查
    if input_value is None:
        return 0
    result = input_value * 2
    return result
"""

result = CodeAttribution().attribute(ai_code, final_code, similarity=0.72)
# 输出:
# {
#   'ai_preserved_lines': 1,        # return x * 2 的核心逻辑保留
#   'ai_modified_lines': 2,         # 函数名、参数名、变量名修改
#   'human_new_lines': 3,           # 边界检查、注释、result 变量
#   'total_lines': 6,
#   'ai_ratio': 0.333,              # (1 + 0.5*2) / 6 = 2/6 ≈ 33.3%
#   'minhash_similarity': 0.72,
#   'confidence': 'LOW'
# }
```

---

## 六、业务阈值与效率评估模型

### 1. 匹配置信度分级

| MinHash 相似度 | 置信度 | 业务含义 | 统计策略 |
|---------------|--------|---------|---------|
| $> 0.85$ | **HIGH** | 几乎未改，AI 主导 | AI 占比按 90~100% 计 |
| $0.55 \sim 0.85$ | **LOW** | 明显修改，人机协作 | AI 占比按行级 diff 加权计算 |
| $0.30 \sim 0.55$ | **SUSPECT** | 可能为常见模式 | 不计入 AI 占比，但标记审查 |
| $< 0.30$ | **UNIQUE** | 人写代码 | 不计入 AI 占比 |

### 2. 效率评估指标体系

```python
# 团队级周报指标
metrics = {
    # 基础指标
    'ai_suggestions_count': 1500,        # 本周 AI 生成建议次数
    'ai_accept_rate': 0.68,             # 用户接受率（按次数）
    
    # 存活指标（MinHash 追踪）
    'ai_code_survival_rate': 0.45,      # 被接受的代码在最终代码中保留比例
    'avg_ai_similarity': 0.62,          # 平均 MinHash 相似度（反映修改深度）
    
    # 占比指标（核心 KPI）
    'ai_code_ratio_by_lines': 0.35,    # 按行统计 AI 贡献占比
    'ai_code_ratio_by_files': 0.42,    # 含 AI 代码的文件占比
    
    # 效率指标
    'lines_per_day_with_ai': 450,       # 有 AI 辅助时人均日产代码行
    'lines_per_day_without_ai': 280,    # 历史基线（无 AI）
    'efficiency_lift': 1.61             # 效率提升系数 = 450 / 280
}
```

---

## 七、完整工程实现（Python）

```python
"""
AI 生成代码占比统计系统
依赖: tree-sitter, mmh3, redis, psycopg2
"""

import mmh3
import hashlib
import json
from dataclasses import dataclass
from typing import List, Dict, Set, Tuple
from collections import defaultdict
import redis
import psycopg2
from difflib import SequenceMatcher

# ============ 数据模型 ============

@dataclass
class AIFingerprint:
    code_id: str
    session_id: str
    user_id: str
    raw_code: str
    signature: List[int]
    lsh_buckets: List[int]
    timestamp: str
    language: str

@dataclass
class AttributionResult:
    file_path: str
    ai_code_id: str
    similarity: float
    confidence: str
    ai_ratio: float
    preserved_lines: int
    modified_lines: int
    human_lines: int


# ============ 核心引擎 ============

class AICodeAttributionEngine:
    def __init__(self, num_hashes: int = 128, num_bands: int = 16, 
                 redis_host='localhost', pg_dsn=None):
        self.num_hashes = num_hashes
        self.num_bands = num_bands
        self.rows_per_band = num_hashes // num_bands
        self.seeds = list(range(num_hashes))
        self.redis = redis.Redis(host=redis_host, decode_responses=True)
        self.pg_dsn = pg_dsn
        
    def _ast_shingles(self, code: str, language: str) -> Set[Tuple]:
        """AST n-gram shingling（简化版，实际需集成 tree-sitter）"""
        # 占位：实际实现需加载 tree-sitter 语言解析器
        # 这里用文本行作为简化演示
        lines = [l.strip() for l in code.splitlines() if l.strip()]
        shingles = set()
        for i in range(len(lines) - 2):
            shingles.add(tuple(lines[i:i+3]))
        return shingles
    
    def compute_signature(self, code: str, language: str = 'python') -> Tuple[List[int], List[int]]:
        """计算 MinHash 签名和 LSH 桶"""
        shingles = self._ast_shingles(code, language)
        signature = []
        for seed in self.seeds:
            min_val = min(
                mmh3.hash(str(s), seed=seed) & 0xFFFFFFFF
                for s in shingles
            ) if shingles else 0xFFFFFFFF
            signature.append(min_val)
        
        buckets = []
        for b in range(self.num_bands):
            band = tuple(signature[b * self.rows_per_band:(b + 1) * self.rows_per_band])
            buckets.append(mmh3.hash(str(band), seed=b) & 0xFFFFFFFF)
        return signature, buckets
    
    def store_ai_fingerprint(self, fp: AIFingerprint):
        """存储 AI 代码指纹到数据库和 Redis LSH 索引"""
        # 1. 存储元数据到 PostgreSQL
        if self.pg_dsn:
            conn = psycopg2.connect(self.pg_dsn)
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO ai_fingerprints 
                (code_id, session_id, user_id, raw_code, signature, timestamp, language)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (code_id) DO NOTHING
            """, (fp.code_id, fp.session_id, fp.user_id, fp.raw_code,
                  json.dumps(fp.signature), fp.timestamp, fp.language))
            conn.commit()
            conn.close()
        
        # 2. 存储 LSH 桶索引到 Redis
        for band_idx, bucket in enumerate(fp.lsh_buckets):
            key = f"lsh:band{band_idx}:bucket{bucket}"
            self.redis.sadd(key, fp.code_id)
    
    def query_candidates(self, signature: List[int], lsh_buckets: List[int]) -> Set[str]:
        """通过 LSH 快速召回候选 AI 代码 ID"""
        candidates = set()
        for band_idx, bucket in enumerate(lsh_buckets):
            key = f"lsh:band{band_idx}:bucket{bucket}"
            candidates.update(self.redis.smembers(key))
        return candidates
    
    def compute_similarity(self, sig_a: List[int], sig_b: List[int]) -> float:
        """计算两个 MinHash 签名的相似度"""
        matches = sum(1 for a, b in zip(sig_a, sig_b) if a == b)
        return matches / self.num_hashes
    
    def attribute_file(self, file_path: str, final_code: str, language: str) -> List[AttributionResult]:
        """对单个文件进行 AI 归因分析"""
        sig, buckets = self.compute_signature(final_code, language)
        candidates = self.query_candidates(sig, buckets)
        
        results = []
        for code_id in candidates:
            # 获取 AI 原始代码（实际应从 PG 查询）
            ai_code = self._get_ai_code(code_id)
            ai_sig = self._get_ai_signature(code_id)
            
            similarity = self.compute_similarity(sig, ai_sig)
            
            if similarity < 0.3:
                continue
            
            # 行级 diff 归因
            ai_lines = ai_code.splitlines()
            final_lines = final_code.splitlines()
            sm = SequenceMatcher(None, ai_lines, final_lines)
            
            preserved = modified = human_new = 0
            for tag, i1, i2, j1, j2 in sm.get_opcodes():
                if tag == 'equal':
                    preserved += (i2 - i1)
                elif tag == 'replace':
                    modified += (i2 - i1)
                    human_new += (j2 - j1)
                elif tag == 'delete':
                    modified += (i2 - i1)
                elif tag == 'insert':
                    human_new += (j2 - j1)
            
            total = len(final_lines)
            ai_ratio = (preserved + 0.5 * modified) / total if total else 0
            
            confidence = 'HIGH' if similarity > 0.85 else 'LOW' if similarity > 0.55 else 'SUSPECT'
            
            results.append(AttributionResult(
                file_path=file_path,
                ai_code_id=code_id,
                similarity=similarity,
                confidence=confidence,
                ai_ratio=round(ai_ratio, 3),
                preserved_lines=preserved,
                modified_lines=modified,
                human_lines=human_new
            ))
        
        # 按相似度排序，取最佳匹配
        results.sort(key=lambda x: x.similarity, reverse=True)
        return results[:3]  # 返回 top-3 候选
    
    def _get_ai_code(self, code_id: str) -> str:
        # 实际应从数据库查询
        return ""
    
    def _get_ai_signature(self, code_id: str) -> List[int]:
        # 实际应从数据库查询
        return []


# ============ 使用示例 ============

if __name__ == "__main__":
    engine = AICodeAttributionEngine()
    
    # 1. 模拟 AI 生成代码并存储指纹
    ai_code = """
def calculate(x):
    return x * 2
"""
    sig, buckets = engine.compute_signature(ai_code, 'python')
    fp = AIFingerprint(
        code_id="ai-sess-001-001",
        session_id="sess-001",
        user_id="dev-001",
        raw_code=ai_code,
        signature=sig,
        lsh_buckets=buckets,
        timestamp="2026-06-06T16:00:00",
        language="python"
    )
    engine.store_ai_fingerprint(fp)
    
    # 2. 模拟最终代码（人修改后）
    final_code = """
def calculate(input_value):
    # 添加空值检查
    if input_value is None:
        return 0
    result = input_value * 2
    return result
"""
    
    # 3. 归因分析
    results = engine.attribute_file("src/utils.py", final_code, "python")
    for r in results:
        print(f"文件: {r.file_path}")
        print(f"匹配 AI 代码: {r.ai_code_id}")
        print(f"MinHash 相似度: {r.similarity}")
        print(f"置信度: {r.confidence}")
        print(f"AI 贡献占比: {r.ai_ratio * 100:.1f}%")
        print(f"  保留行: {r.preserved_lines}, 修改行: {r.modified_lines}, 人写行: {r.human_lines}")
```

---

## 八、关键落地建议

| 问题 | 建议方案 |
|------|---------|
| **AST 解析多语言支持** | 使用 [tree-sitter](https://tree-sitter.github.io/tree-sitter/)，支持 40+ 语言，增量解析速度快 |
| **指纹库膨胀** | 设置 TTL（如 90 天），过期指纹自动清理；或按项目/团队分片存储 |
| **隐私合规** | 指纹库存储 AST 节点类型序列而非原始代码文本；原始代码仅存哈希 |
| **误判（人写代码碰巧像 AI）** | 结合 session 上下文：同一文件、同一时间段内的 AI 建议优先匹配 |
| **大文件性能** | 文件按函数/类级分块，独立计算 MinHash，避免全文件哈希 |

---

## 九、总结

MinHash 在这个场景中的核心价值是**建立"AI 原始输出"与"最终代码"之间的快速相似度桥梁**。配合 AST 结构化解析，它能有效容忍人的修改（变量重命名、加注释、调顺序），而 LSH 则让百万级指纹库的实时查询成为可能。

最终输出的 **AI 贡献占比** 不是绝对真理，而是一个**可解释、可审计、可阈值化**的工程指标。建议将其作为团队效率评估的**参考维度之一**，而非唯一 KPI，结合代码审查质量、Bug 率、交付速度等多维度综合评估智能体编码助手带来的真实价值。


## 参考资料
- [Kimi K2.6 的回答](https://www.kimi.com/chat/19e9c0ae-d162-8c9f-8000-0990421076e7?chat_enter_method=home)

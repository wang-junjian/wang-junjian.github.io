---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（十一）：部署 OpenAI 开源模型 GPT-OSS"
date:   2025-08-08 12:00:00 +0800
categories: 昇腾 NPU
tags: [昇腾, NPU, 910B4, Atlas800IA2, OpenAI, GPT-OSS, LLM, openEuler]
---

<!--more-->

## 服务器配置

**AI 服务器**：华为 Atlas 800I A2 推理服务器

| 组件 | 规格 |
|---|---|
| **CPU** | 鲲鹏 920（5250） |
| **NPU** | 昇腾 910B4（8X32G） |
| **内存** | 1024GB |
| **硬盘** | **系统盘**：450GB SSDX2 RAID1<br>**数据盘**：3.5TB NVME SSDX4 |
| **操作系统** | openEuler 22.03 LTS |


## 模型下载

```bash
# 魔搭下载 OpenAI gpt-oss-20b-GGUF 模型
modelscope download --model ggml-org/gpt-oss-20b-GGUF --local_dir ggml-org/gpt-oss-20b-GGUF
```

### OpenAI GPT-OSS 模型
#### ModelScope
- [gpt-oss-20b](https://www.modelscope.cn/models/openai-mirror/gpt-oss-20b)
- [gpt-oss-120b](https://www.modelscope.cn/models/openai-mirror/gpt-oss-120b)

#### HuggingFace
- [gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b)
- [gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b)

### OpenAI GPT-OSS GGUF 模型

- [gpt-oss-20b-GGUF](https://www.modelscope.cn/models/ggml-org/gpt-oss-20b-GGUF)
- [gpt-oss-120b-GGUF](https://www.modelscope.cn/models/ggml-org/gpt-oss-120b-GGUF)


## vLLM

### 安装 vLLM

```bash
uv venv
source .venv/bin/activate

uv pip install --pre vllm==0.10.1+gptoss \
    --extra-index-url https://wheels.vllm.ai/gpt-oss/ \
    --index-strategy unsafe-best-match
```

因为服务器使用是 arm64 架构的 CPU，仓库中只有 x86_64 架构的 vLLM 版本。


## 基于 GPUStack 的容器使用 llama-server 部署

### 克隆 llama.cpp 仓库

```bash
cd /data/models
git clone https://github.com/ggml-org/llama.cpp
```

### 进入 GPUStack 容器

```bash
docker exec -it gpustack bash
```

### 安装依赖

```bash
cd /data/models/llama.cpp

dnf install -y cmake
dnf groupinstall -y "Development Tools"
```

### 配置 ascend-toolkit 环境变量

```bash
# 查找 ascend-toolkit 目录
find / -name ascend-toolkit

# 创建软链接
ln -s /data/docker/overlay2/7734f8fa9ff257faa9862f0e256ea1f71d3a238a66808f1480f292572a41a020/diff/usr/local/Ascend/ascend-toolkit /usr/local/Ascend/ascend-toolkit

# 设置环境变量
source /usr/local/Ascend/ascend-toolkit/set_env.sh
```

### 编译 llama.cpp

```bash
cmake -B build -DGGML_CANN=on -DCMAKE_BUILD_TYPE=release -DLLAMA_CURL=OFF
cmake --build build --config release
```

### llama-server 命令行参数

```bash
----- 通用参数 -----

-h,    --help, --usage                  打印使用说明并退出
--version                               显示版本和构建信息
--completion-bash                       打印可用于bash自动补全的脚本
--verbose-prompt                        在生成前打印详细提示（默认：false）
-t,    --threads N                      生成过程中使用的线程数（默认：-1）
                                        （环境变量：LLAMA_ARG_THREADS）
-tb,   --threads-batch N                批处理和提示处理期间使用的线程数（默认：
                                        与--threads相同）
-C,    --cpu-mask M                     CPU亲和性掩码：任意长的十六进制数。与cpu-range互补
                                        （默认：""）
-Cr,   --cpu-range lo-hi                CPU亲和性范围。与--cpu-mask互补
--cpu-strict <0|1>                      使用严格的CPU放置（默认：0）
--prio N                                设置进程/线程优先级：低(-1)、正常(0)、中(1)、高(2)、
                                        实时(3)（默认：0）
--poll <0...100>                        使用轮询级别等待工作（0-不轮询，默认：50）
-Cb,   --cpu-mask-batch M               CPU亲和性掩码：任意长的十六进制数。与cpu-range-batch互补
                                        （默认：与--cpu-mask相同）
-Crb,  --cpu-range-batch lo-hi          CPU亲和性范围。与--cpu-mask-batch互补
--cpu-strict-batch <0|1>                使用严格的CPU放置（默认：与--cpu-strict相同）
--prio-batch N                          设置进程/线程优先级：0-正常，1-中，2-高，3-实时
                                        （默认：0）
--poll-batch <0|1>                      使用轮询等待工作（默认：与--poll相同）
-c,    --ctx-size N                     提示上下文大小（默认：4096，0=从模型加载）
                                        （环境变量：LLAMA_ARG_CTX_SIZE）
-n,    --predict, --n-predict N         要预测的标记数（默认：-1，-1=无限）
                                        （环境变量：LLAMA_ARG_N_PREDICT）
-b,    --batch-size N                   逻辑最大批处理大小（默认：2048）
                                        （环境变量：LLAMA_ARG_BATCH）
-ub,   --ubatch-size N                  物理最大批处理大小（默认：512）
                                        （环境变量：LLAMA_ARG_UBATCH）
--keep N                                从初始提示中保留的标记数（默认：0，-1=
                                        全部）
--swa-full                              使用全尺寸SWA缓存（默认：false）
                                        [（更多信息）](https://github.com/ggml-org/llama.cpp/pull/13194#issuecomment-2868343055)
                                        （环境变量：LLAMA_ARG_SWA_FULL）
--kv-unified, -kvu                      为所有序列的KV缓存使用单个统一的KV缓冲区
                                        （默认：false）
                                        [（更多信息）](https://github.com/ggml-org/llama.cpp/pull/14363)
                                        （环境变量：LLAMA_ARG_KV_SPLIT）
-fa,   --flash-attn                     启用Flash Attention（默认：禁用）
                                        （环境变量：LLAMA_ARG_FLASH_ATTN）
--no-perf                               禁用内部libllama性能计时（默认：false）
                                        （环境变量：LLAMA_ARG_NO_PERF）
-e,    --escape                         处理转义序列（\n, \r, \t, \', \", \\）（默认：true）
--no-escape                             不处理转义序列
--rope-scaling {none,linear,yarn}       RoPE频率缩放方法，默认线性，除非模型指定
                                        （环境变量：LLAMA_ARG_ROPE_SCALING_TYPE）
--rope-scale N                          RoPE上下文缩放因子，将上下文扩展N倍
                                        （环境变量：LLAMA_ARG_ROPE_SCALE）
--rope-freq-base N                      RoPE基础频率，用于NTK感知缩放（默认：从模型加载）
                                        （环境变量：LLAMA_ARG_ROPE_FREQ_BASE）
--rope-freq-scale N                     RoPE频率缩放因子，将上下文扩展1/N倍
                                        （环境变量：LLAMA_ARG_ROPE_FREQ_SCALE）
--yarn-orig-ctx N                       YaRN：模型的原始上下文大小（默认：0=模型训练上下文大小）
                                        （环境变量：LLAMA_ARG_YARN_ORIG_CTX）
--yarn-ext-factor N                     YaRN：外推混合因子（默认：-1.0，0.0=完全内插）
                                        （环境变量：LLAMA_ARG_YARN_EXT_FACTOR）
--yarn-attn-factor N                    YaRN：缩放sqrt(t)或注意力幅度（默认：1.0）
                                        （环境变量：LLAMA_ARG_YARN_ATTN_FACTOR）
--yarn-beta-slow N                      YaRN：高校正维度或alpha（默认：1.0）
                                        （环境变量：LLAMA_ARG_YARN_BETA_SLOW）
--yarn-beta-fast N                      YaRN：低校正维度或beta（默认：32.0）
                                        （环境变量：LLAMA_ARG_YARN_BETA_FAST）
-nkvo, --no-kv-offload                  禁用KV卸载
                                        （环境变量：LLAMA_ARG_NO_KV_OFFLOAD）
-nr,   --no-repack                      禁用权重重新打包
                                        （环境变量：LLAMA_ARG_NO_REPACK）
-ctk,  --cache-type-k TYPE              K的KV缓存数据类型
                                        允许值：f32, f16, bf16, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1
                                        （默认：f16）
                                        （环境变量：LLAMA_ARG_CACHE_TYPE_K）
-ctv,  --cache-type-v TYPE              V的KV缓存数据类型
                                        允许值：f32, f16, bf16, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1
                                        （默认：f16）
                                        （环境变量：LLAMA_ARG_CACHE_TYPE_V）
-dt,   --defrag-thold N                 KV缓存碎片整理阈值（默认：0.1，<0-禁用）
                                        （环境变量：LLAMA_ARG_DEFRAG_THOLD）
-np,   --parallel N                     要解码的并行序列数（默认：1）
                                        （环境变量：LLAMA_ARG_N_PARALLEL）
--mlock                                 强制系统将模型保留在RAM中，而不是交换或压缩
                                        （环境变量：LLAMA_ARG_MLOCK）
--no-mmap                               不内存映射模型（加载较慢，但如果不使用mlock，可能减少页面调出）
                                        （环境变量：LLAMA_ARG_NO_MMAP）
--numa TYPE                             尝试有助于某些NUMA系统的优化
                                        - distribute：在所有节点上均匀分布执行
                                        - isolate：仅在执行开始的节点上的CPU上生成线程
                                        - numactl：使用numactl提供的CPU映射
                                        如果之前未运行过，建议在使用前清除系统页面缓存
                                        参见https://github.com/ggml-org/llama.cpp/issues/1437
                                        （环境变量：LLAMA_ARG_NUMA）
-dev,  --device <dev1,dev2,..>          用于卸载的设备的逗号分隔列表（none=不卸载）
                                        使用--list-devices查看可用设备列表
                                        （环境变量：LLAMA_ARG_DEVICE）
--list-devices                          打印可用设备列表并退出
--override-tensor, -ot <tensor name pattern>=<buffer type>,...
                                        覆盖张量缓冲区类型
--cpu-moe, -cmoe                        将所有混合专家（MoE）权重保留在CPU中
                                        （环境变量：LLAMA_ARG_CPU_MOE）
--n-cpu-moe, -ncmoe N                   将前N层的混合专家（MoE）权重保留在CPU中
                                        （环境变量：LLAMA_ARG_N_CPU_MOE）
-ngl,  --gpu-layers, --n-gpu-layers N   存储在VRAM中的层数
                                        （环境变量：LLAMA_ARG_N_GPU_LAYERS）
-sm,   --split-mode {none,layer,row}    如何在多个GPU之间拆分模型，以下之一：
                                        - none：仅使用一个GPU
                                        - layer（默认）：跨GPU拆分层和KV
                                        - row：跨GPU拆分行
                                        （环境变量：LLAMA_ARG_SPLIT_MODE）
-ts,   --tensor-split N0,N1,N2,...      卸载到每个GPU的模型比例，逗号分隔的比例列表，例如3,1
                                        （环境变量：LLAMA_ARG_TENSOR_SPLIT）
-mg,   --main-gpu INDEX                 用于模型的GPU（当split-mode=none时），或用于中间结果和KV（当split-mode=row时）（默认：0）
                                        （环境变量：LLAMA_ARG_MAIN_GPU）
--check-tensors                         检查模型张量数据是否有无效值（默认：false）
--override-kv KEY=TYPE:VALUE            高级选项，按键覆盖模型元数据。可多次指定。
                                        类型：int, float, bool, str。示例：--override-kv
                                        tokenizer.ggml.add_bos_token=bool:false
--no-op-offload                         禁用将主机张量操作卸载到设备（默认：false）
--lora FNAME                            LoRA适配器的路径（可重复使用多个适配器）
--lora-scaled FNAME SCALE               具有用户定义缩放的LoRA适配器的路径（可重复使用多个适配器）
--control-vector FNAME                  添加控制向量
                                        注意：此参数可重复添加多个控制向量
--control-vector-scaled FNAME SCALE     添加具有用户定义缩放SCALE的控制向量
                                        注意：此参数可重复添加多个缩放的控制向量
--control-vector-layer-range START END
                                        应用控制向量的层范围，开始和结束包含在内
-m,    --model FNAME                    模型路径（默认：如果设置了--hf-file或--model-url，则为`models/$filename`，否则为models/7B/ggml-model-f16.gguf）
                                        （环境变量：LLAMA_ARG_MODEL）
-mu,   --model-url MODEL_URL            模型下载URL（默认：未使用）
                                        （环境变量：LLAMA_ARG_MODEL_URL）
-hf,   -hfr, --hf-repo <user>/<model>[:quant]
                                        Hugging Face模型仓库；quant是可选的，不区分大小写，
                                        默认为Q4_K_M，如果Q4_K_M不存在，则回退到仓库中的第一个文件。
                                        如果可用，mmproj也会自动下载。要禁用，添加--no-mmproj
                                        示例：unsloth/phi-4-GGUF:q4_k_m
                                        （默认：未使用）
                                        （环境变量：LLAMA_ARG_HF_REPO）
-hfd,  -hfrd, --hf-repo-draft <user>/<model>[:quant]
                                        与--hf-repo相同，但用于草稿模型（默认：未使用）
                                        （环境变量：LLAMA_ARG_HFD_REPO）
-hff,  --hf-file FILE                   Hugging Face模型文件。如果指定，它将覆盖--hf-repo中的quant（默认：未使用）
                                        （环境变量：LLAMA_ARG_HF_FILE）
-hfv,  -hfrv, --hf-repo-v <user>/<model>[:quant]
                                        用于声码器模型的Hugging Face模型仓库（默认：未使用）
                                        （环境变量：LLAMA_ARG_HF_REPO_V）
-hffv, --hf-file-v FILE                 用于声码器模型的Hugging Face模型文件（默认：未使用）
                                        （环境变量：LLAMA_ARG_HF_FILE_V）
-hft,  --hf-token TOKEN                 Hugging Face访问令牌（默认：来自HF_TOKEN环境变量的值）
                                        （环境变量：HF_TOKEN）
--log-disable                           禁用日志
--log-file FNAME                        记录到文件
--log-colors                            启用彩色日志
                                        （环境变量：LLAMA_LOG_COLORS）
-v,    --verbose, --log-verbose         将详细程度设置为无限（即记录所有消息，对调试有用）
--offline                               离线模式：强制使用缓存，防止网络访问
                                        （环境变量：LLAMA_OFFLINE）
-lv,   --verbosity, --log-verbosity N   设置详细程度阈值。具有更高详细程度的消息将被忽略。
                                        （环境变量：LLAMA_LOG_VERBOSITY）
--log-prefix                            在日志消息中启用前缀
                                        （环境变量：LLAMA_LOG_PREFIX）
--log-timestamps                        在日志消息中启用时间戳
                                        （环境变量：LLAMA_LOG_TIMESTAMPS）
-ctkd, --cache-type-k-draft TYPE        草稿模型的K的KV缓存数据类型
                                        允许值：f32, f16, bf16, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1
                                        （默认：f16）
                                        （环境变量：LLAMA_ARG_CACHE_TYPE_K_DRAFT）
-ctvd, --cache-type-v-draft TYPE        草稿模型的V的KV缓存数据类型
                                        允许值：f32, f16, bf16, q8_0, q4_0, q4_1, iq4_nl, q5_0, q5_1
                                        （默认：f16）
                                        （环境变量：LLAMA_ARG_CACHE_TYPE_V_DRAFT）


----- 采样参数 -----

--samplers SAMPLERS                     将按顺序用于生成的采样器，用';'分隔
                                        （默认：
                                        penalties;dry;top_n_sigma;top_k;typ_p;top_p;min_p;xtc;temperature）
-s,    --seed SEED                      随机数生成器种子（默认：-1，-1时使用随机种子）
--sampling-seq, --sampler-seq SEQUENCE
                                        用于采样器的简化序列（默认：
                                        edskypmxt）
--ignore-eos                            忽略流结束标记并继续生成（意味着--logit-bias EOS-inf）
--temp N                                温度（默认：0.8）
--top-k N                               top-k采样（默认：40，0=禁用）
--top-p N                               top-p采样（默认：0.9，1.0=禁用）
--min-p N                               min-p采样（默认：0.1，0.0=禁用）
--xtc-probability N                     xtc概率（默认：0.0，0.0=禁用）
--xtc-threshold N                       xtc阈值（默认：0.1，1.0=禁用）
--typical N                             局部典型采样，参数p（默认：1.0，1.0=禁用）
--repeat-last-n N                       考虑惩罚的最后n个标记（默认：64，0=禁用，-1=ctx_size）
--repeat-penalty N                      惩罚重复的标记序列（默认：1.0，1.0=禁用）
--presence-penalty N                    重复alpha存在惩罚（默认：0.0，0.0=禁用）
--frequency-penalty N                   重复alpha频率惩罚（默认：0.0，0.0=禁用）
--dry-multiplier N                      设置DRY采样乘数（默认：0.0，0.0=禁用）
--dry-base N                            设置DRY采样基值（默认：1.75）
--dry-allowed-length N                  设置DRY采样的允许长度（默认：2）
--dry-penalty-last-n N                  为最后n个标记设置DRY惩罚（默认：-1，0=禁用，-1=上下文大小）
--dry-sequence-breaker STRING           为DRY采样添加序列中断符，同时清除默认中断符
                                        （'\n', ':', '"', '*'）；使用"none"不使用任何序列中断符
--dynatemp-range N                      动态温度范围（默认：0.0，0.0=禁用）
--dynatemp-exp N                        动态温度指数（默认：1.0）
--mirostat N                            使用Mirostat采样。
                                        如果使用，Top K、Nucleus和局部典型采样器将被忽略。
                                        （默认：0，0=禁用，1=Mirostat，2=Mirostat 2.0）
--mirostat-lr N                         Mirostat学习率，参数eta（默认：0.1）
--mirostat-ent N                        Mirostat目标熵，参数tau（默认：5.0）
-l,    --logit-bias TOKEN_ID(+/-)BIAS   修改标记出现在补全中的可能性，
                                        例如`--logit-bias 15043+1`增加标记' Hello'的可能性，
                                        或`--logit-bias 15043-1`降低标记' Hello'的可能性
--grammar GRAMMAR                       类似BNF的语法来约束生成（参见grammars/目录中的示例）（默认：''）
--grammar-file FNAME                    读取语法的文件
-j,    --json-schema SCHEMA             用于约束生成的JSON模式（https://json-schema.org/），例如
                                        `{}`表示任何JSON对象
                                        对于带有外部$refs的模式，请使用--grammar +
                                        example/json_schema_to_grammar.py替代
-jf,   --json-schema-file FILE          包含用于约束生成的JSON模式的文件
                                        （https://json-schema.org/），例如`{}`表示任何JSON对象
                                        对于带有外部$refs的模式，请使用--grammar +
                                        example/json_schema_to_grammar.py替代


----- 示例特定参数 -----

--no-context-shift                      禁用无限文本生成时的上下文偏移（默认：禁用）
                                        （环境变量：LLAMA_ARG_NO_CONTEXT_SHIFT）
-r,    --reverse-prompt PROMPT          在PROMPT处停止生成，在交互模式下返回控制权
-sp,   --special                        启用特殊标记输出（默认：false）
--no-warmup                             跳过用空运行预热模型
--spm-infill                            使用Suffix/Prefix/Middle模式进行填充（而不是
                                        Prefix/Suffix/Middle），因为某些模型更喜欢这种方式。（默认：禁用）
--pooling {none,mean,cls,last,rank}     嵌入的池化类型，未指定时使用模型默认值
                                        （环境变量：LLAMA_ARG_POOLING）
-cb,   --cont-batching                  启用连续批处理（也称为动态批处理）（默认：启用）
                                        （环境变量：LLAMA_ARG_CONT_BATCHING）
-nocb, --no-cont-batching               禁用连续批处理
                                        （环境变量：LLAMA_ARG_NO_CONT_BATCHING）
--mmproj FILE                           多模态投影器文件的路径。参见tools/mtmd/README.md
                                        注意：如果使用-hf，则可以省略此参数
                                        （环境变量：LLAMA_ARG_MMPROJ）
--mmproj-url URL                        多模态投影器文件的URL。参见tools/mtmd/README.md
                                        （环境变量：LLAMA_ARG_MMPROJ_URL）
--no-mmproj                             显式禁用多模态投影器，使用-hf时有用
                                        （环境变量：LLAMA_ARG_NO_MMPROJ）
--no-mmproj-offload                     不将多模态投影器卸载到GPU
                                        （环境变量：LLAMA_ARG_NO_MMPROJ_OFFLOAD）
-a,    --alias STRING                   设置模型名称的别名（供REST API使用）
                                        （环境变量：LLAMA_ARG_ALIAS）
--host HOST                             要监听的IP地址，如果地址以.sock结尾则绑定到UNIX套接字（默认：127.0.0.1）
                                        （环境变量：LLAMA_ARG_HOST）
--port PORT                             要监听的端口（默认：8080）
                                        （环境变量：LLAMA_ARG_PORT）
--path PATH                             从中提供静态文件的路径（默认：）
                                        （环境变量：LLAMA_ARG_STATIC_PATH）
--api-prefix PREFIX                     服务器提供服务的前缀路径，不带尾随斜杠
                                        （默认：）
                                        （环境变量：LLAMA_ARG_API_PREFIX）
--no-webui                              禁用Web UI（默认：启用）
                                        （环境变量：LLAMA_ARG_NO_WEBUI）
--embedding, --embeddings               仅限于支持嵌入用例；仅与专用嵌入模型一起使用（默认：禁用）
                                        （环境变量：LLAMA_ARG_EMBEDDINGS）
--reranking, --rerank                   在服务器上启用重排序端点（默认：禁用）
                                        （环境变量：LLAMA_ARG_RERANKING）
--api-key KEY                           用于认证的API密钥（默认：无）
                                        （环境变量：LLAMA_API_KEY）
--api-key-file FNAME                    包含API密钥的文件路径（默认：无）
--ssl-key-file FNAME                    PEM编码的SSL私钥文件的路径
                                        （环境变量：LLAMA_ARG_SSL_KEY_FILE）
--ssl-cert-file FNAME                   PEM编码的SSL证书文件的路径
                                        （环境变量：LLAMA_ARG_SSL_CERT_FILE）
--chat-template-kwargs STRING           为json模板解析器设置附加参数
                                        （环境变量：LLAMA_CHAT_TEMPLATE_KWARGS）
-to,   --timeout N                      服务器读写超时（秒）（默认：600）
                                        （环境变量：LLAMA_ARG_TIMEOUT）
--threads-http N                        用于处理HTTP请求的线程数（默认：-1）
                                        （环境变量：LLAMA_ARG_THREADS_HTTP）
--cache-reuse N                         尝试通过KV移位从缓存中重用的最小块大小
                                        （默认：0）
                                        [（卡片）](https://ggml.ai/f0.png)
                                        （环境变量：LLAMA_ARG_CACHE_REUSE）
--metrics                               启用prometheus兼容的指标端点（默认：禁用）
                                        （环境变量：LLAMA_ARG_ENDPOINT_METRICS）
--slots                                 启用插槽监控端点（默认：禁用）
                                        （环境变量：LLAMA_ARG_ENDPOINT_SLOTS）
--props                                 允许通过POST /props更改全局属性（默认：禁用）
                                        （环境变量：LLAMA_ARG_ENDPOINT_PROPS）
--no-slots                              禁用插槽监控端点
                                        （环境变量：LLAMA_ARG_NO_ENDPOINT_SLOTS）
--slot-save-path PATH                   保存插槽kv缓存的路径（默认：禁用）
--jinja                                 使用jinja模板进行聊天（默认：禁用）
                                        （环境变量：LLAMA_ARG_JINJA）
--reasoning-format FORMAT               控制是否允许从响应中提取思想标签，以及以何种格式返回；以下之一：
                                        - none：将思想未解析地留在`message.content`中
                                        - deepseek：将思想放在`message.reasoning_content`中（流式模式除外，其行为与`none`相同）
                                        （默认：auto）
                                        （环境变量：LLAMA_ARG_THINK）
--reasoning-budget N                    控制允许的思考量；目前仅为以下之一：-1表示无限制思考预算，0表示禁用思考（默认：-1）
                                        （环境变量：LLAMA_ARG_THINK_BUDGET）
--chat-template JINJA_TEMPLATE          设置自定义jinja聊天模板（默认：从模型的元数据中获取模板）
                                        如果指定了suffix/prefix，则模板将被禁用
                                        仅接受常用模板（除非在此标志之前设置了--jinja）：
                                        内置模板列表：
                                        bailing, chatglm3, chatglm4, chatml, command-r, deepseek, deepseek2,
                                        deepseek3, exaone3, exaone4, falcon3, gemma, gigachat, glmedge,
                                        gpt-oss, granite, hunyuan-dense, hunyuan-moe, kimi-k2, llama2,
                                        llama2-sys, llama2-sys-bos, llama2-sys-strip, llama3, llama4, megrez,
                                        minicpm, mistral-v1, mistral-v3, mistral-v3-tekken, mistral-v7,
                                        mistral-v7-tekken, monarch, openchat, orion, phi3, phi4, rwkv-world,
                                        smolvlm, vicuna, vicuna-orca, yandex, zephyr
                                        （环境变量：LLAMA_ARG_CHAT_TEMPLATE）
--chat-template-file JINJA_TEMPLATE_FILE
                                        设置自定义jinja聊天模板文件（默认：从模型的元数据中获取模板）
                                        如果指定了suffix/prefix，则模板将被禁用
                                        仅接受常用模板（除非在此标志之前设置了--jinja）：
                                        内置模板列表：
                                        bailing, chatglm3, chatglm4, chatml, command-r, deepseek, deepseek2,
                                        deepseek3, exaone3, exaone4, falcon3, gemma, gigachat, glmedge,
                                        gpt-oss, granite, hunyuan-dense, hunyuan-moe, kimi-k2, llama2,
                                        llama2-sys, llama2-sys-bos, llama2-sys-strip, llama3, llama4, megrez,
                                        minicpm, mistral-v1, mistral-v3, mistral-v3-tekken, mistral-v7,
                                        mistral-v7-tekken, monarch, openchat, orion, phi3, phi4, rwkv-world,
                                        smolvlm, vicuna, vicuna-orca, yandex, zephyr
                                        （环境变量：LLAMA_ARG_CHAT_TEMPLATE_FILE）
--no-prefill-assistant                  是否在最后一条消息是助手消息时预填充助手的响应（默认：启用预填充）
                                        当设置此标志时，如果最后一条消息是助手消息
                                        那么它将被视为完整消息，不会被预填充
                                        
                                        （环境变量：LLAMA_ARG_NO_PREFILL_ASSISTANT）
-sps,  --slot-prompt-similarity SIMILARITY
                                        请求的提示必须与插槽的提示匹配多少才能使用该插槽（默认：0.50，0.0=禁用）
--lora-init-without-apply               加载LoRA适配器而不应用它们（稍后通过POST /lora-adapters应用）（默认：禁用）
--draft-max, --draft, --draft-n N       用于推测解码的草稿标记数（默认：16）
                                        （环境变量：LLAMA_ARG_DRAFT_MAX）
--draft-min, --draft-n-min N            用于推测解码的最小草稿标记数
                                        （默认：0）
                                        （环境变量：LLAMA_ARG_DRAFT_MIN）
--draft-p-min P                         最小推测解码概率（贪婪）（默认：0.8）
                                        （环境变量：LLAMA_ARG_DRAFT_P_MIN）
-cd,   --ctx-size-draft N               草稿模型的提示上下文大小（默认：0，0=从模型加载）
                                        （环境变量：LLAMA_ARG_CTX_SIZE_DRAFT）
-devd, --device-draft <dev1,dev2,..>    用于卸载草稿模型的设备的逗号分隔列表
                                        （none=不卸载）
                                        使用--list-devices查看可用设备列表
-ngld, --gpu-layers-draft, --n-gpu-layers-draft N
                                        存储在VRAM中的草稿模型的层数
                                        （环境变量：LLAMA_ARG_N_GPU_LAYERS_DRAFT）
-md,   --model-draft FNAME              用于推测解码的草稿模型（默认：未使用）
                                        （环境变量：LLAMA_ARG_MODEL_DRAFT）
--spec-replace TARGET DRAFT             如果草稿模型和主模型不兼容，将TARGET中的字符串转换为DRAFT
-mv,   --model-vocoder FNAME            用于音频生成的声码器模型（默认：未使用）
--tts-use-guide-tokens                  使用引导标记来改进TTS单词回忆
--embd-bge-small-en-default             使用默认的bge-small-en-v1.5模型（注意：可以从互联网下载权重）
--embd-e5-small-en-default              使用默认的e5-small-v2模型（注意：可以从互联网下载权重）
--embd-gte-small-default                使用默认的gte-small模型（注意：可以从互联网下载权重）
--fim-qwen-1.5b-default                 使用默认的Qwen 2.5 Coder 1.5B（注意：可以从互联网下载权重）
--fim-qwen-3b-default                   使用默认的Qwen 2.5 Coder 3B（注意：可以从互联网下载权重）
--fim-qwen-7b-default                   使用默认的Qwen 2.5 Coder 7B（注意：可以从互联网下载权重）
--fim-qwen-7b-spec                      使用Qwen 2.5 Coder 7B + 0.5B草稿进行推测解码（注意：可以从互联网下载权重）
--fim-qwen-14b-spec                     使用Qwen 2.5 Coder 14B + 0.5B草稿进行推测解码（注意：
                                        可以从互联网下载权重）
```

### 启动 llama-server

- 配置环境变量
```bash
export LLAMA_SET_ROWS=1
```

- gpt-oss-20b-GGUF
```bash
CANN_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 ./build/bin/llama-server -a gpt-oss-20b -m /data/models/ggml-org/gpt-oss-20b-GGUF/gpt-oss-20b-mxfp4.gguf -c 0 -fa --jinja --reasoning-format none --gpu-layers 60
```
- `-a gpt-oss-20b` 设置模型名称的别名为 `gpt-oss-20b`。
- `-m /data/models/ggml-org/gpt-oss-20b-GGUF/gpt-oss-20b-mxfp4.gguf` 指定模型文件路径。
- `-c 0` 设置上下文大小为 0。
- `-fa` 启用 Flash Attention。
- `--jinja` 启用 Jinja 模板。
- `--reasoning-format none` 禁用思考格式。
- `--gpu-layers 60` 设置 GPU 层数为 60。指定加载模型时使用的 GPU 层数。

- gpt-oss-120b-GGUF
```bash
CANN_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 ./build/bin/llama-server -a gpt-oss-120b -m /data/models/ggml-org/gpt-oss-120b-GGUF/gpt-oss-120b-mxfp4-00001-of-00003.gguf -c 0 -fa --jinja --reasoning-format none --gpu-layers 60
```
- `-m /data/models/ggml-org/gpt-oss-120b-GGUF/gpt-oss-120b-mxfp4-00001-of-00003.gguf` 指定模型文件路径。如果有多个 GGUF 文件，指定第一个文件。

```bash
build: 6115 (50aa9389) with cc (GCC) 10.3.1 for aarch64-linux-gnu
system info: n_threads = 192, n_threads_batch = 192, total_threads = 192

system_info: n_threads = 192 (n_threads_batch = 192) / 192 | CPU : NEON = 1 | ARM_FMA = 1 | FP16_VA = 1 | DOTPROD = 1 | LLAMAFILE = 1 | OPENMP = 1 | REPACK = 1 | 

main: binding port with default address family
main: HTTP server is listening, hostname: 127.0.0.1, port: 8080, http threads: 191
main: loading model
srv    load_model: loading model '/data/models/ggml-org/gpt-oss-20b-GGUF/gpt-oss-20b-mxfp4.gguf'
llama_model_load_from_file_impl: using device CANN0 (Ascend910B4) - 29812 MiB free
llama_model_load_from_file_impl: using device CANN1 (Ascend910B4) - 29812 MiB free
llama_model_load_from_file_impl: using device CANN2 (Ascend910B4) - 29813 MiB free
llama_model_load_from_file_impl: using device CANN3 (Ascend910B4) - 29812 MiB free
llama_model_load_from_file_impl: using device CANN4 (Ascend910B4) - 29814 MiB free
llama_model_load_from_file_impl: using device CANN5 (Ascend910B4) - 29814 MiB free
llama_model_load_from_file_impl: using device CANN6 (Ascend910B4) - 29814 MiB free
llama_model_load_from_file_impl: using device CANN7 (Ascend910B4) - 29814 MiB free
llama_model_loader: loaded meta data with 34 key-value pairs and 459 tensors from /data/models/ggml-org/gpt-oss-20b-GGUF/gpt-oss-20b-mxfp4.gguf (version GGUF V3 (latest))
llama_model_loader: Dumping metadata keys/values. Note: KV overrides do not apply in this output.
llama_model_loader: - kv   0:                       general.architecture str              = gpt-oss
llama_model_loader: - kv   1:                               general.type str              = model
llama_model_loader: - kv   2:                               general.name str              = Prerelease 100 20b Hf
llama_model_loader: - kv   3:                           general.finetune str              = hf
llama_model_loader: - kv   4:                           general.basename str              = prerelease-100
llama_model_loader: - kv   5:                         general.size_label str              = 20B
llama_model_loader: - kv   6:                        gpt-oss.block_count u32              = 24
llama_model_loader: - kv   7:                     gpt-oss.context_length u32              = 131072
llama_model_loader: - kv   8:                   gpt-oss.embedding_length u32              = 2880
llama_model_loader: - kv   9:                gpt-oss.feed_forward_length u32              = 2880
llama_model_loader: - kv  10:               gpt-oss.attention.head_count u32              = 64
llama_model_loader: - kv  11:            gpt-oss.attention.head_count_kv u32              = 8
llama_model_loader: - kv  12:                     gpt-oss.rope.freq_base f32              = 150000.000000
llama_model_loader: - kv  13:   gpt-oss.attention.layer_norm_rms_epsilon f32              = 0.000010
llama_model_loader: - kv  14:                       gpt-oss.expert_count u32              = 32
llama_model_loader: - kv  15:                  gpt-oss.expert_used_count u32              = 4
llama_model_loader: - kv  16:               gpt-oss.attention.key_length u32              = 64
llama_model_loader: - kv  17:             gpt-oss.attention.value_length u32              = 64
llama_model_loader: - kv  18:           gpt-oss.attention.sliding_window u32              = 128
llama_model_loader: - kv  19:         gpt-oss.expert_feed_forward_length u32              = 2880
llama_model_loader: - kv  20:                  gpt-oss.rope.scaling.type str              = yarn
llama_model_loader: - kv  21:                gpt-oss.rope.scaling.factor f32              = 32.000000
llama_model_loader: - kv  22: gpt-oss.rope.scaling.original_context_length u32              = 4096
llama_model_loader: - kv  23:                       tokenizer.ggml.model str              = gpt2
llama_model_loader: - kv  24:                         tokenizer.ggml.pre str              = gpt-4o
llama_model_loader: - kv  25:                      tokenizer.ggml.tokens arr[str,201088]  = ["!", "\"", "#", "$", "%", "&", "'", ...
llama_model_loader: - kv  26:                  tokenizer.ggml.token_type arr[i32,201088]  = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ...
llama_model_loader: - kv  27:                      tokenizer.ggml.merges arr[str,446189]  = ["Ġ Ġ", "Ġ ĠĠĠ", "ĠĠ ĠĠ", "...
llama_model_loader: - kv  28:                tokenizer.ggml.bos_token_id u32              = 199998
llama_model_loader: - kv  29:                tokenizer.ggml.eos_token_id u32              = 199999
llama_model_loader: - kv  30:            tokenizer.ggml.padding_token_id u32              = 199999
llama_model_loader: - kv  31:                    tokenizer.chat_template str              = {#-\n  In addition to the normal input...
llama_model_loader: - kv  32:               general.quantization_version u32              = 2
llama_model_loader: - kv  33:                          general.file_type u32              = 38
llama_model_loader: - type  f32:  289 tensors
llama_model_loader: - type q8_0:   98 tensors
llama_model_loader: - type mxfp4:   72 tensors
print_info: file format = GGUF V3 (latest)
print_info: file type   = MXFP4 MoE
print_info: file size   = 11.27 GiB (4.63 BPW) 
load: printing all EOG tokens:
load:   - 199999 ('<|endoftext|>')
load:   - 200002 ('<|return|>')
load:   - 200007 ('<|end|>')
load:   - 200012 ('<|call|>')
load: special_eog_ids contains both '<|return|>' and '<|call|>' tokens, removing '<|end|>' token from EOG list
load: special tokens cache size = 21
load: token to piece cache size = 1.3332 MB
print_info: arch             = gpt-oss
print_info: vocab_only       = 0
print_info: n_ctx_train      = 131072
print_info: n_embd           = 2880
print_info: n_layer          = 24
print_info: n_head           = 64
print_info: n_head_kv        = 8
print_info: n_rot            = 64
print_info: n_swa            = 128
print_info: is_swa_any       = 1
print_info: n_embd_head_k    = 64
print_info: n_embd_head_v    = 64
print_info: n_gqa            = 8
print_info: n_embd_k_gqa     = 512
print_info: n_embd_v_gqa     = 512
print_info: f_norm_eps       = 0.0e+00
print_info: f_norm_rms_eps   = 1.0e-05
print_info: f_clamp_kqv      = 0.0e+00
print_info: f_max_alibi_bias = 0.0e+00
print_info: f_logit_scale    = 0.0e+00
print_info: f_attn_scale     = 0.0e+00
print_info: n_ff             = 2880
print_info: n_expert         = 32
print_info: n_expert_used    = 4
print_info: causal attn      = 1
print_info: pooling type     = 0
print_info: rope type        = 2
print_info: rope scaling     = yarn
print_info: freq_base_train  = 150000.0
print_info: freq_scale_train = 0.03125
print_info: n_ctx_orig_yarn  = 4096
print_info: rope_finetuned   = unknown
print_info: model type       = ?B
print_info: model params     = 20.91 B
print_info: general.name     = Prerelease 100 20b Hf
print_info: n_ff_exp         = 2880
print_info: vocab type       = BPE
print_info: n_vocab          = 201088
print_info: n_merges         = 446189
print_info: BOS token        = 199998 '<|startoftext|>'
print_info: EOS token        = 199999 '<|endoftext|>'
print_info: EOT token        = 199999 '<|endoftext|>'
print_info: PAD token        = 199999 '<|endoftext|>'
print_info: LF token         = 198 'Ċ'
print_info: EOG token        = 199999 '<|endoftext|>'
print_info: EOG token        = 200002 '<|return|>'
print_info: EOG token        = 200012 '<|call|>'
print_info: max token length = 256
load_tensors: loading model tensors, this can take a while... (mmap = true)
load_tensors: offloading 24 repeating layers to GPU
load_tensors: offloading output layer to GPU
load_tensors: offloaded 25/25 layers to GPU
load_tensors:   CPU_Mapped model buffer size = 10949.33 MiB
load_tensors:        CANN0 model buffer size =   109.20 MiB
load_tensors:        CANN1 model buffer size =    81.90 MiB
load_tensors:        CANN2 model buffer size =    81.90 MiB
load_tensors:        CANN3 model buffer size =    81.90 MiB
load_tensors:        CANN4 model buffer size =    81.90 MiB
load_tensors:        CANN5 model buffer size =    81.90 MiB
load_tensors:        CANN6 model buffer size =    81.90 MiB
load_tensors:        CANN7 model buffer size =   641.43 MiB
................................................................................
llama_context: constructing llama_context
llama_context: n_seq_max     = 1
llama_context: n_ctx         = 131072
llama_context: n_ctx_per_seq = 131072
llama_context: n_batch       = 2048
llama_context: n_ubatch      = 512
llama_context: causal_attn   = 1
llama_context: flash_attn    = 1
llama_context: kv_unified    = false
llama_context: freq_base     = 150000.0
llama_context: freq_scale    = 0.03125
ggml_backend_cann_context: device 0 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 1 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 2 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 3 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 4 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 5 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 6 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
ggml_backend_cann_context: device 7 async operator submission is OFF
ggml_backend_cann_context: LLAMA_SET_ROWS is ON
llama_context:  CANN_Host  output buffer size =     0.77 MiB
llama_kv_cache_unified_iswa: creating non-SWA KV cache, size = 131072 cells
llama_kv_cache_unified:      CANN0 KV buffer size =   512.00 MiB
llama_kv_cache_unified:      CANN1 KV buffer size =   256.00 MiB
llama_kv_cache_unified:      CANN2 KV buffer size =   512.00 MiB
llama_kv_cache_unified:      CANN3 KV buffer size =   256.00 MiB
llama_kv_cache_unified:      CANN4 KV buffer size =   512.00 MiB
llama_kv_cache_unified:      CANN5 KV buffer size =   256.00 MiB
llama_kv_cache_unified:      CANN6 KV buffer size =   512.00 MiB
llama_kv_cache_unified:      CANN7 KV buffer size =   256.00 MiB
llama_kv_cache_unified: size = 3072.00 MiB (131072 cells,  12 layers,  1/1 seqs), K (f16): 1536.00 MiB, V (f16): 1536.00 MiB
llama_kv_cache_unified_iswa: creating     SWA KV cache, size = 768 cells
llama_kv_cache_unified:      CANN0 KV buffer size =     3.00 MiB
llama_kv_cache_unified:      CANN1 KV buffer size =     3.00 MiB
llama_kv_cache_unified:      CANN2 KV buffer size =     1.50 MiB
llama_kv_cache_unified:      CANN3 KV buffer size =     3.00 MiB
llama_kv_cache_unified:      CANN4 KV buffer size =     1.50 MiB
llama_kv_cache_unified:      CANN5 KV buffer size =     3.00 MiB
llama_kv_cache_unified:      CANN6 KV buffer size =     1.50 MiB
llama_kv_cache_unified:      CANN7 KV buffer size =     1.50 MiB
llama_kv_cache_unified: size =   18.00 MiB (   768 cells,  12 layers,  1/1 seqs), K (f16):    9.00 MiB, V (f16):    9.00 MiB
llama_context:      CANN0 compute buffer size =   396.27 MiB
llama_context:      CANN1 compute buffer size =    34.76 MiB
llama_context:      CANN2 compute buffer size =    34.76 MiB
llama_context:      CANN3 compute buffer size =    34.76 MiB
llama_context:      CANN4 compute buffer size =    34.76 MiB
llama_context:      CANN5 compute buffer size =    34.76 MiB
llama_context:      CANN6 compute buffer size =    34.76 MiB
llama_context:      CANN7 compute buffer size =   398.38 MiB
llama_context:  CANN_Host compute buffer size =   402.27 MiB
llama_context: graph nodes  = 1352
llama_context: graph splits = 194
common_init_from_params: KV cache shifting is not supported for this context, disabling KV cache shifting
common_init_from_params: added <|endoftext|> logit bias = -inf
common_init_from_params: added <|return|> logit bias = -inf
common_init_from_params: added <|call|> logit bias = -inf
common_init_from_params: setting dry_penalty_last_n to ctx_size = 131072
common_init_from_params: warming up the model with an empty run - please wait ... (--no-warmup to disable)
new_pool_for_device: device 0 use vmm pool
new_pool_for_device: device 1 use vmm pool
new_pool_for_device: device 2 use vmm pool
new_pool_for_device: device 3 use vmm pool
new_pool_for_device: device 4 use vmm pool
new_pool_for_device: device 5 use vmm pool
new_pool_for_device: device 6 use vmm pool
new_pool_for_device: device 7 use vmm pool
srv          init: initializing slots, n_slots = 1
slot         init: id  0 | task -1 | new slot n_ctx_slot = 131072
main: model loaded
Knowledge cutoff: 2024-06
Current date: 2025-08-08

reasoning: medium

# Valid channels: analysis, commentary, final. Channel must be included for every message.
Calls to these tools must go to the commentary channel: 'functions'.<|end|><|start|>developer<|message|># Instructions

You are a helpful assistant<|end|><|start|>user<|message|>Hello<|end|><|start|>assistant<|message|>Hi there<|end|><|start|>user<|message|>How are you?<|end|><|start|>assistant'
main: server is listening on http://127.0.0.1:8080 - starting the main loop
srv  update_slots: all slots are idle
```

## 测试 llama-server

### 获取模型列表
```bash
curl -X GET http://127.0.0.1:8080/v1/models
```

### 测试聊天接口
```bash
curl -X POST http://127.0.0.1:8080/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"messages": [{"role": "system", "content": "hello"}], "temperature": 1.0, "max_tokens": 1000, "stream": true, "model": "gpt-oss-20b"}'
```
```bash
srv  params_from_: Chat format: GPT-OSS
slot launch_slot_: id  0 | task 0 | processing task
slot update_slots: id  0 | task 0 | new prompt, n_ctx_slot = 131072, n_keep = 0, n_prompt_tokens = 85
slot update_slots: id  0 | task 0 | kv cache rm [0, end)
slot update_slots: id  0 | task 0 | prompt processing progress, n_past = 85, n_tokens = 85, progress = 1.000000
slot update_slots: id  0 | task 0 | prompt done, n_past = 85, n_tokens = 85
slot      release: id  0 | task 0 | stop processing: n_past = 121, truncated = 0
slot print_timing: id  0 | task 0 | 
prompt eval time =     902.47 ms /    85 tokens (   10.62 ms per token,    94.19 tokens per second)
       eval time =   13932.92 ms /    37 tokens (  376.57 ms per token,     2.66 tokens per second)
      total time =   14835.39 ms /   122 tokens
srv  update_slots: all slots are idle
srv  log_server_r: request: POST /v1/chat/completions 127.0.0.1 200
```

### 多次调用

因为NPU上部署了其它的模型，所以这次性能下降了。

```bash
srv  params_from_: Chat format: GPT-OSS
slot launch_slot_: id  0 | task 0 | processing task
slot update_slots: id  0 | task 0 | new prompt, n_ctx_slot = 131072, n_keep = 0, n_prompt_tokens = 85
slot update_slots: id  0 | task 0 | kv cache rm [0, end)
slot update_slots: id  0 | task 0 | prompt processing progress, n_past = 85, n_tokens = 85, progress = 1.000000
slot update_slots: id  0 | task 0 | prompt done, n_past = 85, n_tokens = 85
slot      release: id  0 | task 0 | stop processing: n_past = 189, truncated = 0
slot print_timing: id  0 | task 0 | 
prompt eval time =    1038.47 ms /    85 tokens (   12.22 ms per token,    81.85 tokens per second)
       eval time =   53335.32 ms /   105 tokens (  507.96 ms per token,     1.97 tokens per second)
      total time =   54373.79 ms /   190 tokens
srv  update_slots: all slots are idle
srv  log_server_r: request: POST /v1/chat/completions 127.0.0.1 200
srv  params_from_: Chat format: GPT-OSS
slot launch_slot_: id  0 | task 106 | processing task
slot update_slots: id  0 | task 106 | new prompt, n_ctx_slot = 131072, n_keep = 0, n_prompt_tokens = 85
slot update_slots: id  0 | task 106 | need to evaluate at least 1 token for each active slot, n_past = 85, n_prompt_tokens = 85
slot update_slots: id  0 | task 106 | kv cache rm [84, end)
slot update_slots: id  0 | task 106 | prompt processing progress, n_past = 85, n_tokens = 1, progress = 0.011765
slot update_slots: id  0 | task 106 | prompt done, n_past = 85, n_tokens = 1
slot      release: id  0 | task 106 | stop processing: n_past = 154, truncated = 0
slot print_timing: id  0 | task 106 | 
prompt eval time =     502.05 ms /     1 tokens (  502.05 ms per token,     1.99 tokens per second)
       eval time =   35725.27 ms /    70 tokens (  510.36 ms per token,     1.96 tokens per second)
      total time =   36227.32 ms /    71 tokens
srv  update_slots: all slots are idle
srv  log_server_r: request: POST /v1/chat/completions 127.0.0.1 200
```


## 参考资料
- [隆重介紹 gpt-oss](https://openai.com/zh-Hans-CN/index/introducing-gpt-oss/)
- [欢迎 GPT OSS —— 来自 OpenAI 的全新开放模型家族！](https://huggingface.co/blog/zh/welcome-openai-gpt-oss)
- [llama.cpp](https://github.com/ggml-org/llama.cpp)
- [Build llama.cpp locally](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md)
- [vLLM -  GPT OSS](https://docs.vllm.ai/projects/recipes/en/latest/OpenAI/GPT-OSS.html)
- [How to run gpt-oss with vLLM](https://cookbook.openai.com/articles/gpt-oss/run-vllm)
- [New Model: OpenAI OSS model support #22265](https://github.com/vllm-project/vllm/issues/22265)
- [GPUStack - Online Installation](https://docs.gpustack.ai/latest/installation/ascend-cann/online-installation/)

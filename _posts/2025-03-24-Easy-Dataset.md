---
layout: post
title:  "Easy Dataset：基于 LLM 微调数据集的工具"
date:   2025-03-24 10:00:00 +0800
categories: Dataset LLM
tags: [Dataset, Alpaca, ShareGPT, LLaMA-Factory, LLM]
---

## 架构

![](/images/2025/EasyDataset/architecture.png)


## 本地运行

### 使用 NPM 安装

1. 克隆仓库：
   

```bash
   git clone https://github.com/ConardLi/easy-dataset.git
   cd easy-dataset
```

2. 安装依赖：
   

```bash
   npm install
```

3. 启动开发服务器：
   

```bash
   npm run build

   npm run start
```

4. 打开浏览器并访问 `http://localhost:1717`

### 使用本地 Dockerfile 构建  

如果你想自行构建镜像，可以使用项目根目录中的 Dockerfile：  

1. 克隆仓库：  
   ```bash
   git clone https://github.com/ConardLi/easy-dataset.git
   cd easy-dataset
   ```  
2. 构建 Docker 镜像：  
   ```bash
   docker build -t easy-dataset .
   ```  
3. 运行容器：  
   ```bash
   docker run -d -p 1717:1717 -v {YOUR_LOCAL_DB_PATH}:/app/local-db --name easy-dataset easy-dataset
   ```  
   **注意：** 请将 `{YOUR_LOCAL_DB_PATH}` 替换为你希望存储本地数据库的实际路径。  

4. 打开浏览器，访问 `http://localhost:1717`


## 首页

![](/images/2025/EasyDataset/home.jpg)


## 项目
### 创建项目

![](/images/2025/EasyDataset/project_create-project.jpg)

### 模型配置

![](/images/2025/EasyDataset/project_model-config.png)

### 任务配置

![](/images/2025/EasyDataset/project_task-config.png)

### 提示词配置

![](/images/2025/EasyDataset/project_prompt-config.png)


## 文献处理

### 上传文件

![](/images/2025/EasyDataset/process_upload-file.png)


### 智能分割

![](/images/2025/EasyDataset/process_intelligent-segmentation.png)

#### 批量生成问题

![](/images/2025/EasyDataset/process_batch-generation-question.png)

### 领域分析

#### 领域树

![](/images/2025/EasyDataset/process_domain-tree.png)


#### 目录结构

![](/images/2025/EasyDataset/process_directory-structure.png)


## 问题管理

### 列表视图
![](/images/2025/EasyDataset/question_list-view.png)

### 领域树视图
![](/images/2025/EasyDataset/question_domain-tree-view.png)

### 问题编辑

![](/images/2025/EasyDataset/question_edit.png)

## 数据集管理

![](/images/2025/EasyDataset/dataset_manage.png)

![](/images/2025/EasyDataset/dataset_detail.png)

### 导出 Alpaca

![](/images/2025/EasyDataset/dataset_export-alpaca.png)

### 导出 ShareGPT

![](/images/2025/EasyDataset/dataset_export-sharegpt.png)

### 导出 LLaMA Factory

![](/images/2025/EasyDataset/dataset_export-llama-factory.png)


## 模型测试

![](/images/2025/EasyDataset/test.png)


## 参考资料
- [Easy Dataset](https://github.com/ConardLi/easy-dataset/blob/main/README.zh-CN.md)

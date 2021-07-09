---
layout: post
title:  "基于模板创建Job"
date:   2021-06-30 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, Job, sed, apply, logs, delete, Python, Jinja2, Jekyll, Liquid]
---

> 基于一个公共的模板运行多个Jobs。 你可以用这种方法来并行执行批处理任务。

## 使用 Shell 脚本
### 创建 Job 模板（job-tmpl.yaml）
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: process-item-$ITEM
  labels:
    jobgroup: jobexample
spec:
  template:
    metadata:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox
        command: ["sh", "-c", "echo Processing item $ITEM && sleep 5"]
      restartPolicy: Never
```
```$ITEM``` 是占位符，在使用的时候进行替换。

### 基于模板生成多个 Job YAML
```shell
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

查看 jobs 目录，可以看到下面的结果。
```shell
$ tree jobs
jobs
├── job-apple.yaml
├── job-banana.yaml
└── job-cherry.yaml
```

### 创建所有的 Job
```shell
$ kubectl apply -f jobs
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

### 通过标签选择器查看 Job
```shell
$ kubectl get jobs -l jobgroup=jobexample
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           45s        49s
process-item-banana   1/1           23s        49s
process-item-cherry   1/1           25s        49s
```

### 通过标签选择器查看 Pod
```shell
$ kubectl get pods -l jobgroup=jobexample
NAME                        READY   STATUS      RESTARTS   AGE
process-item-apple-8wbrb    0/1     Completed   0          56s
process-item-banana-fvj5l   0/1     Completed   0          56s
process-item-cherry-v8npm   0/1     Completed   0          56s
```

### 查看日志
```shell
$ kubectl logs -f -l jobgroup=jobexample
Processing item cherry
Processing item apple
Processing item banana
```

### 删除 Job
```shell
$ kubectl delete jobs -l jobgroup=jobexample
job.batch "process-item-apple" deleted
job.batch "process-item-banana" deleted
job.batch "process-item-cherry" deleted
```

## 使用 Python 的 Jinja 模板语言
### 安装 Jinja2
```shell
pip install --user jinja2
```
```--user``` 可以简写为 ```-U```

### 创建 Job 模板（job.yaml.jinja2）
{% highlight liquid %}
{% raw %}
{%- set params = [{ "name": "apple", "url": "http://dbpedia.org/resource/Apple", },
                  { "name": "banana", "url": "http://dbpedia.org/resource/Banana", },
                  { "name": "cherry", "url": "http://dbpedia.org/resource/Cherry" }]
%}
{%- for p in params %}
{%- set name = p["name"] %}
{%- set url = p["url"] %}
---
apiVersion: batch/v1
kind: Job
metadata:
  name: jobexample-{{ name }}
  labels:
    jobgroup: jobexample
spec:
  template:
    metadata:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
{%- endfor %}
{% endraw %}
{% endhighlight %}

### 设置 render_template 命令，可以加入到 ```~/.bashrc``` 配置文件。
```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

### 生成 Job YAML
```shell
cat job.yaml.jinja2 | render_template > jobs.yaml
```

也可以直接创建 Job 对象
```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

## 参考资料
* [Jobs](https://kubernetes.io/zh/docs/concepts/workloads/controllers/job/)
* [使用展开的方式进行并行处理](https://kubernetes.io/zh/docs/tasks/job/parallel-processing-expansion/)
* [Writing the endraw tag in Jekyll code blocks](https://blog.slaks.net/2013-06-10/jekyll-endraw-in-code/)
* [Markdown 基本语法](https://www.markdown.xyz/basic-syntax/)

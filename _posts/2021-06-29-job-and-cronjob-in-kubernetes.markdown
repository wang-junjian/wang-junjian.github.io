---
layout: post
title:  "Kubernetes中的Job和CronJob"
date:   2021-06-29 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, Job, CronJob, Cron, command, args]
---

## Job
用于处理离线业务的，运行完成后就终止执行。

### 运行一个 Pod 对象
#### 编写 Job 的 YAML 文件（job-pi.yaml）
bc 命令是 Linux 里的“计算器”；-l 表示使用标准数学库；a(1) 是调用数学库中的 arctangent 函数，计算 atan(1)。

tan(π/4) = 1。所以，4*atan(1)正好就是π，也就是 3.1415926…。
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: pi
        image: alpine
        command: ["sh", "-c", "echo 'scale=6000; 4*a(1)' | bc -l"]
```
* restartPolicy: Pod 内所有容器的重启策略。对于 Job 重启策略只能是 OnFailure 和 Never，默认是 Always。
  - OnFailure
  - Never
  - Always(default)

#### 创建 Job 对象
```shell
$ kubectl apply -f job-pi.yaml 
job.batch/pi created
```

#### 查看 Job 创建的所有对象
```shell
$ kubectl get all
NAME           READY   STATUS    RESTARTS   AGE
pod/pi-866nk   1/1     Running   0          2m46s

NAME           COMPLETIONS   DURATION   AGE
job.batch/pi   0/1           2m46s      2m46s
```

运行完成后再次查看，Pod 的状态变为 Completed，不会自动删除，方便您查看日志。
```shell
$ kubectl get all
NAME           READY   STATUS      RESTARTS   AGE
pod/pi-866nk   0/1     Completed   0          11m

NAME           COMPLETIONS   DURATION   AGE
job.batch/pi   1/1           10m        11m
```

#### 日志查看
```shell
$ kubectl logs pod/pi-866nk
3.141592653589793238462643383279502884197169399375105820974944592307\
81640628620899862803482534211706798214808651328230664709384460955058\
......
```

#### 删除 Job 对象，Pod 也会一起被删除。
```shell
$ kubectl delete job pi
job.batch "pi" deleted
```

### Job 对象和 Pod 对象的关联
Kubernetes 会给 Pod 模板自动增加 ```controller-uid``` 标签，创建的每个 Pod 对象都带有这个标签，Job 对象使用标签选择器进行关联。

查看 Job 对象的描述
```shell
$ kubectl describe job pi
Selector:       controller-uid=2b025eb2-3cc2-4a5a-919a-afb1187544f5
Labels:         controller-uid=2b025eb2-3cc2-4a5a-919a-afb1187544f5
                job-name=pi
Pod Template:
  Labels:  controller-uid=2b025eb2-3cc2-4a5a-919a-afb1187544f5
           job-name=pi
```

查看 Pod 对象的描述
```shell
$ kubectl describe pod pi-866nk 
Labels:       controller-uid=2b025eb2-3cc2-4a5a-919a-afb1187544f5
              job-name=pi
```

### 运行多个 Pod 对象
#### 编写 Job 的 YAML 文件（job-multi-pi.yaml）
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  completions: 5
  parallelism: 2
  template:
    spec:
      restartPolicy: Never
      activeDeadlineSeconds: 300
      containers:
      - name: pi
        image: alpine
        command: ["sh", "-c", "echo 'scale=6000; 4*a(1)' | bc -l"]
```
* completions: 希望作业运行多少次
* parallelism: 并行运行多少个作业(Pod)
* activeDeadlineSeconds: Pod 运行时间超过这个时间，终止 Pod，并标记为失败。

#### 创建 Job 对象
```shell
$ kubectl apply -f job-multi-pi.yaml 
job.batch/pi created
```

#### 查看 Job 创建的所有对象
```shell
$ kubectl get all
NAME           READY   STATUS              RESTARTS   AGE
pod/pi-82qd8   0/1     ContainerCreating   0          20s
pod/pi-wzcr8   0/1     ContainerCreating   0          20s

NAME           COMPLETIONS   DURATION   AGE
job.batch/pi   0/5           20s        20s
```

```shell
$ kubectl get all
NAME           READY   STATUS              RESTARTS   AGE
pod/pi-82qd8   0/1     Completed           0          3m34s
pod/pi-dxrrp   1/1     Running             0          28s
pod/pi-r9892   0/1     ContainerCreating   0          11s
pod/pi-wzcr8   0/1     Completed           0          3m34s

NAME           COMPLETIONS   DURATION   AGE
job.batch/pi   2/5           3m34s      3m34s
```

### 限制 Job 任务完成时间
#### 编写 Job 的 YAML 文件（job-pi.yaml）
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  backoffLimit: 2
  template:
    spec:
      restartPolicy: Never
      activeDeadlineSeconds: 60
      containers:
      - name: pi
        image: alpine
        command: ["sh", "-c", "echo 'scale=6000; 4*a(1)' | bc -l"]
```
* backoffLimit: Job 被标记为失败之前可以重试的次数。默认为6。
* activeDeadlineSeconds: Pod 运行时间超过这个时间，终止 Pod，并标记为失败。

#### 创建 Job 对象
```shell
$ kubectl apply -f job-pi.yaml 
job.batch/pi created
```

#### 查看 Job 对象的描述
通过 Pods Statuses 和 Events 属性可以看到失败的情况及原因。
```shell
$ kubectl describe jobs pi
Name:           pi
Namespace:      kubia
Selector:       controller-uid=a42d4024-c4d4-4bc3-a7c6-8d2139ca6310
Labels:         controller-uid=a42d4024-c4d4-4bc3-a7c6-8d2139ca6310
                job-name=pi
Annotations:    Parallelism:  1
Completions:    1
Start Time:     Thu, 08 Jul 2021 01:32:56 +0000
Pods Statuses:  0 Running / 0 Succeeded / 3 Failed
Pod Template:
  Labels:  controller-uid=a42d4024-c4d4-4bc3-a7c6-8d2139ca6310
           job-name=pi
  Containers:
   pi:
    Image:      alpine
    Port:       <none>
    Host Port:  <none>
    Command:
      sh
      -c
      echo 'scale=6000; 4*a(1)' | bc -l
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type     Reason                Age    From            Message
  ----     ------                ----   ----            -------
  Normal   SuccessfulCreate      6m6s   job-controller  Created pod: pi-27f7v
  Normal   SuccessfulCreate      5m6s   job-controller  Created pod: pi-zz2xh
  Normal   SuccessfulCreate      3m55s  job-controller  Created pod: pi-gwkwt
  Warning  BackoffLimitExceeded  2m35s  job-controller  Job has reached the specified backoff limit
```

## CronJob
### 编写 CronJob 的 YAML 文件（cronjob.yaml）
```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: hello
            image: busybox
            args:
            - /bin/sh
            - -c
            - "date; echo Hello Kubernetes"
```
这个 Cron 表达式里 */1 中的 * 表示从 0 开始，/ 表示“每”，1 表示偏移量。所以，它的意思就是：从 0 开始，每 1 个时间单位执行一次。
* schedule: 标准的 [Unix Cron](https://www.educba.com/crontab-in-unix/) 表达式。

### Cron 时间表语法
```
# ┌───────────── 分钟 (0 - 59)
# │ ┌───────────── 小时 (0 - 23)
# │ │ ┌───────────── 月的某天 (1 - 31)
# │ │ │ ┌───────────── 月份 (1 - 12)
# │ │ │ │ ┌───────────── 周的某天 (0 - 6) （周日到周一；在某些系统上，7 也是星期日）
# │ │ │ │ │                                   
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

### 创建 CronJob 对象
```shell
$ kubectl apply -f cronjob.yaml 
cronjob.batch/hello created
```

### 查看 CronJob 创建的所有对象
通过观察一段时间，发现 Job 和 Pod 对象并不会一直存在，会保留最近成功运行的 3 个作业。可以根据自己的需要来设置 spec.successfulJobsHistoryLimit。

```shell
$ kubectl get all
NAME                         READY   STATUS      RESTARTS   AGE
pod/hello-1625713980-x2999   0/1     Completed   0          2m55s
pod/hello-1625714040-jkj5r   0/1     Completed   0          115s
pod/hello-1625714100-m2kgf   0/1     Completed   0          55s

NAME                         COMPLETIONS   DURATION   AGE
job.batch/hello-1625713980   1/1           19s        2m55s
job.batch/hello-1625714040   1/1           17s        115s
job.batch/hello-1625714100   1/1           23s        55s

NAME                  SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/hello   */1 * * * *   False     0        57s             23m
```

### 任务的运行方式
当前任务没有执行完成，要创建新任务的策略
* concurrencyPolicy
  - Allow(default)　任务可以同时存在。
  - Forbid　不会创建新的任务，该创建周期被跳过。
  - Replace　新的任务会替换旧的没有执行完的。

### startingDeadlineSeconds
对于每个 CronJob，CronJob 控制器（Controller） 检查从上一次调度的时间点到现在所错过了调度次数。如果错过的调度次数超过 100 次， 那么它就不会启动这个任务.需要注意的是，如果 startingDeadlineSeconds 字段非空，则控制器会统计从 startingDeadlineSeconds 设置的值到现在而不是从上一个计划时间到现在错过了多少次 Job。 例如，如果 startingDeadlineSeconds 是 200，则控制器会统计在过去 200 秒中错过了多少次 Job。未能在调度时间内创建 CronJob，则计为错过(miss)。

## 参考资料
* [Jobs](https://kubernetes.io/zh/docs/concepts/workloads/controllers/job/)
* [CronJob](https://kubernetes.io/zh/docs/concepts/workloads/controllers/cron-jobs/)
* [Crontab in Unix](https://www.educba.com/crontab-in-unix/)

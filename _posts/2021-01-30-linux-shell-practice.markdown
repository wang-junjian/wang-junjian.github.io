---
layout: post
title:  "Linux Shell 实践"
date:   2021-01-30 00:00:00 +0800
categories: Linux 实践
tags: [Linux, Shell, if]
---

## 重定向
* 执行时的错误信息输出到文件(```2>```)
```shell
hello 2> log.error
```
```
$ cat log.error 
-bash: hello: 未找到命令
```

* 执行时的所有信息都输出到文件(```&>```)
```shell
echo hello &> log.info
```
```
$ cat log.info 
hello
```

* 创建一个文件并写入内容(```> filename <<EOF```)
```shell
cat > hello.sh << EOF
#!/bin/bash
echo hello
EOF
```

## 变量
### 变量赋值
* 执行结果保存到变量(```$()``` ``)
```shell
var1=$(pwd)
var2=`pwd`
```

* 整数四则运算(```let```)
```shell
let n=10-3+4/2
echo $n
```
```
9
```

### 变量引用
* ```${var}``` 大部分情况可省略为 ```$var```
```shell
str="hello world"
echo $str ${str}123
```

### 变量作用范围
* 默认只在当前shell中生效
```shell
$ str="hello world"
$ echo $str
hello world
$ bash
$ echo $str
$ exit
$ echo $str
hello world
```

* 四种执行模式运行
```shell
$ vim test.sh
#!/bin/bash
echo $str
$ chmod u+x test.sh
$ bash test.sh 
$ ./test.sh 
$ source test.sh 
hello world
$ . test.sh 
hello world
```

* 导出变量(```export```)，父进程定义的变量子进程可见。
```shell
$ export str
$ bash test.sh 
hello world
$ source test.sh 
hello world
```

* 移除变量(```unset```)
```shell
$ unset str
$ echo $str
```

### 环境变量配置文件
* /etc/profile
* /etc/profile.d
* ~/.bash_profile
* ~/.bashrc
* /etc/bashrc

#### su - root 执行顺序
1. /etc/profile
2. ~/.bash_profile
3. ~/.bashrc
4. /etc/bashrc

#### su root 执行顺序
1. ~/.bashrc
2. /etc/bashrc

#### 修改后的配置文件在当前Shell生效
```shell
source ~/.bashrc
```

### 环境变量
* ```env``` 查看命令
* ```$PATH``` 命令的搜索路径
* ```$PS1``` bash提示符

### 预定义变量
* ```$?``` 上一个命令执行的错误码
```shell
$ ifconfig
$ echo $?
0
$ ifconfig eth
$ echo $?
1
```

* ```$$``` 当前进程ID
```shell
$ echo $$
26102
```

* ```$0``` 当前进程名
```shell
$ echo $0
-bash
```

### 位置变量 ```$1 $2 $3 ... $N```
```shell
vim test.sh
```
```shell
echo $1 $2 $3 $4 $5 $6 $7 $8 $9 ${10} ${11} ${12-DEFAULT_VALUE}

if [ -z ${12} ]
then
  echo "NULL"
else
  echo "NOT NULL"
fi
```
```shell
$ chmod u+x test.sh
$ ./test.sh 1 2 3 4 5 6 7 8 9 10 11
1 2 3 4 5 6 7 8 9 10 11 DEFAULT_VALUE
NULL
$ ./test.sh 1 2 3 4 5 6 7 8 9 10 11 12
1 2 3 4 5 6 7 8 9 10 11 12
NOT NULL
```
* 位置值超过9后需要使用花括号 ```${N}```
* 没有传入值变量为空，可以给一个默认值 ```${N-DEFAULT_VALUE}```

### 数组
* 定义数组
```shell
ips=(10.0.0.1 10.0.0.2 10.0.0.3)
```

* 显示所有数组元素
```shell
$ echo ${ips[@]}
10.0.0.1 10.0.0.2 10.0.0.3
```

* 数组元素个数
```shell
$ echo ${#ips[@]}
3
```

* 数组取值
```shell
$ echo ${ips}
10.0.0.1
$ echo ${ips[0]}
10.0.0.1
$ echo ${ips[2]} ${ips[-1]}
10.0.0.3 10.0.0.3
```

### 引用
* 单引号（完全引用）
```shell
$ name=wjj
$ echo 'Hello $name!'
Hello $name!
```

* 双引号（不完全引用）
```shell
$ name=wjj
$ echo "Hello $name!"
Hello wjj!
```

* 反引号（执行命令）
```shell
$ echo `pwd`
/root
```

## 运算符
* 赋值运算符
```shell
$ let n=4+5
$ echo $n
9
$ ((n=4+5))
$ echo $n
9
$ ((n++))
$ echo $n
10
$ echo $((3+4))
7
```

* 算术运算符（+ - * / ** %）
```shell
$ expr 4 + 5
9
```

## 参考资料
* [Bash shell find out if a variable has NULL value OR not](https://www.cyberciti.biz/faq/bash-shell-find-out-if-a-variable-has-null-value-or-not/)
* [Bash For Loop Examples](https://www.cyberciti.biz/faq/bash-for-loop/)
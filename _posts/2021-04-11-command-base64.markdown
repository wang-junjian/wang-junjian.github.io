---
layout: post
title:  "命令base64"
date:   2021-04-11 00:00:00 +0800
categories: Command
tags: [Linux, base64, echo, printf]
---

```YWRtaW4=``` 是 ```admin``` 的 base64 编码。

* 解码（正确，这里之所以正确是因为base64过滤了。）
```shell
$ echo 'YWRtaW4=' | base64 -d
admin[username@hostname ~]$
```

* 编码（错误，这是因为 echo 输出字符后会在后面再输出换行符。）
```shell
$ echo 'admin' | base64
YWRtaW4K
```

## 解决方案

* 方法一：使用 ```printf``` 命令。
```shell
$ printf 'admin' | base64
YWRtaW4=
```

* 方法二：可以通过参数 ```-n``` 告诉 echo 不输出换行符。
```shell
$ echo -n 'admin' | base64
YWRtaW4=
```

* 方法三：可以通过参数 ```-e``` 告诉 echo 启用反斜杠转义的解释。
```shell
$ echo -e 'admin\c' | base64
YWRtaW4=
```
可用的转义符（来自 man echo）：
    - \\     backslash
    - \a     alert (BEL)
    - \b     backspace
    - \c     produce no further output
    - \e     escape
    - \f     form feed
    - \n     new line
    - \r     carriage return
    - \t     horizontal tab
    - \v     vertical tab
    - \0NNN  byte with octal value NNN (1 to 3 digits)
    - \xHH   byte with hexadecimal value HH (1 to 2 digits)

## 参考资料
* [“echo -n” prints “-n”](https://stackoverflow.com/questions/11193466/echo-n-prints-n)
* [How to echo out things without a newline?](https://stackoverflow.com/questions/38021348/how-to-echo-out-things-without-a-newline)

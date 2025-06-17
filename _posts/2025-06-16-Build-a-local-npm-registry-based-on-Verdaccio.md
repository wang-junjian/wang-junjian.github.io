---
layout: single
title:  "Verdaccio：构建与管理内网 npm 仓库的实践指南"
date:   2025-06-16 20:00:00 +0800
categories: Verdaccio npm
tags: [Verdaccio, npm, Registry, 离线, 内网部署]
---

本文档提供了一份关于**使用 Verdaccio 搭建本地 npm 仓库**的指南。它详细介绍了**如何通过 Docker 拉取 Verdaccio 镜像**，以及**配置目录结构和 YAML 配置文件**的步骤。此外，文章还展示了**通过 Docker 或 Docker Compose 部署 Verdaccio 的方法**，并演示了**如何使用 npm 命令**（如安装、发布和下载包）**与本地 Verdaccio 仓库进行交互**。最后，内容涵盖了**Verdaccio 的自动缓存机制**以及**用户创建和登录操作**。

<!--more-->

## [什么是 Verdaccio](https://verdaccio.org/zh-CN/docs/what-is-verdaccio)

**Verdaccio** 一个基于 Node.js 的轻量级私有仓库

## 下载镜像

```bash
docker pull verdaccio/verdaccio
```


## 配置

### 创建目录结构

在本地创建一个目录结构来存储 Verdaccio 的配置文件、插件和存储数据。

```bash
mkdir -p ./verdaccio/conf
mkdir -p ./verdaccio/plugins
mkdir -p ./verdaccio/storage
```

### 创建配置文件

编辑文件 `verdaccio/conf/config.yaml`。
> 可以拷贝文件 [https://github.com/verdaccio/verdaccio/blob/5.x/conf/docker.yaml](https://github.com/verdaccio/verdaccio/blob/5.x/conf/docker.yaml) 的内容到 `config.yaml` 中，并根据需要进行修改。

```yaml
#
# This is the default configuration file. It allows all users to do anything,
# please read carefully the documentation and best practices to
# improve security.
#
# Do not configure host and port under `listen` in this file
# as it will be ignored when using docker.
# see https://verdaccio.org/docs/en/docker#docker-and-custom-port-configuration
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/5.x/conf
#
# Read about the best practices
# https://verdaccio.org/docs/best

# path to a directory with all packages
storage: /verdaccio/storage/data
# path to a directory with plugins to include
plugins: /verdaccio/plugins

# https://verdaccio.org/docs/webui
web:
  title: Verdaccio
  # comment out to disable gravatar support
  # gravatar: false
  # by default packages are ordercer ascendant (asc|desc)
  # sort_packages: asc
  # convert your UI to the dark side
  # darkMode: true
  # html_cache: true
  # by default all features are displayed
  # login: true
  # showInfo: true
  # showSettings: true
  # In combination with darkMode you can force specific theme
  # showThemeSwitch: true
  # showFooter: true
  # showSearch: true
  # showRaw: true
  # showDownloadTarball: true
  #  HTML tags injected after manifest <scripts/>
  # scriptsBodyAfter:
  #    - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
  #  HTML tags injected before ends </head>
  #  metaScripts:
  #    - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
  #    - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
  #    - '<meta name="robots" content="noindex" />'
  #  HTML tags injected first child at <body/>
  #  bodyBefore:
  #    - '<div id="myId">html before webpack scripts</div>'
  #  Public path for template manifest scripts (only manifest)
  #  publicPath: http://somedomain.org/

# https://verdaccio.org/docs/configuration#authentication
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    # Maximum amount of users allowed to register, defaults to "+infinity".
    # You can set this to -1 to disable registration.
    # max_users: 1000
    # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
    # algorithm: bcrypt # by default is crypt, but is recommended use bcrypt for new installations
    # Rounds number for "bcrypt", will be ignored for other algorithms.
    # rounds: 10

# https://verdaccio.org/docs/configuration#uplinks
# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/

# Learn how to protect your packages
# https://verdaccio.org/docs/protect-your-dependencies/
# https://verdaccio.org/docs/configuration#packages
packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $all
    unpublish: $authenticated
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    access: $all

    # allow all known users to publish/publish packages
    # (anyone can register by default, remember?)
    publish: $authenticated
    unpublish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# To improve your security configuration and  avoid dependency confusion
# consider removing the proxy property for private packages
# https://verdaccio.org/docs/best#remove-proxy-to-increase-security-at-private-packages

# https://verdaccio.org/docs/configuration#server
# You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
# A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
# WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
server:
  keepAliveTimeout: 60
  # Allow `req.ip` to resolve properly when Verdaccio is behind a proxy or load-balancer
  # See: https://expressjs.com/en/guide/behind-proxies.html
  # trustProxy: '127.0.0.1'

# https://verdaccio.org/docs/configuration#offline-publish
# publish:
#   allow_offline: false

# https://verdaccio.org/docs/configuration#url-prefix
# url_prefix: /verdaccio/
# VERDACCIO_PUBLIC_URL='https://somedomain.org';
# url_prefix: '/my_prefix'
# // url -> https://somedomain.org/my_prefix/
# VERDACCIO_PUBLIC_URL='https://somedomain.org';
# url_prefix: '/'
# // url -> https://somedomain.org/
# VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
# url_prefix: '/second_prefix'
# // url -> https://somedomain.org/second_prefix/'

# https://verdaccio.org/docs/configuration#security
# security:
#   api:
#     legacy: true
#     # recomended set to true for older installations
#     migrateToSecureLegacySignature: true
#     jwt:
#       sign:
#         expiresIn: 29d
#       verify:
#         someProp: [value]
#    web:
#      sign:
#        expiresIn: 1h # 1 hour by default
#      verify:
#         someProp: [value]

# https://verdaccio.org/docs/configuration#user-rate-limit
# userRateLimit:
#   windowMs: 50000
#   max: 1000

# https://verdaccio.org/docs/configuration#max-body-size
# max_body_size: 10mb

# https://verdaccio.org/docs/configuration#listen-port
# listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket

# The HTTPS configuration is useful if you do not consider use a HTTP Proxy
# https://verdaccio.org/docs/configuration#https
# https:
#   key: ./path/verdaccio-key.pem
#   cert: ./path/verdaccio-cert.pem
#   ca: ./path/verdaccio-csr.pem

# https://verdaccio.org/docs/configuration#proxy
# http_proxy: http://something.local/
# https_proxy: https://something.local/

# https://verdaccio.org/docs/configuration#notifications
# notify:
#   method: POST
#   headers: [{ "Content-Type": "application/json" }]
#   endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
#   content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'

middlewares:
  audit:
    enabled: true

# https://verdaccio.org/docs/logger
# log settings
log: { type: stdout, format: pretty, level: http }
#experiments:
#  # support for npm token command
#  token: false
#  # enable tarball URL redirect for hosting tarball with a different server, the tarball_url_redirect can be a template string
#  tarball_url_redirect: 'https://mycdn.com/verdaccio/${packageName}/${filename}'
#  # the tarball_url_redirect can be a function, takes packageName and filename and returns the url, when working with a js configuration file
#  tarball_url_redirect(packageName, filename) {
#    const signedUrl = // generate a signed url
#    return signedUrl;
#  }

# translate your registry, api i18n not available yet
# i18n:
# list of the available translations https://github.com/verdaccio/verdaccio/blob/master/packages/plugins/ui-theme/src/i18n/ABOUT_TRANSLATIONS.md
#   web: en-US
```

- **access: $all** - 允许所有用户访问所有包。
- **publish: $all** - 允许所有用户发布包。
- **proxy: npmjs** - 如果本地没有找到包，则从 npmjs 上代理请求。


## 部署

### Docker
```bash
docker run -d --name verdaccio \
  -p 4873:4873 \
  -v ./verdaccio/conf:/verdaccio/conf \
  -v ./verdaccio/plugins:/verdaccio/plugins \
  -v ./verdaccio/storage:/verdaccio/storage \
  verdaccio/verdaccio
```

### Docker Compose

编辑文件：`docker-compose.yml`

```yaml
version: '3.8'

services:
  verdaccio:
    image: verdaccio/verdaccio
    container_name: 'verdaccio'
    networks:
      - node-network
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - '4873:4873'
    volumes:
      - './verdaccio/storage:/verdaccio/storage'
      - './verdaccio/conf:/verdaccio/conf'
      - './verdaccio/plugins:/verdaccio/plugins'
networks:
  node-network:
    driver: bridge
```

```bash
docker compose up -d
```

登录 Verdaccio Web UI： [http://localhost:4873](http://localhost:4873)

![](/images/2025/Verdaccio/webui.png)


## npm 命令

[npmjs](https://registry.npmjs.org/)(https://registry.npmjs.org/)

### 安装
```bash
npm install pyroprompts-any-chat-completions-mcp-0.1.1.tgz
```

### 发布
```bash
npm publish pyroprompts-any-chat-completions-mcp-0.1.1.tgz
```

### 下载
```bash
npm pack @pyroprompts/any-chat-completions-mcp
```
```bash
pyroprompts-any-chat-completions-mcp-0.1.1.tgz
```

### 打包
```bash
npm pack
```

### 配置文件路径

- 获取用户配置文件路径
```bash
npm config get userconfig
```

- 获取全局配置文件路径
```bash
npm config get globalconfig
```

### npm 缓存

#### 查看缓存路径
```bash
npm config get cache
```
- 默认缓存路径：
    - Linux/macOS：~/.npm
    - Windows：%AppData%\npm-cache

#### 查看缓存内容
```bash
npm cache ls
```

#### 查看缓存包
```bash
npm cache ls pyroprompts-any-chat-completions-mcp
```

#### 清除缓存
```bash
npm cache clean --force
```

### 全局 npm 配置

配置文件：`~/.npmrc`

#### 查看当前 npm 源
```bash
npm config get registry
```
```bash
https://registry.npmjs.org/
```

#### 查看当前 npm 配置
```bash
npm config list
```
```bash
; "user" config from /Users/junjian/.npmrc

//localhost:4873/:_authToken = (protected)
registry = "https://registry.npmjs.org/"
strict-ssl = true

; node bin location = /Users/junjian/.nvm/versions/node/v22.5.1/bin/node
; node version = v22.5.1
; npm local prefix = /Users/junjian/GitHub/mcphub
; npm version = 10.8.2
; cwd = /Users/junjian/GitHub/mcphub/custom/verdaccio
; HOME = /Users/junjian
; Run `npm config ls -l` to show all defaults.
```

#### 设置 npm 源
```bash
npm config set registry http://localhost:4873
```


## 使用（Verdaccio）

### 创建用户

```bash
npm adduser --registry http://localhost:4873
```
```bash
npm notice Log in on http://localhost:4873/
Username: admin
Password: 
Email: (this IS public) 
⠦

Logged in on http://localhost:4873/.
```

**创建用户时会自动登录。**

### 登录

```bash
npm login --registry http://localhost:4873                                                 
```
```bash
npm notice Log in on http://localhost:4873/
Username: admin
Password: 

Logged in on http://localhost:4873/.
```

### 自动缓存

- **proxy: npmjs** - 必须为包作用域（如 @*/* 或 **）启用代理，否则 Verdaccio 只会检查本地存储。
- **publish: $all** - 允许所有用户发布包。

#### 下载

```bash
npm pack @pyroprompts/any-chat-completions-mcp --registry http://localhost:4873
```

⚠️ `npm pack` 命令如果本地有缓存，不会真正去下载 .tgz 文件，所以您在 Verdaccio 中看不到下载的包。使用 `npm cache clean --force` 清除缓存后，再次运行 `npm pack` 命令。


#### 安装

```bash
npm install @pyroprompts/any-chat-completions-mcp --registry http://localhost:4873
```

⚠️ `npm install` 命令如果本地有缓存，不会真正去下载 .tgz 文件，所以您在 Verdaccio 中看不到下载的包。使用 `npm cache clean --force` 清除缓存后，再次运行 `npm install` 命令。

### 发布
```bash
npm publish --registry http://localhost:4873 pyroprompts-any-chat-completions-mcp-0.1.1.tgz
```

### 设置 npm 源

如果您希望 npm 使用本地 Verdaccio 仓库作为默认源，可以运行以下命令：

```bash
npm set registry http://localhost:4873
```


## 参考资料
- [Verdaccio](https://verdaccio.org/zh-CN/)
- [GitHub Verdaccio](https://github.com/verdaccio/verdaccio)
- [什么是 Verdaccio？](https://verdaccio.org/zh-CN/docs/what-is-verdaccio)
- [Verdaccio Docker](https://verdaccio.org/zh-cn/docs/docker/)
- [any-chat-completions-mcp](https://github.com/pyroprompts/any-chat-completions-mcp)

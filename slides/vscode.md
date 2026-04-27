---
marp: true
paginate: true
style: |
    h1 {
        font-size: 3em;
        text-align: center;
    }
    a {
        text-decoration: none;
    }
---

<!--footer: ©2023 王军建-->
# Visual Studio Code

---
# [Visual Studio Code](https://code.visualstudio.com/)
# 配置
---

## 初始化配置
- 侧边栏 运行和调试
- Ctrl + Shift + D

![bg contain right:60%](images/vscode/debug-start.png)

*.vscode/launch.json*

[VS Code 中的 Python 调试](https://code.visualstudio.com/docs/python/debugging)

---

## 常用配置

- "justMyCode": false # 调试可以进入第三方库
- "autoReload": { "enable": true } # 修改后自动重载
- "env": { "FLASK_DEBUG": "0" } # 设置环境变量

---

## Python: Current File

```json
{
    "name": "Python: Current File",
    "type": "python",
    "request": "launch",
    "program": "${file}",
    "console": "integratedTerminal",
    "autoReload": {
        "enable": true
    }
}
```


---

## Python: FastAPI 

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: FastAPI",
            "type": "python",
            "request": "launch",
            "module": "uvicorn",
            "args": [
                "app.main:app",
                "--reload"
            ],
            "jinja": true,
            "justMyCode": false,
        }
    ]
}
```

---

## Python: Flask

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Flask",
            "type": "python",
            "request": "launch",
            "module": "flask",
            "env": {
                "FLASK_APP": "${workspaceFolder}/app/main.py",
                "FLASK_ENV": "development",
                "FLASK_DEBUG": "0"
            },
            "args": [
                "run",
                "--no-debugger",
                "--no-reload"
            ],
            "jinja": true,
            "justMyCode": false
        }
    ]
}
```

---

## 预览窗口在另一个显示器中显示

**按快捷键** ```Command + Shift + P```
**输入** `Workspace: Duplicate As Workspace in New Window`

> 有一点问题是，滚动编写代码时，预览窗口不会跟着滚动。

---
# 插件
---

## 开发工具

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
- [GitHub Copilot Labs](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-labs)
- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

---

## 办公工具

- 转换 Markdown 到 PDF [Markdown PDF](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf)
- 编写幻灯片 [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
<!--
- [GitHub: Marp for VS Code](https://github.com/marp-team/marp-vscode)
- [Marpit Markdown](https://marpit.marp.app/markdown)
-->
- 显示 PDF [vscode-pdf](https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf)
- 编写 SVG [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg)

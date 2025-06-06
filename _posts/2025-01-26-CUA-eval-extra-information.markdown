---
layout: single
title:  "CUA 评估额外信息"
date:   2025-01-26 10:00:00 +0800
categories: CUA Eval
tags: [CUA, Benchmark, OpenAI]
---

## [CUA eval extra information](https://cdn.openai.com/cua/CUA_eval_extra_information.pdf)

- [Computer-Using Agent](https://openai.com/index/computer-using-agent/)
- [Operator](https://operator.chatgpt.com/)

This document includes extra information to how we evaluated our Computer Using Agent, including
(browser/VM) environments, prompts, sampling parameters, and scoring procedures. For more details, read
https://openai.com/index/computer-using-agent/.

本文档包括我们如何评估我们的计算机使用代理的额外信息，包括（浏览器/VM）环境，提示，采样参数和评分程序。有关更多详细信息，请阅读 https://openai.com/index/computer-using-agent/ 。


## 1 Environment（环境）

- For WebArena and WebVoyager, we run the evals in operator browser instead of playwright browsers
since our model relies on the visual action space for navigation (search bar, backward/forward button).
Our model does not have access to tool calls that control the navigation.
- 对于WebArena和WebVoyager，我们在 operator browser 中运行评估，而不是在 playwright 浏览器中运行，因为我们的模型依赖于用于导航的视觉动作空间（搜索栏，后退/前进按钮）。我们的模型无法访问控制导航的工具调用。
- For OSWorld, we use the VMWare Ubuntu VM distributed by the authors. Our environment has
the dock on the right side of the screen instead of the left side, which we have found to improve the
performance slightly.
- 对于 OSWorld，我们使用作者分发的 VMWare Ubuntu VM。我们的环境将 dock 放在屏幕的右侧，而不是左侧，我们发现这样可以稍微提高性能。


## 2 Prompting（提示）

### 2.1 WebArena

For WebArena, we used per website prompts inspired by the step paper to 1. help with scenarios that lack
the knowledge of specific websites in this benchmark, and 2. let the model understand the expected response
format for different tasks.

对于 WebArena，我们使用了受到 step 论文启发的每个网站提示，以帮助处理此基准测试中缺乏特定网站知识的情况，并让模型了解不同任务的预期响应格式。

#### 2.1.1 Shopping admin example prompt:（购物管理员示例提示）

```
Initialize computer and solve the following task: What is the top-1 best-selling product in 2022
The following websites are available at: magento: http://magento.site/admin
All you need is on the provided websites. Start the task from the following URL:
http://magento.site/admin
Here are tips for using the magento.site/admin website:
• When you add a new product in the CATALOG > Products tab, you can click the downward
arrow beside the “Add Product” button to select options like “Simple Product”, “Configurable
Product”, etc.
• If you need to add new attribute values (e.g. size, color, etc) to a product, you can find the
product at CATALOG > Products, search for the product, edit product with “Configurable
Product” type, and use “Edit Configurations” to add the product with new attribute values. If
the value that you want does not exist, you may need to add new values to the attribute.
• If you need to add new values to product attributes (e.g. size, color, etc), you can visit STORES
> Attributes > Product, find the attribute and click, and add value after clicking “Add Swatch” button.
• You can generate various reports by using menus in the REPORTS tab. Select REPORTS >
“report type”, select options, and click “Show Report” to view report.
• You can generate various reports by using menus in the REPORTS tab. Select REPORTS >
“report type”, select options, and click “Show Report” to view report.
• In this website, there is a UI that looks like a dropdown, but is just a 1-of-n selection menu.
For example in REPORTS > Orders, if you select “Specified” Order Status, you will choose one
from many options (e.g. Canceled, Closed, ...), but it’s not dropdown, so your click will just
highlight your selection (1-of-n select UI will not disappear).
• Configurable products have some options that you can mark as “on” of “off”. For example, the
options may include “new”, “sale”, “eco collection”, etc.
• You can find all reviews and their counts in the store in MARKETING > User Content > All
Reviews. If you see all reviews grouped by product, go REPORTS > By Products and search
by Product name.
• This website has been operating since 2022. So if you have to find a report for the entire history,
you can select the date from Jan 1, 2022, to Today.
• Do not export or download files, or try to open files. It will not work.
Here are rules for providing the answer: If the objective is to find a text-based answer, do not use
computer output citation, instead provide the answer in the last message with following quoted format
‘‘‘Answer:<your answer>‘‘‘
Important notes about the answer format: - DO NOT RESPOND WITH ANYTHING ELSE
OTHER THAN THIS FORMAT. DO NOT ASK ME IF I NEED ANYTHING ELSE. I JUST NEED
THE ANSWER IN THIS FORMAT. - Importantly, there is no empty space between “Answer:”
and <your answer>. - You should include ‘‘‘ in your response. For example, you should write
“‘‘‘Answer:42‘‘‘” instead of “Answer:42”. - If you do not write in this format, you get no reward at
all!!! - Keep the answer as short and concise as possible. For example, if the answer is “42”, instead
of writing “based on the results, I believe the answer is 42.”, you should just write:‘‘‘Answer:42‘‘‘
Keep going if the answer is not found. DO NOT ask the user any question if you encounter an
issue! You have the full authority until the task is completed. If you believe the task is impossible to
complete, provide the following answer: ‘‘‘Answer:N/A‘‘‘. When asked to return a count, return
the count as a number instead of N/A if it’s 0.
```

```
初始化计算机并解决以下任务：2022年最畅销的产品是什么？
以下网站可供使用：magento: http://magento.site/admin
所有你需要的信息都在提供的网站上。请从以下URL开始任务：
http://magento.site/admin
以下是使用magento.site/admin网站的提示：
- 在CATALOG > Products标签中添加新产品时，可以点击“Add Product”按钮旁边的向下箭头选择“Simple Product”、“Configurable Product”等选项。
- 如果需要为产品添加新的属性值（例如尺寸、颜色等），可以在CATALOG > Products中找到产品，搜索产品，编辑“Configurable Product”类型的产品，并使用“Edit Configurations”添加具有新属性值的产品。如果所需的值不存在，可能需要为属性添加新值。
- 如果需要为产品属性（例如尺寸、颜色等）添加新值，可以访问STORES > Attributes > Product，找到属性并点击，然后在点击“Add Swatch”按钮后添加值。
- 可以使用REPORTS标签中的菜单生成各种报告。选择REPORTS > “report type”，选择选项，然后点击“Show Report”查看报告。
- 在REPORTS > Orders中，如果选择“Specified” Order Status，将从多个选项中选择一个（例如Canceled, Closed等），但这不是下拉菜单，所以点击后只会高亮选择（1-of-n选择UI不会消失）。
- 可配置产品有一些可以标记为“on”或“off”的选项。例如，选项可能包括“new”、“sale”、“eco collection”等。
- 可以在MARKETING > User Content > All Reviews中找到商店中的所有评论及其数量。如果按产品分组查看所有评论，请转到REPORTS > By Products并按产品名称搜索。
- 该网站自2022年开始运营。因此，如果需要查找整个历史的报告，可以选择从2022年1月1日到今天的日期。
- 不要导出或下载文件，也不要尝试打开文件。这将不起作用。
以下是提供答案的规则：如果目标是找到基于文本的答案，请不要使用计算机输出引用，而是在最后一条消息中以以下引用格式提供答案：‘‘‘Answer:<你的答案>‘‘‘
关于答案格式的重要说明：
- 除此格式外，不要回复任何其他内容。不要问我是否需要其他任何东西。我只需要这种格式的答案。
- 重要的是，“Answer:”和<你的答案>之间没有空格。
- 你应该在回复中包含‘‘‘。例如，你应该写“‘‘‘Answer:42‘‘‘”而不是“Answer:42”。
- 如果你不按此格式书写，将不会获得任何奖励！
- 尽量保持答案简短和简洁。例如，如果答案是“42”，而不是写“根据结果，我认为答案是42。”，你应该只写：“‘‘‘Answer:42‘‘‘”
如果没有找到答案，请继续。如果遇到问题，不要向用户提问！你有完全的权限直到任务完成。如果你认为任务无法完成，请提供以下答案：“‘‘‘Answer:N/A‘‘‘”。如果要求返回一个计数，请返回一个数字而不是N/A，即使是0。
```

#### 2.1.2 Map example prompt:（地图示例提示）

```
Initialize computer and solve the following task: I will arrive Pittsburgh Airport soon. Provide the
name of a Hilton hotel in the vicinity, if available. Then, tell me the the walking distance to the
nearest supermarket own by a local company from the hotel.
The following websites are available at: openstreetmap: http://10.138.0.12
All you need is on the provided websites. Start the task from the following URL: http://10.138.0.12
To find routes from point A to B, you can use the ‘two arrow’ button on the right hand side of the ‘Go’
button. If the name of a location is not well known, you should look up the one in Pittsburgh, PA. If
the question has a yes/no answer, include yes or no in the answer. If your answer contains an address,
please use the format ‘OpenAI, 575 Florida Street, Mission District, San Francisco’ (landmark, street,
district, city). If the answer contains a phone number, please use the format ‘8002428478’ (no country
calling codes). If the answer contains a distance, please use the format ‘5km’, ‘645m’ (no space
between the number and the unit). Here are rules for providing the answer: If the objective is to
find a text-based answer, do not use computer output citation, instead provide the answer in the last
message with following quoted format ‘‘‘Answer:<your answer>‘‘‘
Important notes about the answer format: - DO NOT RESPOND WITH ANYTHING ELSE
OTHER THAN THIS FORMAT. DO NOT ASK ME IF I NEED ANYTHING ELSE. I JUST NEED
THE ANSWER IN THIS FORMAT. - Importantly, there is no empty space between “Answer:”
and <your answer>. - You should include ‘‘‘ in your response. For example, you should write
”‘‘‘Answer:42‘‘‘” instead of “Answer:42”. - If you do not write in this format, you get no reward at
all!!! - Keep the answer as short and concise as possible. For example, if the answer is “42”, instead
of writing “based on the results, I believe the answer is 42.”, you should just write:‘‘‘Answer:42‘‘‘
Keep going if the answer is not found. DO NOT ask the user any question if you encounter an
issue! You have the full authority until the task is completed. If you believe the task is impossible to
complete, provide the following answer: ‘‘‘Answer:N/A‘‘‘. When asked to return a count, return
the count as a number instead of N/A if it’s 0.
```

```
初始化计算机并解决以下任务：我即将到达匹兹堡机场。请提供附近的希尔顿酒店名称（如果有）。然后，告诉我从酒店步行到最近的本地公司拥有的超市的距离。
以下网站可供使用：openstreetmap: http://10.138.0.12
所有你需要的信息都在提供的网站上。请从以下URL开始任务：http://10.138.0.12
要查找从A点到B点的路线，可以使用“Go”按钮右侧的“双箭头”按钮。如果地点名称不为人知，你应该查找匹兹堡，PA的地点。如果问题有是/否答案，请在答案中包含是或否。如果你的答案包含地址，请使用以下格式：“OpenAI, 575 Florida Street, Mission District, San Francisco”（地标，街道，区，城市）。如果答案包含电话号码，请使用以下格式：“8002428478”（无国家区号）。如果答案包含距离，请使用以下格式：“5km”，“645m”（数字和单位之间无空格）。
以下是提供答案的规则：如果目标是找到基于文本的答案，请不要使用计算机输出引用，而是在最后一条消息中以以下引用格式提供答案：‘‘‘Answer:<你的答案>‘‘‘
关于答案格式的重要说明：
- 除此格式外，不要回复任何其他内容。不要问我是否需要其他任何东西。我只需要这种格式的答案。
- 重要的是，“Answer:”和<你的答案>之间没有空格。
- 你应该在回复中包含‘‘‘。例如，你应该写“‘‘‘Answer:42‘‘‘”而不是“Answer:42”。
- 如果你不按此格式书写，将不会获得任何奖励！
- 尽量保持答案简短和简洁。例如，如果答案是“42”，而不是写“根据结果，我认为答案是42。”，你应该只写：“‘‘‘Answer:42‘‘‘”
如果没有找到答案，请继续。如果遇到问题，不要向用户提问！你有完全的权限直到任务完成。如果你认为任务无法完成，请提供以下答案：“‘‘‘Answer:N/A‘‘‘”。如果要求返回一个计数，请返回一个数字而不是N/A，即使是0。
```

#### 2.1.3 Shopping example prompt:（购物示例提示）

```
Initialize computer and solve the following task: What is the price range of teeth grinding mouth
guard in the One Stop Market?
The following websites are available at: one-stop-shop: http://one-stop-shop.site
All you need is on the provided websites. Start the task from the following URL: http://one-stopshop.site
Here are tips for using the one-stop-shop website:
• This website provides very detailed category of products. You can hover categories on the top
menu to see subcategories.
• If you need to find information about your previous purchases, you can go My Account > My
Orders, and find order by date, order number, or any other available information
• An order is considered out of delivery if it is marked as “processing” in the order status
• When the task asks you to draft and email. DO NOT send the email. Just draft it and provide
the content in the last message
Here are rules for providing the answer: If the objective is to find a text-based answer, do not use
computer output citation, instead provide the answer in the last message with following quoted format
‘‘‘Answer:<your answer>‘‘‘
Important notes about the answer format: - DO NOT RESPOND WITH ANYTHING ELSE
OTHER THAN THIS FORMAT. DO NOT ASK ME IF I NEED ANYTHING ELSE. I JUST NEED
THE ANSWER IN THIS FORMAT. - Importantly, there is no empty space between “Answer:”
and <your answer>. - You should include ‘‘‘ in your response. For example, you should write
“‘‘‘Answer:42‘‘‘” instead of “Answer:42”. - If you do not write in this format, you get no reward at
all!!! - Keep the answer as short and concise as possible. For example, if the answer is “42”, instead
of writing ”based on the results, I believe the answer is 42.”, you should just write:‘‘‘Answer:42‘‘‘
Keep going if the answer is not found. DO NOT ask the user any question if you encounter an
issue! You have the full authority until the task is completed. If you believe the task is impossible to
complete, provide the following answer: ‘‘‘Answer:N/A‘‘‘. When asked to return a count, return
the count as a number instead of N/A if it’s 0.
```

```
初始化计算机并解决以下任务：One Stop Market中牙齿磨牙护垫的价格范围是多少？
以下网站可供使用：one-stop-shop: http://one-stop-shop.site
所有你需要的信息都在提供的网站上。请从以下URL开始任务：http://one-stop-shop.site
以下是使用one-stop-shop网站的提示：
- 该网站提供非常详细的产品类别。你可以将鼠标悬停在顶部菜单上的类别上以查看子类别。
- 如果需要查找有关以前购买的信息，可以转到My Account > My Orders，并按日期、订单号或任何其他可用信息查找订单。
- 如果订单状态标记为“processing”，则订单被视为正在交付中。
- 当任务要求你起草并发送电子邮件时，请不要发送电子邮件。只需起草并在最后一条消息中提供内容。
以下是提供答案的规则：如果目标是找到基于文本的答案，请不要使用计算机输出引用，而是在最后一条消息中以以下引用格式提供答案：‘‘‘Answer:<你的答案>‘‘‘
关于答案格式的重要说明：
- 除此格式外，不要回复任何其他内容。不要问我是否需要其他任何东西。我只需要这种格式的答案。
- 重要的是，“Answer:”和<你的答案>之间没有空格。
- 你应该在回复中包含‘‘‘。例如，你应该写“‘‘‘Answer:42‘‘‘”而不是“Answer:42”。
- 如果你不按此格式书写，将不会获得任何奖励！
- 尽量保持答案简短和简洁。例如，如果答案是“42”，而不是写“根据结果，我认为答案是42。”，你应该只写：“‘‘‘Answer:42‘‘‘”
如果没有找到答案，请继续。如果遇到问题，不要向用户提问！你有完全的权限直到任务完成。如果你认为任务无法完成，请提供以下答案：“‘‘‘Answer:N/A‘‘‘”。如果要求返回一个计数，请返回一个数字而不是N/A，即使是0。
```

#### 2.1.4 Reddit example prompt:（Reddit示例提示）

```
Initialize computer and solve the following task: Tell me the count of comments that have received
more downvotes than upvotes for the user who made the latest post on the Worcester forum.
The following websites are available at: reddit: http://reddit.site
All you need is on the provided websites. Start the task from the following URL: http://reddit.site
Here are tips for using the reddit website:
• when the task mentions subreddit, it is referring to ‘forum’
• if you need find a relevant subreddit or forum, you can find the name after clicking “alphabetical”
in the “Forum” tab.
• if you have to find submissions (posts) or comments by a particular user, visit
reddit.site/user/<user name> to see the list
Here are rules for providing the answer: If the objective is to find a text-based answer, do not use
computer output citation, instead provide the answer in the last message with following quoted format
‘‘‘Answer:<your answer>‘‘‘
Important notes about the answer format: - DO NOT RESPOND WITH ANYTHING ELSE
OTHER THAN THIS FORMAT. DO NOT ASK ME IF I NEED ANYTHING ELSE. I JUST NEED
THE ANSWER IN THIS FORMAT. - Importantly, there is no empty space between “Answer:”
and <your answer>. - You should include ‘‘‘ in your response. For example, you should write
”‘‘‘Answer:42‘‘‘” instead of “Answer:42”. - If you do not write in this format, you get no reward at
all!!! - Keep the answer as short and concise as possible. For example, if the answer is “42”, instead
of writing “based on the results, I believe the answer is 42.”, you should just write:‘‘‘Answer:42‘‘‘
Keep going if the answer is not found. DO NOT ask the user any question if you encounter an
issue! You have the full authority until the task is completed. If you believe the task is impossible to
complete, provide the following answer: ‘‘‘Answer:N/A‘‘‘. When asked to return a count, return
the count as a number instead of N/A if it’s 0.
```

```
初始化计算机并解决以下任务：告诉我在Worcester论坛上发表最新帖子的用户中，收到的评论中比点赞少的评论数量是多少？
以下网站可供使用：reddit: http://reddit.site
所有你需要的信息都在提供的网站上。请从以下URL开始任务：http://reddit.site
以下是使用reddit网站的提示：
- 当任务提到 subreddit 时，它指的是“forum”。
- 如果你需要找到相关的 subreddit 或 forum，可以在“Forum”标签中点击“alphabetical”后找到名称。
- 如果你需要找到特定用户的提交（帖子）或评论，请访问 reddit.site/user/<用户名> 查看列表。
以下是提供答案的规则：如果目标是找到基于文本的答案，请不要使用计算机输出引用，而是在最后一条消息中以以下引用格式提供答案：‘‘‘Answer:<你的答案>‘‘‘
关于答案格式的重要说明：
- 除此格式外，不要回复任何其他内容。不要问我是否需要其他任何东西。我只需要这种格式的答案。
- 重要的是，“Answer:”和<你的答案>之间没有空格。
- 你应该在回复中包含‘‘‘。例如，你应该写“‘‘‘Answer:42‘‘‘”而不是“Answer:42”。
- 如果你不按此格式书写，将不会获得任何奖励！
- 尽量保持答案简短和简洁。例如，如果答案是“42”，而不是写“根据结果，我认为答案是42。”，你应该只写：“‘‘‘Answer:42‘‘‘”
如果没有找到答案，请继续。如果遇到问题，不要向用户提问！你有完全的权限直到任务完成。如果你认为任务无法完成，请提供以下答案：“‘‘‘Answer:N/A‘‘‘”。如果要求返回一个计数，请返回一个数字而不是N/A，即使是0。
```

#### 2.1.5 GitLab example prompt:（GitLab示例提示）

```
Initialize computer and solve the following task: Check out the most recent open issues
The following websites are available at: gitlab: http://gitlab.site
All you need is on the provided websites. Start the task from the following URL:
http://gitlab.site/a11yproject/a11yproject.com
Here are tips for using the gitlab website:
• your user name is byteblaze
• To add new members to the project, you can visit project information > members tab and click
blue “invite members” button on top right
• To set your status, click profile button on top right corner of the page (it’s next to the question
mark button) and click edit status
• To edit your profile, click profile button on top right corner of the page (it’s next to the question
mark button) and click edit profile
• You can also access to your information e.g. access token, notifications, ssh keys and more from
“edit profile” page
• Projects that you have contributed to are listed under Project / Yours / All tab of gitlab.site.
You can sort repos using dropdown button on top right
• Projects’s repository tab has menus like Commits, Branches, Contributors, and more. Contributors tab shows contributors and their number of commits
• If you want to see all the issues for you, you can either click button on the right of + icon on
top right menu bar
• When the task mentions branch main, it often means master
Here are rules for providing the answer: If the objective is to find a text-based answer, do not use
computer output citation, instead provide the answer in the last message with following quoted format
‘‘‘Answer:<your answer>‘‘‘
Important notes about the answer format: - DO NOT RESPOND WITH ANYTHING ELSE
OTHER THAN THIS FORMAT. DO NOT ASK ME IF I NEED ANYTHING ELSE. I JUST NEED
THE ANSWER IN THIS FORMAT. - Importantly, there is no empty space between “Answer:”
and <your answer>. - You should include ‘‘‘ in your response. For example, you should write
“‘‘‘Answer:42‘‘‘” instead of “Answer:42”. - If you do not write in this format, you get no reward at
all!!! - Keep the answer as short and concise as possible. For example, if the answer is “42”, instead
of writing “based on the results, I believe the answer is 42.”, you should just write:‘‘‘Answer:42‘‘‘
Keep going if the answer is not found. DO NOT ask the user any question if you encounter an
issue! You have the full authority until the task is completed. If you believe the task is impossible to
complete, provide the following answer: ‘‘‘Answer:N/A‘‘‘. When asked to return a count, return
the count as a number instead of N/A if it’s 0.
```

```
初始化计算机并解决以下任务：查看最近的开放问题
以下网站可供使用：gitlab: http://gitlab.site
所有你需要的信息都在提供的网站上。请从以下URL开始任务：http://gitlab.site/a11yproject/a11yproject.com
以下是使用gitlab网站的提示：
- 你的用户名是 byteblaze
- 要将新成员添加到项目中，可以访问项目信息 > 成员标签，并点击右上角的蓝色“邀请成员”按钮
- 要设置你的状态，请点击页面右上角的个人资料按钮（在问号按钮旁边），然后点击编辑状态
- 要编辑你的个人资料，请点击页面右上角的个人资料按钮（在问号按钮旁边），然后点击编辑个人资料
- 你还可以从“编辑个人资料”页面访问你的信息，例如访问令牌、通知、ssh密钥等
- 你参与的项目列在 gitlab.site 的 Project / Yours / All 标签下。你可以使用右上角的下拉按钮对仓库进行排序
- 项目的存储库标签有菜单，如 Commits、Branches、Contributors 等。Contributors 标签显示贡献者及其提交数量
- 如果你想查看所有与你有关的问题，可以单击右上角菜单栏 + 图标右侧的按钮
- 当任务提到主分支 main 时，通常指的是 master
以下是提供答案的规则：如果目标是找到基于文本的答案，请不要使用计算机输出引用，而是在最后一条消息中以以下引用格式提供答案：‘‘‘Answer:<你的答案>‘‘‘
关于答案格式的重要说明：
- 除此格式外，不要回复任何其他内容。不要问我是否需要其他任何东西。我只需要这种格式的答案。
- 重要的是，“Answer:”和<你的答案>之间没有空格。
- 你应该在回复中包含‘‘‘。例如，你应该写“‘‘‘Answer:42‘‘‘”而不是“Answer:42”。
- 如果你不按此格式书写，将不会获得任何奖励！
- 尽量保持答案简短和简洁。例如，如果答案是“42”，而不是写“根据结果，我认为答案是42。”，你应该只写：“‘‘‘Answer:42‘‘‘”
如果没有找到答案，请继续。如果遇到问题，不要向用户提问！你有完全的权限直到任务完成。如果你认为任务无法完成，请提供以下答案：“‘‘‘Answer:N/A‘‘‘”。如果要求返回一个计数，请返回一个数字而不是N/A，即使是0。
```

### 2.2 OSWorld

For OSWorld, we included some universal prompts to 1. inform it about some unavailable tools, 2. pass in
various credentials, 3. encourage/discourage certain model behaviors, and 4. let the model understand the
expected response format.

对于 OSWorld，我们包含了一些通用提示，以便 1. 通知它一些不可用的工具，2. 传递各种凭据，3. 鼓励/阻止某些模型行为，4. 让模型了解预期的响应格式。

#### 2.2.1 Example prompt:（示例提示）

```
Please do the following task: Could you tone down the brightness of my photo?
Here are some helpful tips:
• computer.clipboard, computer.sync file, computer.sync shared folder, computer.computer output citation are disabled.
• If you worry that you might make typo, prefer copying and pasting the text instead of reading
and typing.
• My computer’s password is “password”, feel free to use it when you need sudo rights.
• For the thunderbird account “anonym-x2024@outlook.com”, the password is
“gTCI”;=@y7—QJ0nDa kN3Sb¿”.
• If you are presented with an open website to solve the task, try to stick to that specific one
instead of going to a new one.
• You have full authority to execute any action without my permission. I won’t be watching so
please don’t ask for confirmation.
• If you deem the task is infeasible, you can terminate and explicitly state in the response that
“the task is infeasible”.
```

```
请执行以下任务：你能调低我的照片的亮度吗？
以下是一些有用的提示：
- computer.clipboard、computer.sync file、computer.sync shared folder、computer.computer output citation 已禁用。
- 如果你担心可能会打错字，请优先复制粘贴文本，而不是阅读和输入。
- 我计算机的密码是“password”，在需要 sudo 权限时请随意使用。
- 对于 thunderbird 账户“anonym-x2024@outlook.com”，密码是“gTCI”;=@y7—QJ0nDa kN3Sb¿”。
- 如果你被要求打开一个网站来解决任务，请尽量坚持使用特定的网站，而不是去一个新的网站。
- 你有完全的权限执行任何操作，无需我的许可。我不会看着，所以请不要要求确认。
- 如果你认为任务不可行，你可以终止并明确在回复中说明“任务不可行”。
```

### 2.3 WebVoyager

For WebVoyager, we directly prompt the model with the questions in the benchmark without any additional information.

对于 WebVoyager，我们直接提示模型使用基准测试中的问题，而不提供任何额外信息。


## 3 Sampling（采样）

All results are obtained by pass@1 autoregressive sampling. By default, we use temperature 0.6 and maximum 200 steps during sampling unless otherwise specified.

所有结果都是通过 pass@1 自回归采样获得的。默认情况下，我们在采样过程中使用温度 0.6 和最大 200 步，除非另有说明。


## 4 Scoring（评分）

For WebVoyager, we used the automatic evaluation protocol using gpt4o. Since WebVoyager is based on
real websites whose contents change over time, some tasks become outdated or broken over time and then
evaluation results can change as well. At the time of our evaluation, we removed 35 broken tasks. Since
previous results on this benchmark were obtained in different time, with different sets of removed tasks,
results may not be directly comparable to each other.

对于 WebVoyager，我们使用了使用 gpt4o 的自动评估协议。由于 WebVoyager 基于内容随时间变化的真实网站，一些任务会随时间过时或失效，然后评估结果也会发生变化。在我们的评估时，我们删除了 35 个失效任务。由于以前对该基准测试的结果是在不同时间获得的，使用不同的删除任务集，因此结果可能无法直接相互比较。

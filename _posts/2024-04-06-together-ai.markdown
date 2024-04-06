---
layout: post
title:  "Together AI - The fastest cloud platform for building and running generative AI"
date:   2024-04-06 08:00:00 +0800
categories: TogetherAI LLM
tags: [TogetherAI, LLM]
---

> 用于构建和运行生成式人工智能的最快云平台

## 注册 [Together AI](https://api.together.xyz/) 的开发平台

## [Together AI Playground](https://api.together.xyz/playground)

![](/images/2024/TogetherAI/together-ai-api-key.png)

![](/images/2024/TogetherAI/together-ai-llama2-70b-chat.png)

![](/images/2024/TogetherAI/together-ai-llama2-70b-chat1.png)

![](/images/2024/TogetherAI/together-ai-llama2-70b-chat2.png)

**速度非常快**

## [Together AI Inference](https://docs.together.ai/docs/quickstart)

### OpenAI API
```python
from openai import OpenAI
import os

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")

client = OpenAI(
  api_key=TOGETHER_API_KEY,
  base_url='https://api.together.xyz/v1',
)

chat_completion = client.chat.completions.create(
  messages=[
    {
      "role": "system",
      "content": "You are an expert travel guide.",
    },
    {
      "role": "user",
      "content": "Tell me fun things to do in San Francisco.",
    }
  ],
  model="mistralai/Mixtral-8x7B-Instruct-v0.1"
)

print(chat_completion.choices[0].message.content)
```
```
 Absolutely, I'd be happy to help you discover some fun things to do in San Francisco! Here are a few suggestions:

1. **Explore Golden Gate Park:** This urban park is larger than New York's Central Park and offers a variety of activities. You can visit the California Academy of Sciences, stroll through the Japanese Tea Garden, or rent a bike and ride around the park.

2. **Ride a Cable Car:** San Francisco's cable car system is a National Historic Landmark. It's not only a fun way to get around, but also offers great views of the city.

3. **Visit Fisherman's Wharf:** Here, you can see sea lions at Pier 39, visit the Aquarium of the Bay, or explore the various shops and restaurants. Don't forget to try some fresh seafood!

4. **Explore the Mission District:** This vibrant neighborhood is known for its colorful murals, hip bars, and delicious Mexican food.

5. **Hike in Muir Woods:** Just a short drive from the city, you can find yourself among some of the oldest and tallest trees in the world.

6. **Visit Alcatraz:** Take a ferry to this infamous island and tour the former prison. Be sure to book your tickets in advance as they sell out quickly.

7. **Stroll around the Ferry Building Marketplace:** This is a food lover's paradise with a wide variety of local food and artisan stalls.

Remember, San Francisco is a city with many microclimates, so be prepared for changing weather throughout the day! Enjoy your visit!
```

```
告诉我在旧金山可以做的有趣的事情。
```
```
当然，我很乐意帮助您发现旧金山的一些有趣的事情！ 以下是一些建议：

1. **探索金门公园：** 这个城市公园比纽约中央公园还要大，提供各种各样的活动。 您可以参观加州科学院，漫步日本茶园，或租一辆自行车绕公园骑行。

2. **乘坐缆车：** 旧金山的缆车系统是国家历史地标。 这不仅是一种有趣的出行方式，而且还可以欣赏城市的美景。

3. **参观渔人码头：** 在这里，您可以在39号码头观看海狮，参观海湾水族馆，或探索各种商店和餐馆。 别忘了尝试一些新鲜的海鲜！

4. **探索教会区：** 这个充满活力的街区以其色彩缤纷的壁画、时尚的酒吧和美味的墨西哥美食而闻名。

5. **在穆尔森林徒步旅行：** 距城市仅一小段车程，您就会发现自己置身于世界上一些最古老、最高的树木之中。

6. **参观恶魔岛：** 乘坐渡轮前往这座臭名昭著的岛屿并参观前监狱。 请务必提前预订门票，因为门票很快就会售完。

7. **在渡轮大厦市场漫步：** 这里是美食爱好者的天堂，有各种各样的当地美食和工匠摊位。

请记住，旧金山是一座拥有多种微气候的城市，因此请做好应对全天天气变化的准备！ 祝您访问愉快！
```

### [REST API](https://docs.together.ai/docs/inference-rest)
```python
# Set up environment if you saved the API key in a .env file
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# Set up the together.ai API key
import os
together_api_key = os.getenv('TOGETHER_API_KEY')

# define the together.ai API url
url = "https://api.together.xyz/inference"

# Store keywords that will be passed to the API
headers = {
    "Authorization": f"Bearer {together_api_key}",
    "Content-Type": "application/json"}

# Choose the model to call
model="togethercomputer/llama-2-7b-chat"

prompt = """
Please write me a birthday card for my dear friend, Andrew.
"""

# Add instruction tags to the prompt
prompt = f"[INST]{prompt}[/INST]"

# Set temperature and max_tokens
temperature = 0.0
max_tokens = 1024

data = {
    "model": model,
    "prompt": prompt,
    "temperature": temperature,
    "max_tokens": max_tokens
}

import requests
response = requests.post(url,
                         headers=headers,
                         json=data)

print('[INPUT]\n', data)
print('[OUTPUT]\n', response.json()['output']['choices'][0]['text'])
```
```
[INPUT]
 {'model': 'togethercomputer/llama-2-7b-chat', 'prompt': '[INST]\nPlease write me a birthday card for my dear friend, Andrew.\n[/INST]', 'temperature': 0.0, 'max_tokens': 1024}
[OUTPUT]
   Of course, I'd be happy to help you write a birthday card for your dear friend Andrew! Here's a suggestion:

Dear Andrew,

Happy birthday to an amazing friend! 🎉

On your special day, I wanted to take a moment to express how grateful I am for your presence in my life. You bring so much joy and laughter to our friendship, and I feel lucky to have you by my side.

Whether we're sharing a meal, watching a movie, or just hanging out, every moment with you is a treat. Your kind heart, quick wit, and infectious energy make every day brighter, and I'm so grateful to be your friend.

Here's to another year of adventures, laughter, and making memories together! Cheers, my dear friend! 🥳

Wishing you a birthday that's as amazing as you are,
[Your Name]

I hope this helps inspire you to write a heartfelt and personalized message to your friend Andrew. Don't forget to add your own personal touches and memories to make it extra special!
```

## 参考资料
- [Together AI](https://www.together.ai/)
- [Together AI Playground](https://api.together.xyz/playground)
- [Together AI Documentation](https://docs.together.ai/docs/quickstart)

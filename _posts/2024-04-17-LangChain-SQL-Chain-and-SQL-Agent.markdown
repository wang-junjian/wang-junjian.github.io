---
layout: post
title:  "LangChain : SQL Chain & SQL Agent"
date:   2024-04-17 08:00:00 +0800
categories: LangChain Text2SQL
tags: [LangChain, ChatTongyi, Text2SQL]
---

## SQL Chain

```python
from datetime import datetime
from operator import itemgetter

from langchain.chains import create_sql_query_chain

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.runnables import RunnableLambda

from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_community.utilities import SQLDatabase
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool


def get_current_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main():
    db = SQLDatabase.from_uri("sqlite:///test.db")
    model = ChatTongyi(model="qwen1.5-72b-chat", top_p=0.01)

    sql_query = create_sql_query_chain(model, db)
    execute_query = QuerySQLDataBaseTool(db=db)

    question_prompt = PromptTemplate.from_template(
        """现在的时间是 {current_time}
        # 表 yxdsj_wshbb_gdfw_day 各字段说明
        ---
        prov_name 省
        city_name 市
        county_name 区县
        pin_mgt_name 供电所
        tousu 投诉
        yijian 意见
        acpt_time 接受时间
        TOUSU_BWHL 投诉百万户量
        YIJIAN_BWHL 意见百万户量
        charu_date 插入时间
        # SQL 要求
        ---
        只返回 SQL 语句。
        合计要使用 sum 函数。
        时间要使用 acpt_time 字段，不要使用 charu_date 字段。
        city_name 的值应该为城市名称，不要加"市"字。
        # 业务要求
        ---
        1. 请不要使用 "今天"、"今年"、"本月"、"本季度" 等词语。
        # 问题
        ---
        {question}
        """
    )

    answer_prompt = PromptTemplate.from_template(
        """Given the following user question, corresponding SQL query, and SQL result, answer the user question.

        Question: {question}
        SQL Query: {query}
        SQL Result: {result}
        Answer: """
    )

    answer = answer_prompt | model | StrOutputParser()
    chain = (
        question_prompt
        | {"question" : RunnableLambda(lambda input : input.text)}
        | RunnablePassthrough.assign(query=sql_query).assign(
            result=(itemgetter("query") | execute_query)
            )
        | answer
    )

    response = chain.invoke({"question": "山东省济南今年的意见合计。", "current_time": get_current_time()})
    print('🤖 ', response)


if __name__ == "__main__":
    main()
```
```
🤖  山东省济南市在今年（2024年）已收到的总意见数为705条。
```

```sql
SELECT SUM(yijian) AS total_opinions FROM yxdsj_wshbb_gdfw_day WHERE prov_name = "山东省" AND city_name = "济南" AND acpt_time BETWEEN date('2024-01-01') AND date('now')
```

查看 LangChain 生成 SQL 的提示词。

```python
sql_query = create_sql_query_chain(model, db)
print(sql_query.get_prompts()[0].pretty_print())
```

```
You are a SQLite expert. Given an input question, first create a syntactically correct SQLite query to run, then look at the results of the query and return the answer to the input question.
Unless the user specifies in the question a specific number of examples to obtain, query for at most 5 results using the LIMIT clause as per SQLite. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use date('now') function to get the current date, if the question involves "today".

Use the following format:

Question: Question here
SQLQuery: SQL Query to run
SQLResult: Result of the SQLQuery
Answer: Final answer here

Only use the following tables:
{table_info}

Question: {input}

```
```
您是一名 SQLite 专家。 给定一个输入问题，首先创建一个语法正确的 SQLite 查询来运行，然后查看查询结果并返回输入问题的答案。
除非用户在问题中指定要获取的特定数量的示例，否则按照 SQLite 使用 LIMIT 子句查询最多 {top_k} 个结果。 您可以对结果进行排序，以返回数据库中信息最丰富的数据。
切勿查询表中的所有列。 您必须仅查询回答问题所需的列。 将每个列名用双引号 (") 括起来，将它们表示为分隔标识符。
请注意，仅使用下表中可以看到的列名称。 注意不要查询不存在的列。 另外，请注意哪个列位于哪个表中。
如果问题涉及“今天”，请注意使用 date(\'now\') 函数来获取当前日期。
```

## SQL Agent
```python
from langchain_community.agent_toolkits import create_sql_agent

agent_executor = create_sql_agent(model, db=db, verbose=True)
response = agent_executor.invoke({"input": "山东省济南2024年的意见合计。"})
print(response)
```


## 参考资料
- [SQL Database](https://python.langchain.com/docs/integrations/toolkits/sql_database/)
- [Q&A over SQL + CSV Quickstart](https://python.langchain.com/docs/use_cases/sql/quickstart/)
- [Q&A over SQL + CSV Agents](https://python.langchain.com/docs/use_cases/sql/agents/)
- [Build your First SQL Database Agent with LangChain](https://medium.com/@LawrencewleKnight/build-your-first-sql-database-agent-with-langchain-19af8064ae18)
- [SQLite: Default a datetime field to the current time (now)](https://alvinalexander.com/android/sqlite-default-datetime-field-current-time-now/)
- [Tapping into GenAI: Query Snowflake with LangChain & AWS Bedrock](https://blog.ippon.tech/tapping-into-genai-query-your-snowflake-data-warehouse-with-langchain-aws-bedrock)

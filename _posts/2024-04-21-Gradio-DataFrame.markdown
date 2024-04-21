---
layout: post
title:  "Gradio DataFrame"
date:   2024-04-21 08:00:00 +0800
categories: Gradio DataFrame
tags: [Gradio, DataFrame, Text2SQL]
---

## Gradio DataFrame
```python
import pandas as pd
import gradio as gr

def read_csv_from_text2sql(file_path="data/text2sql.csv"):
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        return pd.DataFrame([{"error": f"❌ {e}"}])

def selected_text2sql_dataframe(selected_index: gr.SelectData, df: gr.DataFrame):
    selected_row = df.iloc[selected_index.index[0]]
    text = selected_row.get('Text', '')
    sql = selected_row.get('SQL', '')
    return text, sql

with gr.Blocks() as demo:
    # UI
    upload_button = gr.UploadButton(label="上传 Text2SQL CSV 文件", 
                                    file_types = ['.csv'], 
                                    file_count = "single")
    df_text2sql = gr.Dataframe(headers=["Text", "SQL"], 
                                type="pandas", 
                                col_count=2, 
                                value=read_csv_from_text2sql,
                                interactive=False)
    with gr.Row():
        textbox_text = gr.Textbox(label="Text", lines=4)
        textbox_sql = gr.Textbox(label="SQL", lines=4)

    # Event
    upload_button.upload(fn=read_csv_from_text2sql, 
                            inputs=upload_button, 
                            outputs=df_text2sql)
    df_text2sql.select(fn=selected_text2sql_dataframe,
                        inputs=df_text2sql,
                        outputs=[textbox_text, textbox_sql])

demo.queue(api_open=False)
demo.launch(max_threads=30)
```


## data/text2sql.csv
```csv
Text,SQL
山东省德州2024年3月份投诉意见各多少,"SELECT SUM(tousu) AS total_tousu, SUM(yijian) AS total_yijian FROM yxdsj_wshbb_gdfw_day WHERE prov_name = '山东省' AND city_name = '德州' AND acpt_time BETWEEN date('2024-03-01') AND date('2024-03-31')"
山东省临沂2024年3月份意见和意见百万户量各多少,"SELECT SUM(yijian) AS total_yijian, SUM(YIJIAN_BWHL) AS total_yijian_bwhl FROM yxdsj_wshbb_gdfw_day WHERE prov_name = '山东省' AND city_name = '临沂' AND acpt_time BETWEEN date('2024-03-01') AND date('2024-03-31')"
山东省2024年3月份投诉和投诉百万户量各多少,"SELECT SUM(tousu) AS total_complaints, SUM(TOUSU_BWHL) AS complaints_per_million_users FROM yxdsj_wshbb_gdfw_day WHERE prov_name = '山东省' AND acpt_time BETWEEN date('2024-03-01') AND date('2024-03-31')"
```


## 参考资料
- [Gradio DataFrame](https://www.gradio.app/main/docs/dataframe)
- [asoria/datasets-text2sql](https://huggingface.co/spaces/asoria/datasets-text2sql/blob/main/app.py)
- [How to upload dataframe with content of file upload?](https://discuss.huggingface.co/t/how-to-upload-dataframe-with-content-of-file-upload/38587/1)
- [gr.select() Method Issues with Dataframe Cells (since Version 3.43.0) #5706](https://github.com/gradio-app/gradio/issues/5706)

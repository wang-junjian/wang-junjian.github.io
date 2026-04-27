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
    img[alt~="center"] {
        display: block;
        margin: 0 auto;
    }
    table {
        width: 100%;
    }
    th, td {
        white-space: nowrap;
        width: 100%;
    }
    .columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }
---

<!--footer: ©2023 王军建-->

# OCR

---
# OCR 引擎
---

## 开源 OCR 引擎对比

|     | [EasyOCR][EasyOCR] | [PaddleOCR][PaddleOCR] | [Tesseract][Tesseract] |
| --- | ------: | --------: | --------: |
| **依赖机器学习框架**                | PyTorch | PaddlePaddle | |
| **支持语言**                       | 80+  | 80+   | 100+ |
| **布局识别**                       | 👍 | | |
| **鲁棒性**                        | | 👍 | |
| **Apple M2 Max**                 | 7秒   | 4秒   | |
| **CPU (Intel Xeon Silver 4216)** | 🚀 6秒   | 8秒   | |
| **CUDA (NVIDIA Tesla T4)**       | 1.2秒（3G显存） | 🚀 0.8秒（2G显存） | |

<!--_footer: "PaddleOCR 部分依赖包有版本的要求；不同版本接口不一致（`2.6` 与 `2.7`）。"-->

---

## EasyOCR 快速开始
### 安装
```shell
pip install torch==2.0.1 torchvision==0.15.2 -i https://download.pytorch.org/whl/cpu
pip install easyocr
```

### 代码示例
```py
import easyocr

languages = ['ch_sim', 'en']
model = easyocr.Reader(languages)
result = model.readtext(img_path)
print(result)
```

---

## PaddleOCR 快速开始
### 安装
```shell
pip install numpy==1.23.5 PyMuPDF==1.21.1 # paddleocr 依赖
pip install paddlepaddle -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install paddleocr
```

### 代码示例
```py
from paddleocr import PaddleOCR

language = ['ch']
model = PaddleOCR(use_angle_cls=True, lang=language, det_limit_side_len=2000)
result = model.ocr(img_path)
print(result)
```

---

## EasyOCR 布局识别更精准
![center w:1000](images/OCR/EasyOCR-Layout.png)

---

## PaddleOCR 对间距小的菜单项或工具栏的布局不能够精准识别
![center w:1000](images/OCR/PaddleOCR-Layout.png)

---

## EasyOCR 鲁棒性差，受质量、字体、大小、颜色等影响较大
![center w:1000](images/OCR/EasyOCR-Bad.png)

---

## PaddleOCR 鲁棒性更好
![center w:1000](images/OCR/PaddleOCR-Good.png)

---

## 调试：[faulthandler — Dump the Python traceback](https://docs.python.org/3/library/faulthandler.html)

当出现下面的错误（主要是 C、C++ 库的问题）：

- Segmentation fault
- Illegal instruction
- 可以通过 faulthandler 定位到错误位置，在代码中加入下面的代码：

```python
import faulthandler
faulthandler.enable()
```

---

# 谢 谢 ！


<!-- OCR -->
[EasyOCR]: https://github.com/JaidedAI/EasyOCR
[PaddleOCR]: https://github.com/PaddlePaddle/PaddleOCR
[Tesseract]: https://github.com/tesseract-ocr/tesseract

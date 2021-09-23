---
layout: post
title:  "使用PaddleOCR进行文字识别"
date:   2021-09-17 00:00:00 +0800
categories: AI 文字识别
tags: [Python, PaddleOCR]
---

## 安装
```shell
pip install paddleocr
```

## 测试
```py
import cv2
import numpy as np

from paddleocr import PaddleOCR


ocr = PaddleOCR(use_angle_cls=True)
image_path = 'test.jpg'
img = cv2.imread(image_path)

img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
img_gray1 = img_gray[:,:, np.newaxis]
img_gray3 = np.concatenate([img_gray1, img_gray1, img_gray1], axis=-1)

texts = ocr.ocr(img_gray3)
for text in texts:
    """
    box   坐标1　　　　　　　　　坐标2
          坐标4　　　　　　　　　坐标3
    """
    box = text[0]
    t = text[1][0]
    score = text[1][1]
```

## 可视化（图像上画出文本和得分）
```py
import os
import shutil
import cv2
import numpy as np
import uuid

from PIL import ImageFont, ImageDraw, Image
from paddleocr import PaddleOCR


def is_image(filename):
    ext_names = ['.png', '.jpg', '.jpeg', '.tif', '.bmp']
    return include_ext_names(filename, ext_names)

def include_ext_names(filename, ext_names):
    _, ext_name = os.path.splitext(filename.lower())
    if not ext_names or ext_name in ext_names:
        return True
    return False

def get_file_paths(path, filter):
    paths = []
    for filename in os.listdir(path):
        if filter(filename):
            paths.append(os.path.join(path, filename))

    return paths

def ocr(img_path):
    results = []

    img = cv2.imread(img_path)

    ocr = PaddleOCR(use_angle_cls=True, det_db_score_mode='slow', det_limit_side_len=img.shape[1])

    texts = ocr.ocr(img)
    for text in texts:
        box = text[0]
        t = text[1][0].strip()
        score = text[1][1]
        
        x1 = int(min(box[0][0], box[3][0]))
        y1 = int(min(box[0][1], box[1][1]))
        x2 = int(max(box[1][0], box[2][0]))
        y2 = int(max(box[2][1], box[3][1]))

        results.append((t, x1, y1, x2, y2, score))

    return results

def draw_texts(img_path, texts, save_path):
    img = cv2.imread(img_path)

    for t, x1, y1, x2, y2, score in texts:
        red = (0, 0, 255)
        cv2.rectangle(img, (x1, y1), (x2, y2), color=red, thickness=2)
        cv2.putText(img, str(score), (x2, y1-10), cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=red, thickness=1, lineType=cv2.LINE_AA)

    font_path = '/code/tmp/doc/fonts/simfang.ttf'
    font = ImageFont.truetype(font_path, 32)
    img_pil = Image.fromarray(img)
    draw = ImageDraw.Draw(img_pil)

    for t, x1, y1, x2, y2, score in texts:
        red = (0, 0, 255)
        draw.text((x2, y1),  t, font = font, fill = red)

    img = np.array(img_pil)

    cv2.imwrite(os.path.join(save_path, f'{os.path.basename(img_path)}'), img)

def crop_texts(img_path, texts, save_path):
    img = cv2.imread(img_path)

    for t, x1, y1, x2, y2, score in texts:
        img_crop = img[y1:y2, x1:x2]
        id = str(uuid.uuid4())
        filename = os.path.join(save_path, f'{t}_{score}-{id[:8]}.jpg')
        cv2.imwrite(filename, img_crop)


if __name__ == '__main__':
    ocr_results_dir = 'ocr_results'
    draw_rectangel_images = os.path.join(ocr_results_dir, 'images')
    crop_images = os.path.join(ocr_results_dir, 'crop_images')

    if os.path.exists(ocr_results_dir):
        shutil.rmtree(ocr_results_dir)
    os.mkdir(ocr_results_dir)
    os.mkdir(draw_rectangel_images)
    os.mkdir(crop_images)

    img_filenames = get_file_paths('test', is_image)
    for filename in img_filenames:
        texts = ocr(filename)
        draw_texts(filename, texts, draw_rectangel_images)
        crop_texts(filename, texts, crop_images)
```

## 参考资料
* [PaddlePaddle](https://github.com/PaddlePaddle)
* [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
* [FAQ](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.3/doc/doc_ch/FAQ.md)
* [PaddleHub](https://www.paddlepaddle.org.cn/hubdetail)
* [How to draw Chinese text on the image using `cv2.putText`correctly? (Python+OpenCV)](https://stackoverflow.com/questions/50854235/how-to-draw-chinese-text-on-the-image-using-cv2-puttextcorrectly-pythonopen)
* [关于paddleOCR的推理速度 #60](https://github.com/PaddlePaddle/PaddleOCR/issues/60)
* [paddleocr](https://pypi.org/project/paddleocr/)

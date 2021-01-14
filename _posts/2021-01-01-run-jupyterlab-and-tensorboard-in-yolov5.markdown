---
layout: post
title:  "在YOLOv5中运行JupyterLab和TensorBoard"
date:   2021-01-01 00:00:00 +0800
categories: Jupyter
tags: [Jupyter, JupyterLab, TensorBoard, YOLOv5]
---

## 构建可用的JupyterLab和TensorBoard
* 启动YOLOv5容器
```shell
docker run --ipc=host --runtime nvidia -it -p 8888:8888 \
  -v ${dataset_dir}:/usr/src/app/project \
  ultralytics/yolov5:latest
```

* 安装版本1的TensorBoard。（解决```FAQ1```的问题：jupyter-tensorboard 0.2.0不支持高于TensorBoard 2.0的版本。YOLOv5镜像中安装的TensorBoard 2.4的版本。）
```shell
pip uninstall tensorboard -y && pip install tensorboard==1.15
```

* 运行JupyterLab
```shell
jupyter lab --no-browser --ip 0.0.0.0 --port 8888
```

* 本地浏览器进行访问
```txt
http://ip:8888/lab
```

## FAQ
* 1. Launcher Error - Invalid response: 500 Internal Server Error
```py
Uncaught exception POST /api/tensorboard?1609481325314 (192.168.1.1)
    HTTPServerRequest(protocol='http', host='hostname:20101', method='POST', uri='/api/tensorboard?1609481325314', version='HTTP/1.1', remote_ip='192.168.1.1')
    Traceback (most recent call last):
      File "/opt/conda/lib/python3.8/site-packages/tornado/web.py", line 1702, in _execute
        result = method(*self.path_args, **self.path_kwargs)
      File "/opt/conda/lib/python3.8/site-packages/tornado/web.py", line 3173, in wrapper
        return method(self, *args, **kwargs)
      File "/opt/conda/lib/python3.8/site-packages/jupyter_tensorboard/api_handlers.py", line 39, in post
        self.settings["tensorboard_manager"]
      File "/opt/conda/lib/python3.8/site-packages/jupyter_tensorboard/tensorboard_manager.py", line 219, in new_instance
        create_tb_app(
      File "/opt/conda/lib/python3.8/site-packages/jupyter_tensorboard/tensorboard_manager.py", line 44, in create_tb_app
        return application.standard_tensorboard_wsgi(
    AttributeError: module 'tensorboard.backend.application' has no attribute 'standard_tensorboard_wsgi'
```

## 参考资料
* [ultralytics/yolov5](https://hub.docker.com/r/ultralytics/yolov5)
* [jupyter](https://jupyter.org)
* [jupyter-tensorboard 0.2.0](https://pypi.org/project/jupyter-tensorboard/)

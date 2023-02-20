---
layout: post
title:  "在 MacBook Pro M2 Max 上安装 OpenVINO"
date:   2023-02-14 08:00:00 +0800
categories: MacBookProM2Max AI
tags: [OpenVINO, MYRIAD]
---

## 安装 OpenVINO（手动编译）
```shell
brew install cmake
brew install automake
brew install --build-from-source libtool
brew install --build-from-source libunistring
brew install --build-from-source libidn2
brew install --build-from-source wget
brew install --build-from-source libusb

sudo conda install scons -y                                                                        

# 克隆时把依赖的子模块进行克隆（先克隆OpenVINO，再进行子模块克隆失败）
git clone --depth 1 --recurse-submodules https://github.com/openvinotoolkit/openvino.git

cd openvino
python3 -m pip install -r src/bindings/python/wheel/requirements-dev.txt

# 安装OpenCV（可选）
sudo conda install -c conda-forge opencv

mkdir build && cd build

# 配置（-DOPENVINO_EXTRA_MODULES=../openvino_contrib/modules/arm_plugin 好像不需要）
cmake -DCMAKE_BUILD_TYPE=Release ..

# 编译
cmake --build . --config Release --parallel $(sysctl -n hw.ncpu)
**没有生成 wheel**

# 安装
sudo mkdir /opt/openvino
sudo cmake -DCMAKE_INSTALL_PREFIX=/opt/openvino -P cmake_install.cmake

# 查看可用设备
./bin/arm64/Release/hello_query_device 
[ INFO ] Build ................................. 2023.0.0-1-b300df1be6c
[ INFO ] 
[ INFO ] Available devices: 
[ INFO ] CPU
[ INFO ] 	SUPPORTED_PROPERTIES: 
[ INFO ] 		Immutable: SUPPORTED_METRICS : SUPPORTED_METRICS SUPPORTED_CONFIG_KEYS RANGE_FOR_ASYNC_INFER_REQUESTS RANGE_FOR_STREAMS
[ INFO ] 		Immutable: SUPPORTED_CONFIG_KEYS : LP_TRANSFORMS_MODE DUMP_GRAPH PERF_COUNT CPU_THROUGHPUT_STREAMS CPU_BIND_THREAD CPU_THREADS_NUM CPU_THREADS_PER_STREAM BIG_CORE_STREAMS SMALL_CORE_STREAMS THREADS_PER_STREAM_BIG THREADS_PER_STREAM_SMALL SMALL_CORE_OFFSET ENABLE_HYPER_THREAD NUM_STREAMS INFERENCE_NUM_THREADS AFFINITY
[ INFO ] 		Mutable: PERF_COUNT : YES
[ INFO ] 		Immutable: AVAILABLE_DEVICES : NEON
[ INFO ] 		Immutable: FULL_DEVICE_NAME : arm_compute::NEON
[ INFO ] 		Immutable: OPTIMIZATION_CAPABILITIES : FP16 FP32
[ INFO ] 		Immutable: RANGE_FOR_ASYNC_INFER_REQUESTS : 1 12 1
[ INFO ] 		Mutable: PERFORMANCE_HINT : ""
[ INFO ] 		Immutable: RANGE_FOR_STREAMS : 1 12
[ INFO ] 		Mutable: CPU_THROUGHPUT_STREAMS : 1
[ INFO ] 		Mutable: CPU_BIND_THREAD : NO
[ INFO ] 		Mutable: CPU_THREADS_NUM : 0
[ INFO ] 		Mutable: CPU_THREADS_PER_STREAM : 12
[ INFO ] 		Mutable: BIG_CORE_STREAMS : 0
[ INFO ] 		Mutable: SMALL_CORE_STREAMS : 0
[ INFO ] 		Mutable: THREADS_PER_STREAM_BIG : 0
[ INFO ] 		Mutable: THREADS_PER_STREAM_SMALL : 0
[ INFO ] 		Mutable: SMALL_CORE_OFFSET : 0
[ INFO ] 		Mutable: ENABLE_HYPER_THREAD : YES
[ INFO ] 		Mutable: NUM_STREAMS : 1
[ INFO ] 		Mutable: INFERENCE_NUM_THREADS : 0
[ INFO ] 		Mutable: AFFINITY : NONE
[ INFO ] 
```

## 通过编译 2022.1.0 版本，可以获得 MYRIAD 的支持
```shell
git clone -b 2022.1.0 --depth 1 --recurse-submodules https://github.com/openvinotoolkit/openvino.git
cmake -DCMAKE_BUILD_TYPE=Release -DTHREADING=SEQ ..
cmake --build . --config Release --parallel $(sysctl -n hw.ncpu)

./bin/arm64/Release/hello_query_device
[ INFO ] OpenVINO Runtime version ......... 2022.1.0
[ INFO ] Build ........... custom_HEAD_cdb9bec7210f8c24fde3e416c7ada820faaaa23e
[ INFO ] 
[ INFO ] Available devices: 
[ INFO ] MYRIAD
[ INFO ] 	SUPPORTED_PROPERTIES: 
[ INFO ] 		Mutable: AVAILABLE_DEVICES : 1.1.2-ma2480
[ INFO ] 		Mutable: FULL_DEVICE_NAME : Intel Movidius Myriad X VPU
[ INFO ] 		Mutable: OPTIMIZATION_CAPABILITIES : EXPORT_IMPORT FP16
[ INFO ] 		Mutable: RANGE_FOR_ASYNC_INFER_REQUESTS : 3 6 1
[ INFO ] 		Mutable: DEVICE_THERMAL : EMPTY VALUE
[ INFO ] 		Mutable: DEVICE_ARCHITECTURE : MYRIAD
[ INFO ] 		Mutable: NUM_STREAMS : AUTO
[ INFO ] 		Mutable: PERFORMANCE_HINT : ""
[ INFO ] 		Mutable: PERFORMANCE_HINT_NUM_REQUESTS : 0
[ INFO ] 
```

将 libopenvino_intel_myriad_plugin.so, usb-ma2x8x.mvcmd 文件拷贝到 2023 版本下，并编辑了 plugins.xml 文件，但**没有起作用**。

```shell
vim plugins.xml
<ie>
    <plugins>
        <plugin name="AUTO" location="libopenvino_auto_plugin.so">
        </plugin>
        <plugin name="BATCH" location="libopenvino_auto_batch_plugin.so">
        </plugin>
        <plugin name="CPU" location="libopenvino_arm_cpu_plugin.so">
        </plugin>
        <plugin name="HETERO" location="libopenvino_hetero_plugin.so">
        </plugin>
        <plugin name="MULTI" location="libopenvino_auto_plugin.so">
        </plugin>
        <plugin name="MYRIAD" location="libopenvino_intel_myriad_plugin.so">
        </plugin>
    </plugins>
</ie>
```

## 参考资料
* [Build on macOS* Systems for Apple Silicon](https://github.com/openvinotoolkit/openvino/wiki/BuildingForMacOS_arm64)
* [How to compile and run Intel OpenVINO natively on Apple M1!](https://medium.com/macoclock/how-to-compile-intel-openvino-to-run-natively-on-apple-m1-7192b5abe6c5)
* [Install OpenVINO™ Runtime on macOS from an Archive File](https://docs.openvino.ai/2022.1/openvino_docs_install_guides_installing_openvino_from_archive_macos.html)
* [Configurations for Intel® Neural Compute Stick 2](https://docs.openvino.ai/latest/openvino_docs_install_guides_configurations_for_ncs2.html)
* [pyusb on Mac M1 support #355](https://github.com/pyusb/pyusb/issues/355)
* [Improve USB2/3 duality matching #288](https://github.com/mvp/uhubctl/pull/288)
* [Different behavior on M1 (Apple Silicon) Mac #282](https://github.com/mvp/uhubctl/issues/282)
* [If you need to install Rosetta on your Mac](https://support.apple.com/en-us/HT211861)
* [什么是Git LFS大文件存储?](https://help.aliyun.com/document_detail/206887.html)
* [oneTBB](https://spec.oneapi.io/versions/latest/elements/oneTBB/source/nested-index.html)
* [Git 工具 - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

---
layout: single
title:  "使用 nmtui 配置 Jetson Thor Wi-Fi 热点（AP 模式）"
date:   2025-10-16 08:00:00 +0800
categories: Jetson Thor
tags: [JetsonThor, Jetson, Thor, nmtui, Wi-Fi, AP, NVIDIA]
---

<!--more-->

## 查看 Wi-Fi 设备是否支持 AP 模式

```bash
iw list | grep "AP"
```
```bash
	Device supports AP-side u-APSD.
		 * AP
		HE Iftypes: AP
				Rx HE MU PPDU from Non-AP STA
		HE Iftypes: AP
				Rx HE MU PPDU from Non-AP STA
		 * AP: 0x00 0x10 0x20 0x30 0x40 0x50 0x60 0x70 0x80 0x90 0xa0 0xb0 0xc0 0xd0 0xe0 0xf0
		 * AP/VLAN: 0x00 0x10 0x20 0x30 0x40 0x50 0x60 0x70 0x80 0x90 0xa0 0xb0 0xc0 0xd0 0xe0 0xf0
		 * AP: 0x00 0x20 0x40 0xa0 0xb0 0xc0 0xd0
		 * AP/VLAN: 0x00 0x20 0x40 0xa0 0xb0 0xc0 0xd0
	Maximum associated stations in AP mode: 32
```

- 如果没有 `AP` 字样，则不支持 AP 模式。

## 创建 Wi-Fi 热点

1.  **运行 `sudo nmtui` 并选择“编辑一个连接”**。
    * 在 `nmtui` 主菜单中，确保选中“Edit a connection”选项。
    * 按下 `<OK>` 键。

2.  **添加一个新的连接**。
    * 在连接列表，选择 `<Add>` 按钮。

3.  **选择连接类型**。
    * 在“New Connection”界面，选择你希望创建的连接类型。
    * 选择 **Wi-Fi**。
    * 选中 `<Create>` 按钮以继续。

4.  **配置 Wi-Fi 热点设置**。
    * 进入“Edit Connection”界面。
    * **配置文件名 (Profile name):** 输入热点的名称（例如：Jetson Thor 1）。
    * **SSID:** 输入热点的 SSID（广播名称）。
    * **模式 (Mode):** 将模式设置为 **`<Access Point>`**。这会将连接配置为热点。
    * **安全 (Security):** 选择一个安全类型，例如 **`<WPA & WPA2 Personal>`**。
    * **Password:** 输入热点密码。
    * 完成配置后，选择底部的 **`<OK>`** 按钮保存设置。

5.  **创建成功（例如：Jetson Thor 1）**。

```bash
sudo nmtui
```

![](/images/2025/Jetson/nmtui/1.png)

![](/images/2025/Jetson/nmtui/2.png)

![](/images/2025/Jetson/nmtui/3.png)

![](/images/2025/Jetson/nmtui/4.png)

![](/images/2025/Jetson/nmtui/5.png)


## 连接到热点

![](/images/2025/Jetson/nmtui/6.png)

## 参考资料
- [nmtui](https://docs.rockylinux.org/10/zh/gemstones/network/nmtui/)
- [2.5. NetworkManager 工具](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/7/html/networking_guide/sec-NetworkManager_Tools)
- [3.2. 使用 nmtui 配置 IP 网络](https://docs.redhat.com/zh-cn/documentation/red_hat_enterprise_linux/7/html/networking_guide/sec-configuring_ip_networking_with_nmtui)

---
layout: single
title:  "飞算 JavaAI：五步智能引导构建坦克大战游戏"
date:   2026-03-05 08:00:00 +0800
categories: 飞算JavaAI Agent
tags: [飞算JavaAI, Agent, Tank]
---

<!--more-->

## 飞算 JavaAI

![](/images/2026/FeiSuan/home-banar.png)

![](/images/2026/FeiSuan/new-scene.png)

### 设置

![](/images/2026/FeiSuan/setting.png)

### 规则

![](/images/2026/FeiSuan/rules.png)

### MCP

![](/images/2026/FeiSuan/mcp.png)

### 记忆

![](/images/2026/FeiSuan/memory.png)

### 会话历史

![](/images/2026/FeiSuan/history.png)


## 创建项目

![](/images/2026/FeiSuan/create-project.jpeg)

```markdown
# 🎮 坦克大战 - Tank Battle

一个经典坦克游戏克隆，致敬任天堂的《坦克大战》（Battle City）。

## ✨ 功能特性

### 核心玩法
- **玩家坦克** - 使用 WASD 或方向键控制移动，空格键射击
- **AI 敌方坦克** - 自动移动和射击，难度随关卡递增
- **基地保护** - 保护你的金色基地不被敌人摧毁
- **关卡系统** - 通关后自动进入下一关，敌人越来越强

### 地图元素
- **🧱 砖墙** - 可被子弹破坏，提供战术掩护
- **🔩 钢墙** - 不可破坏的坚固障碍物（增强子弹可以破坏）
- **💧 水域** - 坦克无法通过的水域
- **🌲 树林** - 可以隐藏坦克的树林
- **🏠 基地** - 需要保护的核心目标

### 游戏系统
- **分数系统** - 消灭敌人获得分数，通关获得奖励
- **生命系统** - 玩家有 3 条生命
- **爆炸效果** - 炫酷的爆炸动画
- **游戏状态** - 开始界面、游戏界面、结束界面
- **音频系统** - 完整的音效系统，支持开关控制
- **道具系统** - 多种道具增强游戏可玩性

### 道具系统
- **⚡ 速度提升** - 移动速度增加 50%，持续 10 秒
- **🔥 火力提升** - 增加射击频率、子弹速度、伤害，支持穿透钢墙，持续 10 秒
- **🛡️ 护盾** - 提供无敌效果，持续 10 秒
- **❤️ 生命** - 增加 1 条生命
- **💣 炸弹** - 消灭所有敌人
- **❄️ 冻结** - 冻结所有敌人 5 秒

## 🎯 操作说明

| 按键 | 功能 |
|------|------|
| W / ↑ | 向上移动 |
| S / ↓ | 向下移动 |
| A / ← | 向左移动 |
| D / → | 向右移动 |
| 空格键 | 发射子弹 |
| 音效按钮 | 开关游戏音效（开启/关闭） |
```


## 一、理解需求

![](/images/2026/FeiSuan/1-understand-the-requirements1.jpeg)

![](/images/2026/FeiSuan/1-understand-the-requirements2.jpeg)

1. 需要游戏房间创建功能，支持生成唯一的游戏会话标识，用于管理单局游戏的生命周期
2. 需要玩家状态初始化功能，支持在游戏开始时设定玩家的初始生命值为3、初始分数为0及初始坦克属性
3. 需要玩家坦克移动逻辑处理功能，支持根据移动指令计算坦克下一帧坐标，并校验与砖墙、钢墙、水域、边界等地图元素的碰撞情况以阻断非法移动
4. 需要玩家坦克射击逻辑处理功能，支持根据射击指令生成子弹对象，判定子弹飞行轨迹与地图障碍物、敌方坦克及基地的碰撞结果
5. 需要地图数据加载功能，支持根据关卡ID获取对应的地图布局数据，包含砖墙、钢墙、水域、树林、基地等元素的位置坐标信息
6. 需要敌方坦克AI控制功能，支持自动控制敌方坦克进行移动路径规划、转向逻辑及自动射击，并实现随关卡递增的难度参数调整
7. 需要子弹碰撞判定功能，支持区分子弹击中不同目标（砖墙、钢墙、坦克、基地）后的处理逻辑，包括销毁子弹、扣除目标生命值或销毁目标
8. 需要基地保护判定功能，支持监测基地是否被敌方子弹或玩家误伤击中，一旦击中立即触发游戏失败结算流程
9. 需要地图元素破坏机制功能，支持普通子弹破坏砖墙、增强子弹破坏钢墙的逻辑，并同步更新地图障碍物状态
10. 需要道具生成与掉落功能，支持在特定条件触发下（如消灭敌方坦克）随机生成速度提升、火力提升、护盾、生命、炸弹、冻结等道具实体
11. 需要道具拾取生效功能，支持玩家坦克拾取道具后触发对应效果，包括移动速度增益、射击属性增强、无敌状态、生命值增加、全屏敌人清除及敌人冻结状态
12. 需要道具效果时效管理功能，支持对速度提升、火力提升、护盾、冻结等具有持续时间的道具效果进行倒计时管理及状态自动清除
13. 需要分数结算功能，支持根据消灭敌方坦克的类型、数量及通关奖励计算并累加玩家当前得分
14. 需要生命值管理功能，支持玩家坦克被击毁时扣除生命值，并在生命值归零时触发游戏结束流程
15. 需要关卡进度管理功能，支持在消灭当前关卡所有敌人后判定通关，并自动切换至下一关卡或触发游戏胜利结算
16. 需要游戏状态流转控制功能，支持管理游戏从准备开始、进行中、暂停、结束等状态的切换逻辑
17. 需要游戏音效开关控制功能，支持接收客户端音效设置指令，维护当前游戏会话的音效开启或关闭状态
18. 需要游戏结算功能，支持在游戏结束或通关时生成包含最终得分、存活状态、通关关卡数等数据的结算报告


## 二、设计接口

![](/images/2026/FeiSuan/2-design-interface1.jpeg)

![](/images/2026/FeiSuan/2-design-interface2.jpeg)

1. 游戏房间管理

负责创建新的游戏房间并生成唯一的游戏会话标识，用于管理单局游戏的完整生命周期；支持游戏状态的流转控制，包括准备开始、进行中、暂停、结束等状态的切换逻辑；同时维护游戏会话内的全局设置，如接收客户端指令以开启或关闭游戏音效状态。

2. 地图数据服务

负责根据关卡ID获取对应的地图布局数据，提供砖墙、钢墙、水域、树林、基地等元素的位置坐标信息；支持在游戏过程中动态更新地图障碍物状态，处理普通子弹破坏砖墙、增强子弹破坏钢墙后的地形数据同步。

3. 玩家状态管理

负责在游戏开始时初始化玩家状态，设定初始生命值为3、初始分数为0及初始坦克属性；支持在游戏过程中对玩家生命值进行增减管理，当玩家坦克被击毁时扣除生命值，并在生命值归零时触发游戏结束流程；支持根据消灭敌人及通关奖励实时计算并累加玩家得分。

4. 玩家坦克操控

负责处理玩家坦克的移动与射击逻辑；移动逻辑支持根据指令计算下一帧坐标，并校验与砖墙、钢墙、水域、边界等地图元素的碰撞以阻断非法移动；射击逻辑支持根据指令生成子弹对象，判定子弹飞行轨迹与地图障碍物、敌方坦克及基地的碰撞结果。

5. 敌方坦克智能控制

负责自动控制敌方坦克的行为逻辑，包括移动路径规划、转向逻辑及自动射击；支持随关卡递增动态调整敌方坦克的难度参数；配合道具效果，支持在冻结状态下暂停行动逻辑。

6. 子弹碰撞判定

负责处理子弹飞行过程中的碰撞检测，区分子弹击中不同目标后的处理逻辑；击中砖墙或钢墙时销毁子弹并根据子弹类型破坏障碍物；击中坦克时扣除目标生命值或销毁目标；击中基地时触发基地保护判定逻辑。

7. 基地保护判定

负责监测基地是否被敌方子弹或玩家误伤击中，一旦判定基地受损，立即触发游戏失败结算流程，确保核心目标不被摧毁。

8. 道具系统管理

负责道具的全生命周期管理，支持在消灭敌方坦克等特定条件下随机生成速度提升、火力提升、护盾、生命、炸弹、冻结等道具实体；处理玩家坦克拾取道具后的生效逻辑，包括即时效果（如增加生命、全屏清除敌人）和持续性效果（如速度增益、无敌状态、敌人冻结）的触发；支持对具有持续时间的道具效果进行倒计时管理及状态自动清除。

9. 关卡进度管理

负责监测当前关卡内敌人的消灭情况，判定是否通关；支持在通关后自动切换至下一关卡并重置场景，或在通过所有关卡后触发游戏胜利结算流程。

10. 游戏结算服务

负责在游戏结束（生命值归零或基地被毁）或通关时生成结算报告，统计并输出最终得分、存活状态、通关关卡数等核心数据.


## 三、表结构设计

![](/images/2026/FeiSuan/3-table-structure-design1.jpeg)

![](/images/2026/FeiSuan/3-table-structure-design2.jpeg)

```sql
CREATE TABLE t_game_room (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识(唯一)',
    game_status TINYINT DEFAULT 0 COMMENT '游戏状态(0:准备开始,1:进行中,2:暂停,3:结束)',
    sound_enabled TINYINT DEFAULT 1 COMMENT '音效开关(0:关闭,1:开启)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_room_code (room_code)
) ENGINE=InnoDB COMMENT='游戏房间表';

CREATE TABLE t_level_map_config (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    level_id INT NOT NULL COMMENT '关卡ID',
    map_data TEXT NOT NULL COMMENT '地图布局数据(JSON格式,包含砖墙、钢墙、水域、树林、基地等元素坐标)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_level_id (level_id)
) ENGINE=InnoDB COMMENT='关卡地图配置表';

CREATE TABLE t_player_status (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    player_id VARCHAR(64) NOT NULL COMMENT '玩家标识',
    lives INT DEFAULT 3 COMMENT '生命值',
    score INT DEFAULT 0 COMMENT '当前得分',
    tank_type VARCHAR(32) COMMENT '坦克类型',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='玩家状态表';

CREATE TABLE t_tank_entity (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    tank_code VARCHAR(64) NOT NULL COMMENT '坦克唯一标识',
    tank_type TINYINT NOT NULL COMMENT '坦克类型(1:玩家坦克,2:敌方坦克)',
    pos_x INT NOT NULL COMMENT '当前X坐标',
    pos_y INT NOT NULL COMMENT '当前Y坐标',
    direction TINYINT DEFAULT 0 COMMENT '朝向(0:上,1:下,2:左,3:右)',
    speed INT DEFAULT 1 COMMENT '移动速度',
    fire_power INT DEFAULT 1 COMMENT '火力等级',
    shield_status TINYINT DEFAULT 0 COMMENT '护盾状态(0:无,1:有)',
    frozen_status TINYINT DEFAULT 0 COMMENT '冻结状态(0:正常,1:冻结)',
    is_alive TINYINT DEFAULT 1 COMMENT '存活状态(0:已销毁,1:存活)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='坦克实体表';

CREATE TABLE t_bullet_entity (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    bullet_code VARCHAR(64) NOT NULL COMMENT '子弹唯一标识',
    owner_tank_code VARCHAR(64) NOT NULL COMMENT '发射者坦克标识',
    pos_x INT NOT NULL COMMENT '当前X坐标',
    pos_y INT NOT NULL COMMENT '当前Y坐标',
    direction TINYINT NOT NULL COMMENT '飞行方向(0:上,1:下,2:左,3:右)',
    bullet_type TINYINT DEFAULT 1 COMMENT '子弹类型(1:普通子弹,2:增强子弹)',
    is_active TINYINT DEFAULT 1 COMMENT '是否激活(0:已销毁,1:激活)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='子弹实体表';

CREATE TABLE t_map_obstacle (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    obstacle_type TINYINT NOT NULL COMMENT '障碍物类型(1:砖墙,2:钢墙,3:水域,4:树林,5:基地)',
    pos_x INT NOT NULL COMMENT 'X坐标',
    pos_y INT NOT NULL COMMENT 'Y坐标',
    is_destroyed TINYINT DEFAULT 0 COMMENT '是否被破坏(0:否,1:是)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='地图障碍物状态表';

CREATE TABLE t_prop_entity (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    prop_code VARCHAR(64) NOT NULL COMMENT '道具唯一标识',
    prop_type TINYINT NOT NULL COMMENT '道具类型(1:速度提升,2:火力提升,3:护盾,4:生命,5:炸弹,6:冻结)',
    pos_x INT NOT NULL COMMENT 'X坐标',
    pos_y INT NOT NULL COMMENT 'Y坐标',
    is_picked TINYINT DEFAULT 0 COMMENT '是否被拾取(0:否,1:是)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='道具实体表';

CREATE TABLE t_prop_effect (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    tank_code VARCHAR(64) NOT NULL COMMENT '生效坦克标识',
    prop_type TINYINT NOT NULL COMMENT '道具类型(1:速度提升,2:火力提升,3:护盾,6:冻结)',
    start_time DATETIME NOT NULL COMMENT '生效开始时间',
    duration_seconds INT NOT NULL COMMENT '持续时长(秒)',
    is_active TINYINT DEFAULT 1 COMMENT '是否生效中(0:已失效,1:生效中)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='道具效果记录表';

CREATE TABLE t_level_progress (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    current_level_id INT DEFAULT 1 COMMENT '当前关卡ID',
    enemy_total INT DEFAULT 0 COMMENT '敌人总数',
    enemy_killed INT DEFAULT 0 COMMENT '已消灭敌人数',
    is_passed TINYINT DEFAULT 0 COMMENT '是否通关(0:否,1:是)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='关卡进度表';

CREATE TABLE t_game_settlement (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    room_code VARCHAR(64) NOT NULL COMMENT '游戏会话标识',
    player_id VARCHAR(64) NOT NULL COMMENT '玩家标识',
    final_score INT DEFAULT 0 COMMENT '最终得分',
    survive_status TINYINT DEFAULT 0 COMMENT '存活状态(0:阵亡,1:存活)',
    passed_level_count INT DEFAULT 0 COMMENT '通关关卡数',
    result TINYINT DEFAULT 0 COMMENT '游戏结果(0:失败,1:胜利)',
    create_by VARCHAR(64) COMMENT '创建人',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '修改人',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
    PRIMARY KEY (id),
    KEY idx_room_code (room_code)
) ENGINE=InnoDB COMMENT='游戏结算记录表';
```


## 四、处理逻辑（接口）

![](/images/2026/FeiSuan/4-processing-logic1.jpeg)

![](/images/2026/FeiSuan/4-processing-logic2.jpeg)

1. 游戏房间管理
    1. 创建游戏房间
    2. 入参对象属性: createBy(创建人，必填)
    3. 处理逻辑: 生成唯一的游戏会话标识(roomCode)。
    4. 处理逻辑: 初始化游戏房间信息，游戏状态默认为'准备开始'(0)，音效状态默认为'开启'(1)。
    5. 处理逻辑: 将游戏房间数据保存到t_game_room表。
    6. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    7. 修改游戏状态
    8. 入参对象属性: roomCode(游戏会话标识，必填)、gameStatus(游戏状态，必填)
    9. 处理逻辑: 根据roomCode查询t_game_room表，如果房间不存在，返回失败信息。
    10. 返回结果: {"code":"000001","msg":"游戏房间不存在","data":...}
    11. 处理逻辑: 校验游戏状态的流转逻辑，例如只有'准备开始'状态才能切换为'进行中'，'进行中'才能切换为'暂停'等。
    12. 处理逻辑: 如果状态流转校验失败，返回失败信息。
    13. 返回结果: {"code":"000001","msg":"游戏状态流转不合法","data":...}
    14. 处理逻辑: 更新t_game_room表中的gameStatus字段。
    15. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    16. 切换游戏音效
    17. 入参对象属性: roomCode(游戏会话标识，必填)、soundEnabled(音效开关，必填)
    18. 处理逻辑: 根据roomCode查询t_game_room表，如果房间不存在，返回失败信息。
    19. 返回结果: {"code":"000001","msg":"游戏房间不存在","data":...}
    20. 处理逻辑: 更新t_game_room表中的soundEnabled字段，实现开启或关闭音效状态。
    21. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    22. 获取游戏房间信息
    23. 入参对象属性: roomCode(游戏会话标识，必填)
    24. 处理逻辑: 根据roomCode查询t_game_room表。
    25. 处理逻辑: 如果房间不存在，返回失败信息。
    26. 返回结果: {"code":"000001","msg":"游戏房间不存在","data":...}
    27. 处理逻辑: 获取房间详细信息并返回。
    28. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    
2. 地图数据服务
    1. 获取关卡地图布局
    2. 请求入参对象属性: levelId(关卡ID，必填)
    3. 处理逻辑: 根据关卡ID查询t_level_map_config表获取地图配置信息
    4. 处理逻辑: 如果未查询到地图配置信息，返回失败信息
    5. 返回结果: {"code":"000001","msg":"地图配置不存在","data":...}
    6. 处理逻辑: 解析mapData字段，获取砖墙、钢墙、水域、树林、基地等元素的坐标信息
    7. 处理逻辑: 返回地图布局数据
    8. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    9. 初始化房间地图障碍物
    10. 请求入参对象属性: roomCode(游戏会话标识，必填)、levelId(关卡ID，必填)
    11. 任务1: 校验关卡配置
    12. 处理逻辑: 根据levelId查询t_level_map_config表确认关卡配置是否存在
    13. 处理逻辑: 如果关卡配置不存在，返回失败信息
    14. 返回结果: {"code":"000001","msg":"关卡配置不存在","data":...}
    15. 任务2: 初始化障碍物数据
    16. 处理逻辑: 解析地图配置中的mapData字段
    17. 处理逻辑: 将解析出的障碍物数据（砖墙、钢墙、水域、树林、基地等）批量插入t_map_obstacle表，状态初始化为未破坏
    18. 处理逻辑: 返回初始化成功信息
    19. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    20. 更新地图障碍物状态
    21. 请求入参对象属性: roomCode(游戏会话标识，必填)、posX(X坐标，必填)、posY(Y坐标，必填)、bulletType(子弹类型，必填)
    22. 任务1: 查询障碍物信息
    23. 处理逻辑: 根据roomCode和坐标查询t_map_obstacle表中的障碍物记录
    24. 处理逻辑: 如果障碍物不存在或已被破坏，返回调用成功但不做处理
    25. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    26. 任务2: 校验破坏逻辑
    27. 处理逻辑: 判断障碍物类型，若为钢墙且子弹类型不为增强子弹，则无法破坏，直接返回成功
    28. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    29. 处理逻辑: 若为水域、树林或基地类型，不执行破坏逻辑，直接返回
    30. 任务3: 执行破坏更新
    31. 处理逻辑: 若满足破坏条件（砖墙或可被增强子弹破坏的钢墙），更新t_map_obstacle表中对应该记录的isDestroyed状态为1（已破坏）
    32. 处理逻辑: 返回更新成功信息
    33. 返回结果: {"code":"000000","msg":"调用成功","data":...}
 
3. 玩家状态管理
    1. 初始化玩家状态
    2. 请求入参对象属性: roomCode(游戏会话标识，必填)、playerId(玩家标识，必填)、tankType(坦克类型)
    3. 处理逻辑: 根据roomCode查询t_game_room表，校验游戏房间是否存在
    4. 返回结果:{"code":"000001","msg":"游戏房间不存在","data":...}
    5. 处理逻辑: 根据roomCode和playerId查询t_player_status表，校验该玩家是否已初始化
    6. 返回结果:{"code":"000001","msg":"玩家状态已存在","data":...}
    7. 处理逻辑: 构建玩家状态对象，设定初始生命值为3、初始分数为0，保存至t_player_status表
    8. 处理逻辑: 根据传入的tankType或默认配置，初始化玩家坦克实体数据并保存至t_tank_entity表
    9. 返回结果:{"code":"000000","msg":"调用成功","data":...}
    10. 更新玩家生命值
    11. 请求入参对象属性: roomCode(游戏会话标识，必填)、playerId(玩家标识，必填)、livesChange(生命值变化量，必填，正数为增加负数为减少)
    12. 处理逻辑: 根据roomCode和playerId查询t_player_status表，获取当前玩家状态
    13. 返回结果:{"code":"000001","msg":"玩家状态不存在","data":...}
    14. 处理逻辑: 计算更新后的生命值（当前生命值 + livesChange）
    15. 处理逻辑: 如果更新后的生命值小于等于0，将生命值设置为0，并更新数据库记录
    16. 处理逻辑: 触发游戏结束流程（调用游戏结算服务相关逻辑），标记游戏失败
    17. 返回结果:{"code":"000000","msg":"游戏结束","data":{"lives":0}}
    18. 处理逻辑: 如果更新后的生命值大于0，更新t_player_status表中的lives字段
    19. 返回结果:{"code":"000000","msg":"调用成功","data":{"lives":...}}
    20. 更新玩家得分
    21. 请求入参对象属性: roomCode(游戏会话标识，必填)、playerId(玩家标识，必填)、scoreChange(得分变化量，必填，正整数)
    22. 处理逻辑: 根据roomCode和playerId查询t_player_status表，获取当前玩家状态
    23. 返回结果:{"code":"000001","msg":"玩家状态不存在","data":...}
    24. 处理逻辑: 计算累加后的得分（当前得分 + scoreChange），更新t_player_status表中的score字段
    25. 返回结果:{"code":"000000","msg":"调用成功","data":{"currentScore":...}}
    26. 查询玩家状态
    27. 请求入参对象属性: roomCode(游戏会话标识，必填)、playerId(玩家标识，必填)
    28. 处理逻辑: 根据roomCode和playerId查询t_player_status表
    29. 返回结果:{"code":"000001","msg":"玩家状态不存在","data":...}
    30. 处理逻辑: 获取玩家当前生命值、得分及坦克属性信息
    31. 返回结果:{"code":"000000","msg":"调用成功","data":...}
 
4. 玩家坦克操控
    1. 玩家坦克移动
    2. 请求入参对象属性:roomCode(游戏会话标识，必填)、tankCode(坦克唯一标识，必填)、direction(移动朝向，必填)
    3. 处理逻辑:根据roomCode查询t_game_room表，校验游戏状态是否为“进行中”，若不是则返回失败信息
    4. 返回结果:{"code":"000001","msg":"游戏未开始或已结束","data":...}
    5. 处理逻辑:根据tankCode查询t_tank_entity表，校验坦克是否存在且存活状态为“存活”，若校验不通过则返回失败信息
    6. 返回结果:{"code":"000001","msg":"坦克不存在或已销毁","data":...}
    7. 处理逻辑:校验坦克的frozen_status是否为“冻结”，若处于冻结状态则返回失败信息
    8. 返回结果:{"code":"000001","msg":"坦克处于冻结状态无法移动","data":...}
    9. 处理逻辑:根据坦克当前坐标、direction和speed计算下一帧的目标坐标
    10. 处理逻辑:查询t_map_obstacle表获取当前地图障碍物信息，校验目标坐标是否与砖墙、钢墙、水域或边界发生碰撞
    11. 处理逻辑:若发生碰撞，阻断移动，返回当前位置信息
    12. 返回结果:{"code":"000000","msg":"移动受阻","data":...}
    13. 处理逻辑:若无碰撞，更新t_tank_entity表中的pos_x、pos_y及direction字段
    14. 返回结果:{"code":"000000","msg":"移动成功","data":...}
    15. 玩家坦克射击
    16. 请求入参对象属性:roomCode(游戏会话标识，必填)、tankCode(坦克唯一标识，必填)
    17. 处理逻辑:根据roomCode查询t_game_room表，校验游戏状态是否为“进行中”，若不是则返回失败信息
    18. 返回结果:{"code":"000001","msg":"游戏未开始或已结束","data":...}
    19. 处理逻辑:根据tankCode查询t_tank_entity表，校验坦克是否存在、存活状态为“存活”且frozen_status为“正常”，若校验不通过则返回失败信息
    20. 返回结果:{"code":"000001","msg":"坦克状态异常无法射击","data":...}
    21. 处理逻辑:生成子弹唯一标识bulletCode，根据坦克坐标和朝向确定子弹初始坐标
    22. 处理逻辑:根据坦克的fire_power字段确定bullet_type（普通或增强）
    23. 处理逻辑:将子弹数据插入t_bullet_entity表，状态设为激活
    24. 返回结果:{"code":"000000","msg":"射击成功","data":...}
 
5. 敌方坦克智能控制
    1. 敌方坦克行为调度
    2. 请求入参对象属性: roomCode(游戏会话标识，必填)
    3. 处理逻辑: 根据roomCode查询游戏房间信息，如果房间不存在或游戏状态不为“进行中”，则不执行后续逻辑
    4. 处理逻辑: 查询关卡进度表t_level_progress，判断当前关卡是否已通关或未开始，若异常则终止调度
    5. 处理逻辑: 查询道具效果记录表t_prop_effect，检查是否存在类型为“冻结”且状态为“生效中”的记录，若存在则跳过敌方坦克行动逻辑
    6. 处理逻辑: 查询坦克实体表t_tank_entity，获取所有tank_type为“敌方坦克”且is_alive为“存活”的坦克列表
    7. 处理逻辑: 遍历敌方坦克列表，根据坦克当前位置和地图障碍物信息进行移动路径规划，计算下一帧坐标并更新posX、posY及direction字段
    8. 处理逻辑: 在移动逻辑执行后，根据预设的射击频率逻辑判定是否触发射击，若触发则生成子弹实体并保存至t_bullet_entity表
    9. 返回结果:{"code":"000000","msg":"调用成功","data":...}
    10. 更新敌方坦克难度参数
    11. 请求入参对象属性: roomCode(游戏会话标识，必填)、levelId(关卡ID，必填)
    12. 处理逻辑: 根据roomCode查询游戏房间信息，校验房间是否存在
    13. 处理逻辑: 根据levelId查询关卡配置，获取该关卡对应的敌方坦克基础属性（如速度、火力等）
    14. 处理逻辑: 查询当前房间内所有存活的敌方坦克实体
    15. 处理逻辑: 根据关卡难度系数动态调整敌方坦克的speed（移动速度）和firePower（火力等级），并更新t_tank_entity表
    16. 返回结果:{"code":"000000","msg":"调用成功","data":...}
    17. 返回结果:{"code":"000001","msg":"游戏房间不存在","data":...}
    18. 冻结敌方坦克行动
    19. 请求入参对象属性: roomCode(游戏会话标识，必填)、durationSeconds(持续时长，必填)
    20. 处理逻辑: 根据roomCode查询游戏房间信息，校验房间是否存在
    21. 处理逻辑: 查询当前房间内所有存活的敌方坦克实体
    22. 处理逻辑: 遍历敌方坦克列表，将frozenStatus更新为“冻结”状态
    23. 处理逻辑: 在道具效果记录表t_prop_effect中插入一条类型为“冻结”的记录，记录生效开始时间和持续时长
    24. 返回结果:{"code":"000000","msg":"调用成功","data":...}
    25. 解冻敌方坦克行动
    26. 请求入参对象属性: roomCode(游戏会话标识，必填)
    27. 处理逻辑: 根据roomCode查询道具效果记录表t_prop_effect，获取类型为“冻结”且状态为“生效中”的记录
    28. 处理逻辑: 判断当前时间是否超过生效开始时间加上持续时长，若已超时则将is_active更新为“已失效”
    29. 处理逻辑: 查询当前房间内所有存活的敌方坦克实体，将frozenStatus更新为“正常”状态
    30. 返回结果:{"code":"000000","msg":"调用成功","data":...}
 
6. 子弹碰撞判定
    1. 子弹碰撞检测处理
    2. 入参对象属性: roomCode(游戏会话标识，必填)、bulletCode(子弹唯一标识，必填)、posX(当前碰撞X坐标，必填)、posY(当前碰撞Y坐标，必填)
    3. 处理逻辑: 根据roomCode和bulletCode查询t_bullet_entity表，校验子弹是否存在且处于激活状态(is_active=1)。
    4. 返回结果: {"code":"000001","msg":"子弹不存在或已销毁","data":...}
    5. 处理逻辑: 校验游戏房间状态，查询t_game_room表，如果game_status不为1(进行中)，则不予处理。
    6. 返回结果: {"code":"000001","msg":"游戏非进行中状态","data":...}
    7. 处理逻辑: 根据posX和posY查询t_map_obstacle表，判断是否存在未破坏(is_destroyed=0)的障碍物。
    8. 处理逻辑: 如果击中的是砖墙(obstacle_type=1)，更新t_map_obstacle表将is_destroyed设为1，更新t_bullet_entity表将is_active设为0，并返回碰撞结果。
    9. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"brick","destroyed":true}}
    10. 处理逻辑: 如果击中的是钢墙(obstacle_type=2)，查询子弹类型bullet_type，如果是增强子弹(bullet_type=2)，则更新t_map_obstacle表将is_destroyed设为1；如果是普通子弹，则仅销毁子弹。更新t_bullet_entity表将is_active设为0。
    11. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"steel","destroyed":false}}
    12. 处理逻辑: 如果击中的是基地(obstacle_type=5)，更新t_map_obstacle表将is_destroyed设为1，更新t_bullet_entity表将is_active设为0，并触发游戏失败逻辑(调用游戏结算服务)。
    13. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"base","gameOver":true}}
    14. 处理逻辑: 如果未击中障碍物，根据posX和posY查询t_tank_entity表，判断是否存在存活(is_alive=1)的坦克。
    15. 处理逻辑: 如果击中坦克，判断owner_tank_code与被击中坦克的tank_code是否相同，若相同则为误伤自己，仅销毁子弹。
    16. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"self"}}
    17. 处理逻辑: 如果击中敌方坦克(tank_type=2)，查询坦克的护盾状态shield_status。如果shield_status=1，则仅销毁子弹；如果shield_status=0，更新t_tank_entity表将is_alive设为0，更新t_bullet_entity表将is_active设为0，并通知敌方坦克智能控制模块移除该坦克。
    18. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"enemyTank","killed":true}}
    19. 处理逻辑: 如果击中玩家坦克(tank_type=1)，查询坦克的护盾状态shield_status。如果shield_status=1，则仅销毁子弹；如果shield_status=0，更新t_player_status表减少lives，若lives大于0则重置坦克位置，若lives等于0则更新t_tank_entity表将is_alive设为0并触发游戏结束流程。
    20. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"playerTank","livesRemaining":2}}
    21. 处理逻辑: 如果未击中任何目标，返回未碰撞结果。
    22. 返回结果: {"code":"000000","msg":"调用成功","data":{"hitType":"none"}}
 
7. 基地保护判定
    1. 基地受损判定
    2. 入参对象属性: roomCode(游戏会话标识，必填)、bulletCode(子弹唯一标识，必填)
    3. 处理逻辑: 根据roomCode查询游戏房间信息，如果房间不存在或游戏状态不为“进行中”，返回失败信息
    4. 返回结果:{"code":"000001","msg":"游戏房间不存在或未开始","data":...}
    5. 处理逻辑: 根据bulletCode查询子弹实体信息，如果子弹不存在或未激活，返回失败信息
    6. 返回结果:{"code":"000001","msg":"子弹信息不存在","data":...}
    7. 处理逻辑: 根据roomCode和障碍物类型为“基地”查询地图障碍物状态表(t_map_obstacle)，获取基地坐标信息
    8. 处理逻辑: 计算子弹当前坐标与基地坐标是否重叠，如果重叠则判定基地受损
    9. 处理逻辑: 如果基地未受损，返回判定结果
    10. 返回结果:{"code":"000000","msg":"基地安全","data":{"damaged":false}}
    11. 处理逻辑: 如果基地受损，更新地图障碍物状态表(t_map_obstacle)中基地的is_destroyed状态为1(已破坏)
    12. 处理逻辑: 更新子弹实体表(t_bullet_entity)中该子弹的is_active状态为0(已销毁)
    13. 处理逻辑: 更新游戏房间表(t_game_room)的游戏状态为3(结束)
    14. 处理逻辑: 查询玩家状态表(t_player_status)获取当前玩家得分
    15. 处理逻辑: 查询关卡进度表(t_level_progress)获取当前通关关卡数
    16. 处理逻辑: 在游戏结算记录表(t_game_settlement)中插入结算记录，结果为0(失败)，记录最终得分和通关关卡数
    17. 返回结果:{"code":"000000","msg":"基地被摧毁，游戏结束","data":{"damaged":true,"gameResult":0}}
 
8. 道具系统管理
    1. 生成道具
    2. 入参对象属性: roomCode(游戏会话标识，必填)、propType(道具类型，必填)、posX(X坐标，必填)、posY(Y坐标，必填)
    3. 处理逻辑: 校验游戏房间是否存在且状态为进行中。
    4. 返回结果: {"code":"000001","msg":"游戏房间不存在或未开始","data":...}
    5. 处理逻辑: 构建道具实体对象，生成唯一道具标识。
    6. 处理逻辑: 将道具信息保存至道具实体表(t_prop_entity)。
    7. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    8. 拾取道具
    9. 入参对象属性: roomCode(游戏会话标识，必填)、tankCode(拾取者坦克标识，必填)、propCode(道具唯一标识，必填)
    10. 处理逻辑: 校验道具是否存在且未被拾取。
    11. 返回结果: {"code":"000001","msg":"道具不存在或已被拾取","data":...}
    12. 处理逻辑: 校验坦克是否存在且存活。
    13. 返回结果: {"code":"000001","msg":"坦克不存在或已阵亡","data":...}
    14. 处理逻辑: 更新道具实体表(t_prop_entity)中的状态为已拾取。
    15. 处理逻辑: 根据道具类型执行生效逻辑：
    16. 1. 速度提升(1)：更新坦克实体表(t_tank_entity)的速度字段，并在道具效果表(t_prop_effect)记录持续效果。
    17. 2. 火力提升(2)：更新坦克实体表(t_tank_entity)的火力等级，并在道具效果表(t_prop_effect)记录持续效果。
    18. 3. 护盾(3)：更新坦克实体表(t_tank_entity)的护盾状态，并在道具效果表(t_prop_effect)记录持续效果。
    19. 4. 生命(4)：增加玩家状态表(t_player_status)中的生命值。
    20. 5. 炸弹(5)：触发全屏敌方坦克销毁逻辑（更新敌方坦克状态为已销毁）。
    21. 6. 冻结(6)：更新所有敌方坦克实体表(t_tank_entity)的冻结状态，并在道具效果表(t_prop_effect)记录持续效果。
    22. 返回结果: {"code":"000000","msg":"调用成功","data":...}
    23. 清除过期道具效果
    24. 入参对象属性: roomCode(游戏会话标识，必填)
    25. 处理逻辑: 查询道具效果表(t_prop_effect)中当前时间已过期的生效记录。
    26. 处理逻辑: 遍历过期记录，根据道具类型反向操作：
    27. 1. 速度提升：恢复坦克默认速度。
    28. 2. 火力提升：恢复坦克默认火力。
    29. 3. 护盾：清除坦克护盾状态。
    30. 6. 冻结：解除敌方坦克冻结状态。
    31. 处理逻辑: 更新坦克实体表(t_tank_entity)中对应的状态字段。
    32. 处理逻辑: 更新道具效果表(t_prop_effect)中的状态为已失效。
    33. 返回结果: {"code":"000000","msg":"调用成功","data":...}
 
9. 关卡进度管理
    1. 消灭敌人进度更新
    2. 入参对象属性: roomCode(游戏会话标识，必填)、enemyKilledCount(本次消灭敌人数量，必填)
    3. 处理逻辑:根据roomCode查询t_level_progress表，确认游戏状态是否为进行中
    4. 处理逻辑:如果进度记录不存在，返回失败信息
    5. 返回结果:{"code":"000001","msg":"游戏进度信息不存在","data":...}
    6. 处理逻辑:更新t_level_progress表中的enemy_killed字段，值为原值加上enemyKilledCount
    7. 处理逻辑:判断更新后的enemy_killed是否大于等于enemy_total
    8. 处理逻辑:如果消灭数量达到总数，判定当前关卡通过，更新is_passed状态为1
    9. 返回结果:{"code":"000000","msg":"进度更新成功","data":{"currentKilled":...,"isLevelPassed":...}}
    10. 处理逻辑:如果消灭数量未达标，返回当前进度数据
    11. 返回结果:{"code":"000000","msg":"进度更新成功","data":{"currentKilled":...,"isLevelPassed":false}}
    12. 关卡结算与切换
    13. 入参对象属性: roomCode(游戏会话标识，必填)
    14. 处理逻辑:根据roomCode查询t_level_progress表获取当前关卡信息
    15. 处理逻辑:校验当前关卡是否已标记为通过(is_passed=1)
    16. 处理逻辑:如果当前关卡未通过，返回失败信息
    17. 返回结果:{"code":"000001","msg":"当前关卡尚未通过","data":...}
    18. 处理逻辑:计算下一关卡ID(current_level_id + 1)
    19. 处理逻辑:查询t_level_map_config表，判断下一关卡ID是否存在
    20. 处理逻辑:如果下一关卡存在，执行关卡切换逻辑
    21. 处理逻辑:更新t_level_progress表，设置current_level_id为下一关卡ID，重置enemy_killed为0，is_passed为0，并根据新关卡配置更新enemy_total
    22. 处理逻辑:清理当前房间的残留数据，包括删除t_tank_entity中该房间敌方坦克记录、删除t_bullet_entity中该房间子弹记录、删除t_prop_entity中该房间道具记录、重置t_map_obstacle中该房间的障碍物状态
    23. 返回结果:{"code":"000000","msg":"切换至下一关","data":{"nextLevelId":...}}
    24. 处理逻辑:如果下一关卡不存在，判定为通关所有关卡，触发游戏胜利结算
    25. 处理逻辑:更新t_game_room表，将game_status置为3(结束)
    26. 处理逻辑:查询t_player_status获取最终得分、生命值等信息
    27. 处理逻辑:组装结算数据并插入t_game_settlement表，result置为1(胜利)
    28. 返回结果:{"code":"000000","msg":"游戏通关，正在结算","data":{"result":1,"finalScore":...}}
    29. 查询当前关卡进度
    30. 入参对象属性: roomCode(游戏会话标识，必填)
    31. 处理逻辑:根据roomCode查询t_level_progress表
    32. 处理逻辑:如果记录不存在，返回失败信息
    33. 返回结果:{"code":"000001","msg":"进度信息不存在","data":...}
    34. 处理逻辑:获取current_level_id、enemy_total、enemy_killed等字段
    35. 返回结果:{"code":"000000","msg":"调用成功","data":{"levelId":...,"enemyTotal":...,"enemyKilled":...}}
 
10. 游戏结算服务
    1. 生成游戏结算报告
    2. 入参对象属性:roomCode(游戏会话标识，必填)、playerId(玩家标识，必填)、settlementType(结算类型，必填，0:失败结算，1:胜利结算)
    3. 处理逻辑:根据roomCode查询t_game_room表，校验游戏房间是否存在
    4. 返回结果:{"code":"000001","msg":"游戏房间不存在","data":...}
    5. 处理逻辑:根据roomCode和playerId查询t_player_status表，获取玩家的当前得分和生命值状态
    6. 处理逻辑:根据roomCode查询t_level_progress表，获取当前关卡ID和通关状态
    7. 处理逻辑:如果settlementType为1(胜利)，则通关关卡数等于当前关卡ID；如果settlementType为0(失败)，则通关关卡数为当前关卡ID减1
    8. 处理逻辑:根据玩家生命值判断存活状态，若生命值大于0则存活状态为1(存活)，否则为0(阵亡)
    9. 处理逻辑:组装结算数据对象，包含最终得分、存活状态、通关关卡数、游戏结果
    10. 处理逻辑:将结算数据插入t_game_settlement表进行持久化保存
    11. 处理逻辑:更新t_game_room表中的game_status为3(结束)
    12. 返回结果:{"code":"000000","msg":"调用成功","data":...}


## 五、生成源码

![](/images/2026/FeiSuan/5-generate-code1.jpeg)

![](/images/2026/FeiSuan/5-generate-code2.jpeg)

![](/images/2026/FeiSuan/5-generate-code3.jpeg)


## 参考资料
- [飞算 JavaAI](https://www.feisuanyz.com/home)
- [飞算 JavaAI - 新手指引](https://www.feisuanyz.com/docs/languages/help.html)
- [从零上手Quarkus：飞算JavaAI的“智能引导”让我半天完成项目原型](https://cloud.tencent.com/developer/article/2629904)

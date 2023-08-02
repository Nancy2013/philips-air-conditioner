<!--
 * @Author: your name
 * @Date: 2019-06-26 17:37:54
 * @LastEditTime: 2022-07-25 10:42:24
 * @LastEditors: Juliette.Wang nannan.wang@broadlink.com.cn
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-cli2-mobile\README.md
-->

# 飞利浦空调

> 飞利浦空调

- 适配机型及型号
  - 飞利浦挂机 Devicetype: 27024 PID: 00000000000000000000000090690000
  - 飞利浦柜机 Devicetype: 27025 PID: 00000000000000000000000091690000
  - 飞利浦挂机(创维) Devicetype: 21020 PID: 0000000000000000000000001c520000
  - 飞利浦柜机(创维) Devicetype: 21021 PID: 0000000000000000000000001d520000
- 固件(老电控协议)

## 运行

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run start

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 框架配置

- package iotPlatform 配置平台
- page 界面
- router 路由
- store 存储设备状态
- service sdk 及 http 请求 api
- mock 模拟数据
- config 设备参数值及互斥配置

## 功能模块

> src - page

- 主控界面 page-main
- 定时模块 page-timer
- 睡眠模块 page-sleep
- 场景模块 src- custom-scene

## 公共组件

> src - components

## 公共逻辑

> src - mixins

## 多语言

> src - locale

## UI

- codesign: https://codesign.qq.com/s/wRap9x5qPe0r4gN/RG6X0kn3Wb9xEPB/inspect

- figma: https://www.figma.com/file/tVRNZbigeArvgmfZUEs0On/Cool-Home-app5?node-id=26%3A2931

## 控制逻辑

### 设备控制

- 通过设备 pid 区分柜机和挂机，新增下发 model 字段

  ```JavaScript
  // 柜机
  control({...params,model:1});
  // 挂机
  control({...params,model:2});
  ```

### 特殊处理

- 温度:temp 字段

  ```JavaScript
  // 老电控协议，温度值*10下发
  control({temp:temp*10})
  ```

- 环境温度:envtemp，故障码:ac_errcode1，故障码标识:err_flag，设备不能主动上报，需要独立接口请求

  ```JavaScript

  // 命令及参数
  // 具体查询 src-service-sdkAsk-getDeviceType 方法
  const params=[
    "00000000000000000000c8f742fef944",
    null,
    {
        "did": "00000000000000000000c8f742fef944",
        "srv": [
            "108.1.40"
        ],
        "act": "get",
        "params": [
            "mode"
        ],
        "vals": [
            [
                {
                    "val": 0,
                    "idx": 1
                }
            ]
        ]
    },
    "dev_ctrl",
    {
        "localTimeout": 3000,
        "remoteTimeout": 5000,
        "sendCount": 3
    }
  ]

  platformSDK.callNative('devicecontrol', params);
  ```

  ```JavaScript
  // 返回值
  {"envtemp":209,"model":1,"ac_errcode1":0,"err_flag":0,"new_type":1}
  ```

- 故障码文案，需要独立接口请求，并需要云端添加对应设备的文案

```JavaScript
  // api: farm/product/v1/system/faultquery
  // 具体查询 src-service-sdkAsk-cloudServices 方法
```

## 文档

### 路径

- 设备需求相关：路径 doc - 设备
- tapd 问题记录(内部)：https://www.tapd.cn/tapd_fe/58872668/bug/list
- tapd 问题记录(外部)：https://www.tapd.cn/tapd_fe/65287890/bug/list

## Diff

### 飞利浦空调(创维)

- 温度范围 16-31，步长 1
- 清洁功能 15min
- 无睡眠 DIY 功能

## 参考

> 奥克斯空调(http://gitlab.broadlink.com.cn/cloud/auxh5ui/tree/dev)
> 互斥逻辑同奥克斯空调
> PM(王树友) 开发(黄起斌)

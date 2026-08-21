# @luka-cat-mimi/n8n-nodes-yingdao-rpa

影刀 RPA 开放接口的 n8n 社区节点。覆盖企业账号、应用、机器人、Job 调度、常规任务、工作队列与运行记录。

节点名称：`yingdaoRpa`  
凭证名称：`影刀 RPA API`（`yingdaoRpaApi`）

官方鉴权文档：[获取 Token](https://www.yingdao.com/yddoc/rpa/zh-CN/710499792859115520)  
启动应用文档：[启动应用运行](https://www.yingdao.com/yddoc/rpa/710488569666060288)

## 安装

参考：[n8n 社区节点安装指南](https://docs.n8n.io/integrations/community-nodes/installation/)

节点包名：`@luka-cat-mimi/n8n-nodes-yingdao-rpa`

```bash
npm install @luka-cat-mimi/n8n-nodes-yingdao-rpa
```

## 凭证配置

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| API 基础地址 | 是 | 公有云默认 `https://api.yingdao.com`，专有云填专有云地址 |
| Access Key ID | 是 | 企业管理员在影刀控制台 API 配置中创建。平台级凭证通常带 `@platform` 后缀，运行日志等接口需要平台级凭证 |
| Access Key Secret | 是 | 与 Access Key ID 成对的密钥 |

保存凭证时会调用 `GET /oapi/token/v2/token/create` 获取 `accessToken`，后续请求自动带 `Authorization: Bearer`。Token 过期（`code=401`）时节点会清 token 并重试一次。

## 功能列表

共计 **8 个资源**、**43 个操作**。

### 账号 (5)

- 创建企业用户
- 删除企业用户
- 获取企业用户列表
- 修改企业用户
- 重置密码

### 应用 (6)

- 查询应用列表
- 查询已发布版本详情及参数
- 查询当前开发版本明细
- 版本历史列表
- 获取子流程/指令集列表
- 转移应用 Owner

### 机器人 (4)

- 机器人列表
- 机器人详情
- 机器人分组列表
- 查询最后心跳时间

### Job 调度 (10)

- 启动一次执行
- 启动 Job 并且 Wait
- 查询 Job 详情
- 查询 Job 集合
- 停止执行
- 重试执行
- 提交日志查询请求
- 轮询日志结果
- 同步查询日志
- 上传文件

### 常规任务 (2)

- 常规任务列表
- 常规任务详情

### 任务执行 (6)

- 触发常规任务执行
- 查询执行记录
- 查询最新执行记录
- 查询任务运行总详情
- 查询执行过程明细
- 停止常规任务

### 工作队列 (9)

- 查询队列列表
- 分页查询队列项
- 入队
- 出列
- 重新排队
- 修改队列项
- 批量修改状态
- 计数队列项
- 查询可流转状态

### 运行记录 (1)

- 分页查询运行记录

## 启动 Job

### 启动一次执行

`POST /oapi/dispatch/v2/job/start`，立即返回 `jobUuid`，不等待应用跑完。

| 字段 | 说明 |
| --- | --- |
| 执行目标 | 指定单台机器人，或指定机器人分组 |
| 机器人账号 (accountName) | 机器人**注册账号**，格式如 `admin@公司标识`。从控制台「机器人管理」列表复制名称，**不要填机器人 UUID / 应用 UUID** |
| 机器人分组 UUID | 仅分组模式需要 |
| 应用 UUID (robotUuid) | 必填，应用详情中的 UUID |
| 运行参数 | 只填参数名、参数值、类型；方向固定为 `In` |

`accountName` 与 `robotClientGroupUuid` 二选一。未填账号时影刀会返回 `accountName参数错误`。

### 启动 Job 并且 Wait

同样调用 `job/start`，但会把 n8n 的 `$execution.resumeUrl`（`/webhook-waiting/{executionId}`）自动写入 `callbackUrl`，然后暂停工作流，直到影刀 Job 结束回调。

- n8n 必须有影刀能访问的**公网地址**
- 一次只处理一条输入
- 不必再接 Wait 节点
- 影刀每个 Job 结束后单独 POST 一次；query 会带 `bodyMd5` / `timestamp` / `sign`
- 节点立刻回 2xx，避免影刀按非 2xx 在 24 小时内补偿重试
- 可在「限制等待时间」里设置最长等待，默认一直等到回调

回调输出包含 `jobUuid`、最终状态、出参 `result`、机器人信息、开始/结束时间、截图地址等。

### 输出自动转换

两个启动操作的 Options 里都有 **输出自动转换**。开启后，若返回中有 `result` 数组，会额外生成 `resultObj`（原 `result` 仍保留）：

- 按 `name` 转成对象
- `value` 若是 JSON 字符串会自动解析

原始 `result`：

```json
[
  {
    "name": "result1",
    "type": "str",
    "value": "{\"account\": \"这个是帐户\", \"password\": \"hunuhnghhh\", \"isSupport\": true, \"numberTest\": 0}"
  },
  {
    "name": "result2",
    "type": "str",
    "value": "我是结果2"
  }
]
```

转换后的 `resultObj`：

```json
{
  "result1": {
    "account": "这个是帐户",
    "password": "hunuhnghhh",
    "isSupport": true,
    "numberTest": 0
  },
  "result2": "我是结果2"
}
```

## 节点操作一览

### 账号

| 操作 | 接口 |
| --- | --- |
| 创建企业用户 | `POST /oapi/rpa/user/v1/create` |
| 删除企业用户 | `POST /oapi/rpa/user/v1/delete` |
| 获取企业用户列表 | `GET /oapi/rpa/user/v1/list` |
| 修改企业用户 | `POST /oapi/rpa/user/v1/modify` |
| 重置密码 | `POST /oapi/useracl/v1/rest/pwd` |

### 应用

| 操作 | 接口 |
| --- | --- |
| 查询应用列表 | `POST /oapi/app/open/query/list` |
| 查询已发布版本详情及参数 | `GET /oapi/app/open/query/appOnlineDetailWithParam` |
| 查询当前开发版本明细 | `GET /oapi/app/open/query/appVersionDetail` |
| 版本历史列表 | `POST /oapi/app/open/historyVersionList` |
| 获取子流程/指令集列表 | `GET /oapi/app/open/queryVersionFlowList` |
| 转移应用 Owner | `POST /oapi/app/open/translate/owner` |

### 机器人

| 操作 | 接口 |
| --- | --- |
| 机器人列表 | `POST /oapi/dispatch/v2/client/list` |
| 机器人详情 | `POST /oapi/dispatch/v2/client/query` |
| 机器人分组列表 | `POST /oapi/dispatch/v2/client/group/list` |
| 查询最后心跳时间 | `POST /oapi/dispatch/v2/client/getLastHeartTime` |

### Job 调度

| 操作 | 接口 |
| --- | --- |
| 启动一次执行 | `POST /oapi/dispatch/v2/job/start` |
| 启动 Job 并且 Wait | `POST /oapi/dispatch/v2/job/start` + n8n Wait |
| 查询 Job 详情 | `POST /oapi/dispatch/v2/job/query` |
| 查询 Job 集合 | `POST /oapi/dispatch/v2/job/list` |
| 停止执行 | `POST /oapi/dispatch/v2/job/stop` |
| 重试执行 | `POST /oapi/dispatch/v2/job/retry` |
| 提交日志查询请求 | `POST /oapi/dispatch/v2/job/log/notify` |
| 轮询日志结果 | `GET /oapi/dispatch/v2/job/log/query` |
| 同步查询日志 | `POST /oapi/dispatch/v2/job/log/search` |
| 上传文件 | `POST /oapi/dispatch/v2/file/upload` |

### 常规任务 / 任务执行

| 操作 | 接口 |
| --- | --- |
| 常规任务列表 | `POST /oapi/dispatch/v2/schedule/list` |
| 常规任务详情 | `POST /oapi/dispatch/v2/schedule/detail` |
| 触发常规任务执行 | `POST /oapi/dispatch/v2/task/start` |
| 查询执行记录 | `POST /oapi/dispatch/v2/task/list` |
| 查询最新执行记录 | `POST /oapi/dispatch/v2/task/newest/list` |
| 查询任务运行总详情 | `POST /oapi/dispatch/v2/task/query` |
| 查询执行过程明细 | `POST /oapi/dispatch/v2/task/process/detail` |
| 停止常规任务 | `POST /oapi/dispatch/v2/task/stop` |

常规任务的创建/修改只能在控制台完成，OAPI 只提供 list/detail。触发执行后接口不直接返回 `taskUuid`，需再用「最新执行记录」或「执行记录列表」查询。

### 工作队列 / 运行记录

| 操作 | 接口 |
| --- | --- |
| 查询队列列表 | `GET /oapi/tool/queue/v1/queues` |
| 分页查询队列项 | `GET /oapi/tool/queue/v1/queues/{queueUuid}/queueItems` |
| 入队 | `POST /oapi/tool/queue/v1/queues/{queueUuid}/enqueue` |
| 出列 | `PATCH /oapi/tool/queue/v1/queues/{queueUuid}/dequeue` |
| 重新排队 | `PATCH /oapi/tool/queue/v1/queueitems/{itemUuid}/reenqueue` |
| 修改队列项 | `PATCH /oapi/tool/queue/v1/queueitems/{itemUuid}` |
| 批量修改状态 | `PATCH /oapi/tool/queue/v1/{queueUuid}/batchModifyQueueItemStatus` |
| 计数队列项 | `GET /oapi/tool/queue/v1/queues/{queueUuid}/count` |
| 查询可流转状态 | `GET /oapi/tool/queue/v1/status` |
| 分页查询运行记录 | `POST /oapi/app/open/query/pageRunRecordData` |

队列状态字面量带空格（`waiting effective`、`on hold`）。运行记录的 `minTime` / `maxTime` 必填，跨度不能超过 7 天。

## 通用参数

列表类操作提供 `Return All` / `Limit`。所有操作都提供 `Options`：

| 选项 | 说明 |
| --- | --- |
| Timeout | 单次请求超时（毫秒），0 表示不限制 |
| Batching | 添加后启用并发；启动 Job 并且 Wait 不会走并发 |
| 输出自动转换 | 仅两个启动 Job 操作。开启后增加 `resultObj` |

## 实现说明

- 资源与操作按文件自动加载：在 `nodes/YingdaoRpa/resource/` 新增模块即可
- 接口失败时抛出 `影刀接口错误：{msg}`
- 空字符串不会提交给影刀（`pickFilled` 会丢掉）
- Job 启动的运行参数方向固定为 `In`，不传描述字段

## 开发

```bash
npm install
npm run build
npm run lint
npm run dev
```

发布到 npm 请使用 `npm run release`。打出版本 tag 后，GitHub Actions 会按 provenance 要求发布社区节点。

## 许可证

MIT。详见 [LICENSE.md](./LICENSE.md)。

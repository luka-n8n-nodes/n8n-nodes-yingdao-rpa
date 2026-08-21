import type { INodePropertyOptions } from 'n8n-workflow';

export const ACCOUNT_TYPE_OPTIONS: INodePropertyOptions[] = [
	{ name: '基础账号', value: 'basic' },
	{ name: '高级账号', value: 'senior' },
];

export const USER_ROLE_OPTIONS: INodePropertyOptions[] = [
	{ name: '管理员', value: 'e_admin' },
	{ name: '普通员工', value: 'e_user' },
];

export const APP_TYPE_OPTIONS: INodePropertyOptions[] = [
	{ name: '应用', value: 'app' },
	{ name: '指令', value: 'activity' },
];

export const ROBOT_STATUS_OPTIONS: INodePropertyOptions[] = [
	{ name: '已连接 (connected)', value: 'connected' },
	{ name: '空闲 (idle)', value: 'idle' },
	{ name: '运行中 (running)', value: 'running' },
	{ name: '已分配 (allocated)', value: 'allocated' },
	{ name: '异常 (abnormal)', value: 'abnormal' },
	{ name: '离线 (offline)', value: 'offline' },
];

export const JOB_STATUS_OPTIONS: INodePropertyOptions[] = [
	{ name: '已创建 (created)', value: 'created' },
	{ name: '等待中 (waiting)', value: 'waiting' },
	{ name: '运行中 (running)', value: 'running' },
	{ name: '停止中 (stopping)', value: 'stopping' },
	{ name: '已停止 (stopped)', value: 'stopped' },
	{ name: '错误 (error)', value: 'error' },
	{ name: '已完成 (finish)', value: 'finish' },
	{ name: '已跳过 (skipped)', value: 'skipped' },
	{ name: '已取消 (cancel)', value: 'cancel' },
];

export const JOB_PRIORITY_OPTIONS: INodePropertyOptions[] = [
	{ name: '高 (high)', value: 'high' },
	{ name: '中 (middle)', value: 'middle' },
	{ name: '低 (low)', value: 'low' },
];

export const EXECUTE_SCOPE_OPTIONS: INodePropertyOptions[] = [
	{ name: '任意一台 (any)', value: 'any' },
	{ name: '全部 (all)', value: 'all' },
];

export const WAIT_TIMEOUT_OPTIONS: INodePropertyOptions[] = [
	'1s',
	'5s',
	'10s',
	'30s',
	'1m',
	'2m',
	'3m',
	'4m',
	'5m',
	'6m',
	'7m',
	'8m',
	'9m',
	'10m',
	'20m',
	'30m',
	'1h',
	'2h',
].map((value) => ({ name: value, value }));

export const ROBOT_PARAM_TYPE_OPTIONS: INodePropertyOptions[] = [
	{ name: '字符串 (str)', value: 'str' },
	{ name: '整数 (int)', value: 'int' },
	{ name: '浮点 (float)', value: 'float' },
	{ name: '布尔 (bool)', value: 'bool' },
	{ name: '文件 (file)', value: 'file' },
	{ name: '密码 (password)', value: 'password' },
];

export const QUEUE_STATUS_OPTIONS: INodePropertyOptions[] = [
	{ name: '待生效 (waiting effective)', value: 'waiting effective' },
	{ name: '排队中 (queued)', value: 'queued' },
	{ name: '处理中 (processing)', value: 'processing' },
	{ name: '已处理 (processed)', value: 'processed' },
	{ name: '异常 (exception)', value: 'exception' },
	{ name: '挂起 (on hold)', value: 'on hold' },
	{ name: '过期 (expired)', value: 'expired' },
];

export const QUEUE_PRIORITY_OPTIONS: INodePropertyOptions[] = [
	{ name: '高 (0)', value: 0 },
	{ name: '中 (100)', value: 100 },
	{ name: '低 (200)', value: 200 },
];

export const QUEUE_SOURCE_OPTIONS: INodePropertyOptions[] = [
	{ name: 'RPA Client', value: 'RPA Client' },
	{ name: 'Console', value: 'Console' },
	{ name: 'Import', value: 'Import' },
	{ name: 'IPaaS', value: 'IPaaS' },
	{ name: 'OpenAPI', value: 'OpenAPI' },
];

export const START_MODEL_OPTIONS: INodePropertyOptions[] = [
	{ name: '计划 (schedule)', value: 'schedule' },
	{ name: '触发器 (Trigger)', value: 'Trigger' },
	{ name: '手工执行 (Manual)', value: 'Manual' },
	{ name: '自动执行 (Autorun)', value: 'Autorun' },
	{ name: '调度 (Assistant)', value: 'Assistant' },
	{ name: '邮件触发 (emailtrigger)', value: 'emailtrigger' },
	{ name: '文件触发 (filetrigger)', value: 'filetrigger' },
	{ name: '热键触发 (hotkeytrigger)', value: 'hotkeytrigger' },
];

export const CURSOR_DIRECTION_OPTIONS: INodePropertyOptions[] = [
	{ name: '下一页 (next)', value: 'next' },
	{ name: '上一页 (pre)', value: 'pre' },
];

import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeOperationError, WAIT_INDEFINITELY } from 'n8n-workflow';
import RequestUtils from './RequestUtils';
import { pickFilled, toNumberOrUndefined } from './parameters';
import {
	EXECUTE_SCOPE_OPTIONS,
	JOB_PRIORITY_OPTIONS,
	WAIT_TIMEOUT_OPTIONS,
} from './constants';
import { readRobotParams, robotParamsCollection } from './robotParams';

const jobStartAdditionalOptions = (includeCallbackUrl: boolean): INodeProperties[] => {
	const options: INodeProperties[] = [
		{
			displayName: '运行超时（秒）',
			name: 'runTimeout',
			type: 'number',
			default: 60,
			description: '范围 60 ~ 950500',
		},
		{
			displayName: '启用排队等待超时',
			name: 'enableWaitTimeout',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '等待超时档位',
			name: 'waitTimeout',
			type: 'options',
			options: WAIT_TIMEOUT_OPTIONS,
			default: '10m',
			description: '仅当启用等待超时且未填秒数时使用。只能是固定档位',
		},
		{
			displayName: '等待超时（秒）',
			name: 'waitTimeoutSeconds',
			type: 'number',
			default: 0,
			description: '推荐。任意秒数，不受档位限制',
		},
		{
			displayName: '幂等 UUID',
			name: 'idempotentUuid',
			type: 'string',
			default: '',
			description: '不超过 36 字符，同租户内唯一',
		},
	];

	if (includeCallbackUrl) {
		options.push({
			displayName: '回调地址',
			name: 'callbackUrl',
			type: 'string',
			default: '',
		});
	}

	options.push(
		{
			displayName: '留存云端日志',
			name: 'enableCloudLog',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '留存云端录屏',
			name: 'enableCloudScreenRecord',
			type: 'boolean',
			default: false,
		},
		{
			displayName: '备注',
			name: 'summary',
			type: 'string',
			default: '',
			description: '不超过 128 字符',
		},
	);

	return options;
};

export function jobStartFields(options: {
	notice: string;
	includeCallbackUrl: boolean;
}): INodeProperties[] {
	return [
		{
			displayName: options.notice,
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '执行目标',
			name: 'targetType',
			type: 'options',
			options: [
				{ name: '指定单台机器人', value: 'account' },
				{ name: '指定机器人分组', value: 'group' },
			],
			default: 'account',
		},
		{
			displayName: '机器人账号 (accountName)',
			name: 'accountName',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'admin@公司标识',
			description:
				'机器人注册账号，从控制台「机器人管理」列表复制名称，不要填 UUID。仅在指定单台机器人时需要。',
			displayOptions: {
				hide: {
					targetType: ['group'],
				},
			},
		},
		{
			displayName: '机器人分组 UUID',
			name: 'robotClientGroupUuid',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					targetType: ['group'],
				},
			},
		},
		{
			displayName: '执行范围',
			name: 'executeScope',
			type: 'options',
			options: EXECUTE_SCOPE_OPTIONS,
			default: 'any',
			description: '仅对分组生效',
			displayOptions: {
				show: {
					targetType: ['group'],
				},
			},
		},
		{
			displayName: '应用 UUID',
			name: 'robotUuid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '优先级',
			name: 'priority',
			type: 'options',
			options: JOB_PRIORITY_OPTIONS,
			default: 'middle',
		},
		robotParamsCollection,
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加字段',
			default: {},
			options: jobStartAdditionalOptions(options.includeCallbackUrl),
		},
	];
}

export async function startYingdaoJob(
	context: IExecuteFunctions,
	index: number,
	callbackUrl?: string,
): Promise<IDataObject> {
	const targetType = context.getNodeParameter('targetType', index) as string;
	const additional = context.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const params = readRobotParams(context, index);
	const enableWaitTimeout = additional.enableWaitTimeout === true;
	const waitTimeoutSeconds = toNumberOrUndefined(additional.waitTimeoutSeconds);
	const accountName =
		targetType === 'account'
			? String(context.getNodeParameter('accountName', index, '')).trim()
			: '';
	const robotClientGroupUuid =
		targetType === 'group'
			? String(context.getNodeParameter('robotClientGroupUuid', index, '')).trim()
			: '';

	if (targetType === 'account' && !accountName) {
		throw new NodeOperationError(
			context.getNode(),
			'指定单台机器人时必须填写 accountName。请填机器人注册账号（如 admin@公司标识），可从影刀控制台「机器人管理」复制，不要填机器人 UUID。',
			{ itemIndex: index },
		);
	}
	if (targetType === 'group' && !robotClientGroupUuid) {
		throw new NodeOperationError(context.getNode(), '指定机器人分组时必须填写 robotClientGroupUuid', {
			itemIndex: index,
		});
	}

	return RequestUtils.request.call(context, {
		method: 'POST',
		url: '/oapi/dispatch/v2/job/start',
		body: pickFilled({
			accountName: targetType === 'account' ? accountName : undefined,
			robotClientGroupUuid: targetType === 'group' ? robotClientGroupUuid : undefined,
			executeScope:
				targetType === 'group'
					? context.getNodeParameter('executeScope', index, 'any')
					: undefined,
			robotUuid: context.getNodeParameter('robotUuid', index),
			priority: context.getNodeParameter('priority', index),
			params: params.length ? params : undefined,
			runTimeout: toNumberOrUndefined(additional.runTimeout),
			enableWaitTimeout: enableWaitTimeout ? true : undefined,
			waitTimeout:
				enableWaitTimeout && !waitTimeoutSeconds ? additional.waitTimeout : undefined,
			waitTimeoutSeconds: enableWaitTimeout ? waitTimeoutSeconds : undefined,
			idempotentUuid: additional.idempotentUuid,
			callbackUrl: callbackUrl ?? additional.callbackUrl,
			enableCloudLog: additional.enableCloudLog,
			enableCloudScreenRecord: additional.enableCloudScreenRecord,
			summary: additional.summary,
		}),
	});
}

export function getResumeUrl(context: IExecuteFunctions, index: number): string {
	const resumeUrl = String(
		context.evaluateExpression('{{ $execution.resumeUrl }}', index) ?? '',
	).trim();
	if (!resumeUrl) {
		throw new NodeOperationError(
			context.getNode(),
			'无法获取 n8n Wait 回调地址（$execution.resumeUrl）。请确认当前执行可以进入等待状态，且 n8n 配置了可被影刀访问的公网地址。',
			{ itemIndex: index },
		);
	}
	return resumeUrl;
}

export function getWaitTill(context: IExecuteFunctions, index: number): Date {
	const limitWaitTime = context.getNodeParameter('limitWaitTime', index, false) as boolean;
	if (!limitWaitTime) {
		return WAIT_INDEFINITELY;
	}

	let waitAmount = context.getNodeParameter('resumeAmount', index, 24) as number;
	const resumeUnit = context.getNodeParameter('resumeUnit', index, 'hours') as string;
	if (resumeUnit === 'minutes') {
		waitAmount *= 60;
	} else if (resumeUnit === 'hours') {
		waitAmount *= 60 * 60;
	} else if (resumeUnit === 'days') {
		waitAmount *= 60 * 60 * 24;
	}
	return new Date(Date.now() + waitAmount * 1000);
}

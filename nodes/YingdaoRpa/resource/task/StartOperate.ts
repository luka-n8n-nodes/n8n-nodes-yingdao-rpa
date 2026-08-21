import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled, toNumberOrUndefined } from '../../../help/utils/parameters';
import { commonOptions } from '../../../help/utils/sharedOptions';

const StartOperate: ResourceOperations = {
	name: '触发常规任务执行',
	value: 'start',
	action: '触发常规任务执行',
	description: 'POST /oapi/dispatch/v2/task/start',
	order: 10,
	options: [
		{
			displayName:
				'该接口不直接返回 taskUuid。请随后用「最新执行记录」或「执行记录列表」（需 sourceUuid=scheduleUuid）查询。scheduleRelaParams 只能覆盖 Schedule 中已配置机器人的参数/超时，不能新增执行机器人。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Schedule UUID',
			name: 'scheduleUuid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '覆盖参数',
			name: 'scheduleRelaParams',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			placeholder: '添加机器人覆盖',
			default: {},
			options: [
				{
					name: 'item',
					displayName: '覆盖项',
					values: [
						{
							displayName: '运行超时（秒）',
							name: 'runTimeout',
							type: 'number',
							default: 0,
						},
						{
							displayName: '参数 JSON',
							name: 'paramsJson',
							type: 'json',
							default: '[]',
							description:
								'RobotParam 数组。type 只能是 str/int/float/bool/file/password，direction 只能是 In/Out',
						},
					],
				},
			],
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加字段',
			default: {},
			options: [
				{ displayName: '回调地址', name: 'callbackUrl', type: 'string', default: '' },
				{ displayName: '幂等 UUID', name: 'idempotentUuid', type: 'string', default: '' },
				{ displayName: '摘要', name: 'summary', type: 'string', default: '' },
			],
		},
		commonOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const collection = this.getNodeParameter('scheduleRelaParams', index, {}) as IDataObject;
		const items = (collection.item as IDataObject[]) ?? [];
		const scheduleRelaParams = items.map((item) => {
			let params: unknown = item.paramsJson;
			if (typeof params === 'string' && params.trim()) {
				params = JSON.parse(params);
			}
			return pickFilled({
				params: Array.isArray(params) ? params : undefined,
				runTimeout: toNumberOrUndefined(item.runTimeout),
			});
		});

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/task/start',
			body: pickFilled({
				scheduleUuid: this.getNodeParameter('scheduleUuid', index),
				scheduleRelaParams: scheduleRelaParams.length ? scheduleRelaParams : undefined,
				callbackUrl: additional.callbackUrl,
				idempotentUuid: additional.idempotentUuid,
				summary: additional.summary,
			}),
		});
	},
};

export default StartOperate;

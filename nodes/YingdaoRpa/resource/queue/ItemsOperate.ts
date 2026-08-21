import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled, toNumberOrUndefined } from '../../../help/utils/parameters';
import { QUEUE_STATUS_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ItemsOperate: ResourceOperations = {
	name: '分页查询队列项',
	value: 'items',
	action: '分页查询队列项',
	description: 'GET /oapi/tool/queue/v1/queues/{queueUuid}/queueItems',
	order: 20,
	requestIntervalMs: 0,
	options: [
		{
			displayName: 'startTime / endTime / 队列项时间字段都是秒级时间戳。状态字面量带空格（waiting effective、on hold）。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '队列 UUID',
			name: 'queueUuid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加筛选',
			default: {},
			options: [
				{
					displayName: '状态',
					name: 'status',
					type: 'options',
					options: QUEUE_STATUS_OPTIONS,
					default: 'queued',
				},
				{ displayName: '筛选字段', name: 'filterField', type: 'string', default: '' },
				{
					displayName: '开始时间（秒）',
					name: 'startTime',
					type: 'number',
					default: 0,
					description: '秒级时间戳，不是毫秒',
				},
				{
					displayName: '结束时间（秒）',
					name: 'endTime',
					type: 'number',
					default: 0,
					description: '秒级时间戳，不是毫秒',
				},
			],
		},
		paginationOptions.returnAll,
		paginationOptions.limit(20),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const queueUuid = this.getNodeParameter('queueUuid', index) as string;
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const result = await RequestUtils.requestPaged.call(this, {
			method: 'GET',
			url: `/oapi/tool/queue/v1/queues/${encodeURIComponent(queueUuid)}/queueItems`,
			pageIn: 'qs',
			qs: pickFilled({
				status: additional.status,
				filterField: additional.filterField,
				startTime: toNumberOrUndefined(additional.startTime),
				endTime: toNumberOrUndefined(additional.endTime),
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 20) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ItemsOperate;

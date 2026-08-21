import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled, toNumberOrUndefined } from '../../../help/utils/parameters';
import { QUEUE_PRIORITY_OPTIONS, QUEUE_SOURCE_OPTIONS } from '../../../help/utils/constants';
import { commonOptions } from '../../../help/utils/sharedOptions';

const EnqueueOperate: ResourceOperations = {
	name: '入队',
	value: 'enqueue',
	action: '队列项入队',
	description: 'POST /oapi/tool/queue/v1/queues/{queueUuid}/enqueue',
	order: 30,
	options: [
		{
			displayName:
				'priority 只能是 0/100/200。effectiveTime 必须早于或等于 expireTime。不传 expireTime 时会用队列默认过期间隔；队列没配置默认过期间隔则入队失败（不是永不过期）。时间戳为秒。',
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
			displayName: '队列项名称',
			name: 'name',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '优先级',
			name: 'priority',
			type: 'options',
			options: QUEUE_PRIORITY_OPTIONS,
			default: 100,
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加字段',
			default: {},
			options: [
				{
					displayName: '生效时间（秒）',
					name: 'effectiveTime',
					type: 'number',
					default: 0,
				},
				{
					displayName: '过期时间（秒）',
					name: 'expireTime',
					type: 'number',
					default: 0,
				},
				{ displayName: '业务信息', name: 'bizInfo', type: 'string', default: '' },
				{ displayName: '描述', name: 'description', type: 'string', default: '' },
				{
					displayName: '来源',
					name: 'source',
					type: 'options',
					options: QUEUE_SOURCE_OPTIONS,
					default: 'OpenAPI',
				},
			],
		},
		commonOptions,
	],
	async call(this, index) {
		const queueUuid = this.getNodeParameter('queueUuid', index) as string;
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/oapi/tool/queue/v1/queues/${encodeURIComponent(queueUuid)}/enqueue`,
			body: pickFilled({
				name: this.getNodeParameter('name', index),
				priority: this.getNodeParameter('priority', index),
				effectiveTime: toNumberOrUndefined(additional.effectiveTime),
				expireTime: toNumberOrUndefined(additional.expireTime),
				bizInfo: additional.bizInfo,
				description: additional.description,
				source: additional.source,
			}),
		});
	},
};

export default EnqueueOperate;

import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled, toNumberOrUndefined } from '../../../help/utils/parameters';
import { commonOptions } from '../../../help/utils/sharedOptions';

const ReenqueueOperate: ResourceOperations = {
	name: '重新排队',
	value: 'reenqueue',
	action: '队列项重新排队',
	description: 'PATCH /oapi/tool/queue/v1/queueitems/{itemUuid}/reenqueue',
	order: 50,
	options: [
		{
			displayName: '队列项 UUID',
			name: 'itemUuid',
			type: 'string',
			required: true,
			default: '',
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
				{ displayName: '描述', name: 'description', type: 'string', default: '' },
			],
		},
		commonOptions,
	],
	async call(this, index) {
		const itemUuid = this.getNodeParameter('itemUuid', index) as string;
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/oapi/tool/queue/v1/queueitems/${encodeURIComponent(itemUuid)}/reenqueue`,
			body: pickFilled({
				effectiveTime: toNumberOrUndefined(additional.effectiveTime),
				expireTime: toNumberOrUndefined(additional.expireTime),
				description: additional.description,
			}),
		});
	},
};

export default ReenqueueOperate;

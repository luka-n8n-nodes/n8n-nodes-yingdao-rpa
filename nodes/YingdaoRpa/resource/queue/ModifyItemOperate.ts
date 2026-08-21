import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { QUEUE_STATUS_OPTIONS } from '../../../help/utils/constants';
import { commonOptions } from '../../../help/utils/sharedOptions';

const ModifyItemOperate: ResourceOperations = {
	name: '修改队列项',
	value: 'modifyItem',
	action: '修改队列项',
	description: 'PATCH /oapi/tool/queue/v1/queueitems/{itemUuid}',
	order: 60,
	options: [
		{
			displayName:
				'修改前建议先查询可流转状态。processing 只能转到 processed / exception，不能改回排队或挂起。状态字面量带空格。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
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
					displayName: '目标状态',
					name: 'status',
					type: 'options',
					options: QUEUE_STATUS_OPTIONS,
					default: 'processed',
				},
				{ displayName: '描述', name: 'description', type: 'string', default: '' },
				{
					displayName: '事件通知',
					name: 'eventNotify',
					type: 'boolean',
					default: false,
				},
			],
		},
		commonOptions,
	],
	async call(this, index) {
		const itemUuid = this.getNodeParameter('itemUuid', index) as string;
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/oapi/tool/queue/v1/queueitems/${encodeURIComponent(itemUuid)}`,
			body: pickFilled({
				status: additional.status,
				description: additional.description,
				eventNotify: additional.eventNotify,
			}),
		});
	},
};

export default ModifyItemOperate;

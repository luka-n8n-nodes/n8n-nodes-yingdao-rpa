import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { QUEUE_STATUS_OPTIONS } from '../../../help/utils/constants';
import { commonOptions } from '../../../help/utils/sharedOptions';

const BatchModifyStatusOperate: ResourceOperations = {
	name: '批量修改状态',
	value: 'batchModifyStatus',
	action: '批量修改队列项状态',
	description: 'PATCH /oapi/tool/queue/v1/{queueUuid}/batchModifyQueueItemStatus',
	order: 70,
	options: [
		{
			displayName: '状态取值注意空格：waiting effective、on hold。',
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
			displayName: '源状态',
			name: 'sourceStatus',
			type: 'options',
			options: QUEUE_STATUS_OPTIONS,
			required: true,
			default: 'queued',
		},
		{
			displayName: '目标状态',
			name: 'targetStatus',
			type: 'options',
			options: QUEUE_STATUS_OPTIONS,
			required: true,
			default: 'on hold',
		},
		commonOptions,
	],
	async call(this, index) {
		const queueUuid = this.getNodeParameter('queueUuid', index) as string;
		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/oapi/tool/queue/v1/${encodeURIComponent(queueUuid)}/batchModifyQueueItemStatus`,
			body: pickFilled({
				sourceStatus: this.getNodeParameter('sourceStatus', index),
				targetStatus: this.getNodeParameter('targetStatus', index),
			}),
		});
	},
};

export default BatchModifyStatusOperate;

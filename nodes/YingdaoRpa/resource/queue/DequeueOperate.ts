import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { commonOptions } from '../../../help/utils/sharedOptions';

const DequeueOperate: ResourceOperations = {
	name: '出列',
	value: 'dequeue',
	action: '队列项出列',
	description: 'PATCH /oapi/tool/queue/v1/queues/{queueUuid}/dequeue',
	order: 40,
	options: [
		{
			displayName: '没有可出列的项时返回空结果（data 为空），不是报错，应按「暂无可用项」处理。',
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
			displayName: '事件通知',
			name: 'eventNotify',
			type: 'boolean',
			default: false,
		},
		commonOptions,
	],
	async call(this, index) {
		const queueUuid = this.getNodeParameter('queueUuid', index) as string;
		return RequestUtils.request.call(this, {
			method: 'PATCH',
			url: `/oapi/tool/queue/v1/queues/${encodeURIComponent(queueUuid)}/dequeue`,
			qs: pickFilled({
				eventNotify: this.getNodeParameter('eventNotify', index, false),
			}),
		});
	},
};

export default DequeueOperate;

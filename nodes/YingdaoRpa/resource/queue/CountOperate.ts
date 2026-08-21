import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { QUEUE_STATUS_OPTIONS } from '../../../help/utils/constants';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const CountOperate: ResourceOperations = {
	name: '计数队列项',
	value: 'count',
	action: '计数队列项',
	description: 'GET /oapi/tool/queue/v1/queues/{queueUuid}/count',
	order: 80,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '队列 UUID',
			name: 'queueUuid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '状态',
			name: 'status',
			type: 'options',
			options: [{ name: '全部', value: '' }, ...QUEUE_STATUS_OPTIONS],
			default: '',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const queueUuid = this.getNodeParameter('queueUuid', index) as string;
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/oapi/tool/queue/v1/queues/${encodeURIComponent(queueUuid)}/count`,
			qs: pickFilled({
				status: this.getNodeParameter('status', index, ''),
			}),
		});
	},
};

export default CountOperate;

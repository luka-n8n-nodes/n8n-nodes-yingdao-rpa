import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { QUEUE_STATUS_OPTIONS } from '../../../help/utils/constants';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ChangeableStatusOperate: ResourceOperations = {
	name: '查询可流转状态',
	value: 'changeableStatus',
	action: '查询某状态可以流转到哪些状态',
	description: 'GET /oapi/tool/queue/v1/status',
	order: 90,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '源状态',
			name: 'sourceStatus',
			type: 'options',
			options: QUEUE_STATUS_OPTIONS,
			required: true,
			default: 'queued',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: '/oapi/tool/queue/v1/status',
			qs: {
				sourceStatus: this.getNodeParameter('sourceStatus', index),
			},
		});
	},
};

export default ChangeableStatusOperate;
